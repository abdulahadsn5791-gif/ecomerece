const USAGE_TTL_SECONDS = 40 * 24 * 3_600; // ~40 days → auto monthly rollover

export interface VendorForceRefreshQuotaDeps {
  getQuota: () => Promise<number>;
  redisGet: (key: string) => Promise<string | null>;
  redisIncr: (key: string) => Promise<number>;
  redisExpire: (key: string, seconds: number) => Promise<unknown>;
}

export interface VendorForceRefreshConsumeResult {
  accepted: boolean;
  used: number;
  remaining: number;
}

export function vendorForceUsageKey(vendorId: string, month: string): string {
  return `stats:vendor:force:used:${vendorId}:${month}`;
}

export function currentMonthKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

/**
 * Per-vendor force-refresh budget. The admin sets a global allowance per vendor
 * (`vendorForceRefreshQuota`), usage is tracked per vendor per month in Redis
 * (month-scoped keys auto-rollover via TTL), and the vendor dashboard's
 * "Refresh stats now" button consumes one unit per run.
 *
 * Default deps are lazy dynamic imports so importing this module never opens a
 * Redis/Mongo connection (required for unit tests).
 */
export class VendorForceRefreshQuotaService {
  private readonly deps: VendorForceRefreshQuotaDeps;

  constructor(deps: Partial<VendorForceRefreshQuotaDeps> = {}) {
    this.deps = { ...VendorForceRefreshQuotaService.defaultDeps(), ...deps };
  }

  private static defaultDeps(): VendorForceRefreshQuotaDeps {
    return {
      getQuota: async () => {
        const { statsSyncSettingsService } = await import('./StatsSyncSettingsService');
        return (await statsSyncSettingsService.getSettings()).vendorForceRefreshQuota;
      },
      redisGet: async (key) => (await import('../../../lib/redis')).redis.get(key),
      redisIncr: async (key) => (await import('../../../lib/redis')).redis.incr(key),
      redisExpire: async (key, seconds) =>
        (await import('../../../lib/redis')).redis.expire(key, seconds),
    };
  }

  async getQuota(): Promise<number> {
    return this.deps.getQuota();
  }

  async getUsage(vendorId: string, month = currentMonthKey()): Promise<number> {
    const raw = await this.deps.redisGet(vendorForceUsageKey(vendorId, month));
    return raw ? Number(raw) : 0;
  }

  async getRemaining(vendorId: string): Promise<number> {
    const quota = await this.getQuota();
    const used = await this.getUsage(vendorId);
    return Math.max(quota - used, 0);
  }

  async can(vendorId: string): Promise<boolean> {
    return (await this.getRemaining(vendorId)) > 0;
  }

  async consume(vendorId: string): Promise<VendorForceRefreshConsumeResult> {
    const quota = await this.getQuota();
    if (quota <= 0) return { accepted: false, used: 0, remaining: 0 };

    const key = vendorForceUsageKey(vendorId, currentMonthKey());
    const used = await this.deps.redisIncr(key);
    if (used === 1) {
      // First use of the month: refresh the key's TTL so the counter rolls over.
      await this.deps.redisExpire(key, USAGE_TTL_SECONDS);
    }

    const remaining = Math.max(quota - used, 0);
    return { accepted: used <= quota, used, remaining };
  }
}

export const vendorForceRefreshQuotaService = new VendorForceRefreshQuotaService();
