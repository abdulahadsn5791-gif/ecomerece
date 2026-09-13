import { describe, expect, it } from 'bun:test';
import {
  currentMonthKey,
  VendorForceRefreshQuotaService,
  vendorForceUsageKey,
} from '../VendorForceRefreshQuotaService';

type FakeDeps = {
  getQuota?: () => Promise<number>;
  redisGet?: (key: string) => Promise<string | null>;
  redisIncr?: (key: string) => Promise<number>;
  redisExpire?: (key: string, seconds: number) => Promise<unknown>;
};

function makeParams(overrides: FakeDeps = {}) {
  const store = new Map<string, string>();
  const expires: string[] = [];

  return {
    deps: {
      getQuota: async () => 2,
      redisGet: async (key: string) => store.get(key) ?? null,
      redisIncr: async (key: string) => {
        const next = (Number(store.get(key)) || 0) + 1;
        store.set(key, String(next));
        return next;
      },
      redisExpire: async (key: string) => {
        expires.push(key);
      },
      ...overrides,
    },
    store,
    expires,
  };
}

describe('VendorForceRefreshQuotaService', () => {
  it.each([
    [2026, 0, '2026-01'],
    [2026, 11, '2026-12'],
    [2026, 2, '2026-03'],
    [2026, 9, '2026-10'],
  ])('formats month %s-%s as %s', (year, month, expected) => {
    expect(currentMonthKey(new Date(Date.UTC(year, month, 15)))).toBe(expected);
  });

  it('consumes quota until exhausted, then rejects', async () => {
    const { deps } = makeParams();
    const service = new VendorForceRefreshQuotaService(deps);

    const first = await service.consume('v1');
    expect(first).toEqual({ accepted: true, used: 1, remaining: 1 });

    const second = await service.consume('v1');
    expect(second).toEqual({ accepted: true, used: 2, remaining: 0 });

    const third = await service.consume('v1');
    expect(third).toEqual({ accepted: false, used: 3, remaining: 0 });
  });

  it('expires the usage key on first use of the month', async () => {
    const { deps, expires } = makeParams();
    const service = new VendorForceRefreshQuotaService(deps);

    await service.consume('v1');

    expect(expires).toEqual([vendorForceUsageKey('v1', currentMonthKey())]);
  });

  it('rejects immediately when the quota is zero', async () => {
    const { deps } = makeParams({ getQuota: async () => 0 });
    const service = new VendorForceRefreshQuotaService(deps);

    await expect(service.consume('v1')).resolves.toEqual({
      accepted: false,
      used: 0,
      remaining: 0,
    });
  });

  it('reports remaining = quota - used', async () => {
    const { deps } = makeParams();
    const service = new VendorForceRefreshQuotaService(deps);

    expect(await service.getRemaining('v1')).toBe(2);

    await service.consume('v1');
    expect(await service.getRemaining('v1')).toBe(1);

    const usage = await service.getUsage('v1');
    expect(usage).toBe(1);
  });
});
