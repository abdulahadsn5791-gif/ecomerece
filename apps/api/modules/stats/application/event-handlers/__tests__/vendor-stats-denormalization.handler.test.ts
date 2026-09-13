import { describe, expect, it } from 'bun:test';
import type { IEvent } from '@ecomerece/domain';
import type { VendorStatsDenormalizationHandler } from '../vendor-stats-denormalization.handler';

// lib/mongo throws at import time without MONGO_URI → set env, lazy import.
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.REDIS_URL ||= 'redis://127.0.0.1:6379';

let Handler: typeof VendorStatsDenormalizationHandler;

const forceEvent = {
  type: 'stats.product-denormalization-requested',
  payload: { force: false },
} as unknown as IEvent<{ force: boolean }>;

function makeDeps(overrides: Record<string, unknown>) {
  return {
    connectDB: async () => undefined,
    loadVendors: async () => [] as { id: string }[],
    refreshVendorCore: async () => undefined,
    ...overrides,
  };
}

describe('VendorStatsDenormalizationHandler', () => {
  it('refreshes every non-deleted vendor (opt-out flag is not consulted)', async () => {
    ({ VendorStatsDenormalizationHandler: Handler } = await import(
      '../vendor-stats-denormalization.handler'
    ));

    const refreshed: string[] = [];
    const handler = new Handler(
      makeDeps({
        loadVendors: async () => [{ id: 'v1' }, { id: 'v2' }],
        refreshVendorCore: async (vendorId: string) => {
          refreshed.push(vendorId);
        },
      }),
    );

    await handler.handle(forceEvent);

    expect(refreshed).toEqual(['v1', 'v2']);
  });

  it('writes nothing when there are no vendors', async () => {
    ({ VendorStatsDenormalizationHandler: Handler } = await import(
      '../vendor-stats-denormalization.handler'
    ));

    let called = false;
    const handler = new Handler(
      makeDeps({
        refreshVendorCore: async () => {
          called = true;
        },
      }),
    );

    await handler.handle(forceEvent);

    expect(called).toBe(false);
  });
});
