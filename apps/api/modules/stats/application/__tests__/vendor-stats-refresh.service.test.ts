import { describe, expect, it } from 'bun:test';
import { emptyMetrics, type Metrics, type StatEvent } from '@ecomerece/shared';
import type { VendorStatsRefreshService } from '../vendor-stats-refresh.service';

// The service statically imports `lib/mongo` (which throws at import time
// without MONGO_URI), so set the env var and load the module lazily.
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.REDIS_URL ||= 'redis://127.0.0.1:6379';

let Service: typeof VendorStatsRefreshService;

type SeriesAggregation = 'daily' | 'weekly' | 'monthly';

interface FakeDeps {
  loadVendorProducts?: (vendorId: string) => Promise<{ id: string; categoryId: string }[]>;
  loadProductsByCategory?: (categoryIds: string[]) => Promise<{ id: string; categoryId: string }[]>;
  getLifetimeMetricsForProducts?: (productIds: string[]) => Promise<Metrics>;
  getSeriesForProducts?: (
    productIds: string[],
    aggregation: SeriesAggregation,
    to: string,
  ) => Promise<{ key: string; metrics: Metrics }[]>;
  setVendorStats?: (vendorId: string, metrics: Metrics) => Promise<void>;
  setStats?: (events: StatEvent[]) => Promise<void>;
}

function makeDeps(overrides: FakeDeps = {}) {
  return {
    connectDB: async () => undefined,
    loadVendorProducts: async () => [] as { id: string; categoryId: string }[],
    loadProductsByCategory: async () => [] as { id: string; categoryId: string }[],
    getLifetimeMetricsForProducts: async () => emptyMetrics(),
    getSeriesForProducts: async () => [] as { key: string; metrics: Metrics }[],
    setVendorStats: async () => undefined,
    setStats: async () => undefined,
    ...overrides,
  };
}

describe('VendorStatsRefreshService', () => {
  it('rolls product stats up into vendor embedded stats + vendor stat slots', async () => {
    ({ VendorStatsRefreshService: Service } = await import('../vendor-stats-refresh.service'));

    const writes: StatEvent[] = [];
    let embedded: { vendorId: string; metrics: Metrics } | undefined;

    const service = new Service(
      makeDeps({
        loadVendorProducts: async () => [
          { id: 'p1', categoryId: 'cat-1' },
          { id: 'p2', categoryId: 'cat-1' },
        ],
        getLifetimeMetricsForProducts: async () => ({ revenue: 100, quantity: 5, purchases: 2 }),
        getSeriesForProducts: async (_ids, aggregation) =>
          aggregation === 'daily' ? [{ key: '2026-09-13', metrics: { views: 3 } }] : [],
        setVendorStats: async (vendorId, metrics) => {
          embedded = { vendorId, metrics };
        },
        setStats: async (events) => {
          writes.push(...events);
        },
      }),
    );

    await service.refreshVendorCore('v1');

    expect(embedded?.vendorId).toBe('v1');
    expect(embedded?.metrics.revenue).toBe(100);

    const lifetime = writes.find(
      (w) => w.entity.type === 'vendor' && w.entity.id === 'v1' && w.aggregation === 'lifetime',
    );
    expect(lifetime?.metrics.revenue).toBe(100);
    expect(lifetime?.metrics.quantity).toBe(5);

    const daily = writes.find((w) => w.entity.type === 'vendor' && w.aggregation === 'daily');
    expect(daily?.dimensions.date).toBe('2026-09-13');
    expect(daily?.metrics.views).toBe(3);
  });

  it('writes nothing when a vendor has no products', async () => {
    ({ VendorStatsRefreshService: Service } = await import('../vendor-stats-refresh.service'));

    let writes: StatEvent[] | undefined;
    let embedded = false;

    const service = new Service(
      makeDeps({
        loadVendorProducts: async () => [],
        setVendorStats: async () => {
          embedded = true;
        },
        setStats: async (events) => {
          writes = events;
        },
      }),
    );

    await service.refreshVendorCore('v1');

    expect(writes).toBeUndefined();
    expect(embedded).toBe(false);
  });

  it('refreshVendorData also rolls up the categories the vendor sells in', async () => {
    ({ VendorStatsRefreshService: Service } = await import('../vendor-stats-refresh.service'));

    const writes: StatEvent[] = [];

    const service = new Service(
      makeDeps({
        loadVendorProducts: async () => [
          { id: 'p1', categoryId: 'cat-1' },
          { id: 'p2', categoryId: 'cat-2' },
        ],
        loadProductsByCategory: async (catIds) => {
          const products = new Map<string, string>([
            ['p1', 'cat-1'],
            ['pX', 'cat-1'], // another vendor's product, same category
            ['p2', 'cat-2'],
          ]);
          return [...products.entries()]
            .filter(([, catId]) => catIds.includes(catId))
            .map(([id, categoryId]) => ({ id, categoryId }));
        },
        getLifetimeMetricsForProducts: async (productIds) => ({ revenue: productIds.length * 10 }),
        getSeriesForProducts: async () => [] as { key: string; metrics: Metrics }[],
        setStats: async (events) => {
          writes.push(...events);
        },
      }),
    );

    await service.refreshVendorData('v1');

    const vendorLifetime = writes.find(
      (w) => w.entity.type === 'vendor' && w.entity.id === 'v1' && w.aggregation === 'lifetime',
    );
    expect(vendorLifetime?.metrics.revenue).toBe(20);

    // cat-1 has p1 + pX (2 products) → revenue 20; cat-2 has p2 (1 product) → 10.
    const cat1Lifetime = writes.find(
      (w) =>
        w.entity.type === 'category' && w.entity.id === 'cat-1' && w.aggregation === 'lifetime',
    );
    expect(cat1Lifetime?.metrics.revenue).toBe(20);

    const cat2Lifetime = writes.find(
      (w) =>
        w.entity.type === 'category' && w.entity.id === 'cat-2' && w.aggregation === 'lifetime',
    );
    expect(cat2Lifetime?.metrics.revenue).toBe(10);
  });
});
