import { describe, expect, it } from 'bun:test';
import type { IEvent } from '@ecomerece/domain';
import type { VendorStatsForceRefreshHandler } from '../vendor-stats-force-refresh.handler';

// lib/mongo throws at import time without MONGO_URI → set env, lazy import.
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.REDIS_URL ||= 'redis://127.0.0.1:6379';

let Handler: typeof VendorStatsForceRefreshHandler;

const event = {
  type: 'stats.vendor-force-refresh-requested',
  payload: { vendorId: 'v1', force: true },
} as unknown as IEvent<{ vendorId: string; force: boolean }>;

function makeDeps(overrides: Record<string, unknown>) {
  return {
    connectDB: async () => undefined,
    refreshVendorData: async () => undefined,
    ...overrides,
  };
}

describe('VendorStatsForceRefreshHandler', () => {
  it('refreshes only the requesting vendor', async () => {
    ({ VendorStatsForceRefreshHandler: Handler } = await import(
      '../vendor-stats-force-refresh.handler'
    ));

    const refreshed: string[] = [];
    const handler = new Handler(
      makeDeps({
        refreshVendorData: async (vendorId: string) => {
          refreshed.push(vendorId);
        },
      }),
    );

    await handler.handle(event);

    expect(refreshed).toEqual(['v1']);
  });
});
