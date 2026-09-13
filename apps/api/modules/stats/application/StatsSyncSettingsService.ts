import { redis } from '../../../lib/redis';

const KEY_INTERVAL = 'stats:product:sync_interval_hours';
const KEY_LAST_RUN = 'stats:product:sync_last_run';
const KEY_AUTO_ENABLED = 'stats:product:sync_auto_enabled';
const KEY_MAX_STALENESS = 'stats:max_staleness_hours';
const KEY_VENDOR_FORCE_QUOTA = 'stats:vendor:force:quota';

const DEFAULT_INTERVAL_HOURS = 6;
const DEFAULT_MAX_STALENESS_HOURS = 24;
const DEFAULT_VENDOR_FORCE_QUOTA = 5;

export interface StatsSyncSettings {
  intervalHours: number;
  lastRun: number | null;
  autoDenormalizeEnabled: boolean;
  /**
   * Worst-case staleness ceiling. A full denormalization runs at least every
   * `maxStalenessHours` even when `intervalHours` is set much larger, so the
   * dashboards never show stale data over long idle windows.
   */
  maxStalenessHours: number;
  /** Number of force-refreshes each vendor may trigger per month. */
  vendorForceRefreshQuota: number;
}

export class StatsSyncSettingsService {
  async getSettings(): Promise<StatsSyncSettings> {
    const [intervalHoursRaw, lastRunRaw, autoEnabledRaw, maxStalenessRaw, forceQuotaRaw] =
      await Promise.all([
        redis.get(KEY_INTERVAL),
        redis.get(KEY_LAST_RUN),
        redis.get(KEY_AUTO_ENABLED),
        redis.get(KEY_MAX_STALENESS),
        redis.get(KEY_VENDOR_FORCE_QUOTA),
      ]);

    const intervalHours = intervalHoursRaw ? Number(intervalHoursRaw) : DEFAULT_INTERVAL_HOURS;
    const lastRun = lastRunRaw ? Number(lastRunRaw) : null;
    const autoDenormalizeEnabled = autoEnabledRaw === null ? true : autoEnabledRaw === '1';
    const maxStalenessHours = maxStalenessRaw
      ? Number(maxStalenessRaw)
      : DEFAULT_MAX_STALENESS_HOURS;
    const vendorForceRefreshQuota = forceQuotaRaw
      ? Number(forceQuotaRaw)
      : DEFAULT_VENDOR_FORCE_QUOTA;

    return {
      intervalHours,
      lastRun,
      autoDenormalizeEnabled,
      maxStalenessHours,
      vendorForceRefreshQuota,
    };
  }

  async update(input: {
    intervalHours?: number;
    autoDenormalizeEnabled?: boolean;
    maxStalenessHours?: number;
    vendorForceRefreshQuota?: number;
  }): Promise<StatsSyncSettings> {
    const current = await this.getSettings();
    const next = {
      intervalHours: input.intervalHours ?? current.intervalHours,
      autoDenormalizeEnabled: input.autoDenormalizeEnabled ?? current.autoDenormalizeEnabled,
      maxStalenessHours: input.maxStalenessHours ?? current.maxStalenessHours,
      vendorForceRefreshQuota: input.vendorForceRefreshQuota ?? current.vendorForceRefreshQuota,
    };

    await Promise.all([
      redis.set(KEY_INTERVAL, String(next.intervalHours)),
      redis.set(KEY_AUTO_ENABLED, next.autoDenormalizeEnabled ? '1' : '0'),
      redis.set(KEY_MAX_STALENESS, String(next.maxStalenessHours)),
      redis.set(KEY_VENDOR_FORCE_QUOTA, String(next.vendorForceRefreshQuota)),
    ]);

    return { ...next, lastRun: current.lastRun };
  }

  async markRan(timestamp = Date.now()): Promise<void> {
    await redis.set(KEY_LAST_RUN, String(timestamp));
  }
}

export const statsSyncSettingsService = new StatsSyncSettingsService();
