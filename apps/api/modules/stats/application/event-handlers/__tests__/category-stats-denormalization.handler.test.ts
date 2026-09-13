import { describe, expect, it } from 'bun:test';
import type { IEvent } from '@ecomerece/domain';
import { emptyMetrics, type Metrics, type StatEvent } from '@ecomerece/shared';
import type { CategoryStatsDenormalizationHandler } from '../category-stats-denormalization.handler';

// The handler statically imports `lib/mongo` (which throws at import time
// without MONGO_URI), so set the env var and load the module lazily.
process.env.MONGO_URI ||= 'mongodb://127.0.0.1:27017/test';
process.env.REDIS_URL ||= 'redis://127.0.0.1:6379';

let Handler: typeof CategoryStatsDenormalizationHandler;

const forceEvent = {
  type: 'stats.product-denormalization-requested',
  payload: { force: false },
} as unknown as IEvent<{ force: boolean }>;

interface FakeDeps {
  loadProducts?: () => Promise<{ id: string; categoryId: string }[]>;
  getLifetimeMetricsForProducts?: (productIds: string[]) => Promise<Metrics>;
  getSeriesForProducts?: (
    productIds: string[],
    aggregation: 'daily' | 'weekly' | 'monthly',
    to: string,
  ) => Promise<{ key: string; metrics: Metrics }[]>;
  setStats?: (events: StatEvent[]) => Promise<void>;
}

function makeDeps(overrides: FakeDeps = {}) {
  return {
    connectDB: async () => undefined,
    loadProducts: async () => [] as { id: string; categoryId: string }[],
    getLifetimeMetricsForProducts: async () => emptyMetrics(),
    getSeriesForProducts: async () => [] as { key: string; metrics: Metrics }[],
    setStats: async () => undefined,
    ...overrides,
  };
}

describe('CategoryStatsDenormalizationHandler', () => {
  it('rolls product stats up into per-category stat events', async () => {
    ({ CategoryStatsDenormalizationHandler: Handler } = await import(
      '../category-stats-denormalization.handler'
    ));

    const lifetimeByCall: Metrics[] = [
      { revenue: 100, quantity: 5, purchases: 2 },
      { revenue: 200, quantity: 3, purchases: 1 },
    ];
    let lifetimeCalls = 0;

    const seriesByCall: { key: string; metrics: Metrics }[][] = [];
    let seriesCalls = 0;

    const writes: StatEvent[] = [];
    const handler = new Handler(
      makeDeps({
        loadProducts: async () => [
          { id: 'p1', categoryId: 'cat-1' },
          { id: 'p2', categoryId: 'cat-1' },
          { id: 'p3', categoryId: 'cat-2' },
        ],
        getLifetimeMetricsForProducts: async () => lifetimeByCall[lifetimeCalls++],
        getSeriesForProducts: async (_ids, aggregation) => {
          if (aggregation !== 'daily') return [];
          seriesCalls += 1;
          const series = seriesByCall[seriesCalls - 1] ?? [];
          seriesByCall.push(series);
          return series;
        },
        setStats: async (events) => {
          writes.push(...events);
        },
      }),
    );

    seriesByCall.push([{ key: '2026-09-13', metrics: { views: 3 } }]);
    seriesByCall.push([{ key: '2026-09-13', metrics: { views: 1 } }]);

    await handler.handle(forceEvent);

    expect(writes.length).toBe(4);

    const cat1Lifetime = writes.find(
      (w) =>
        w.entity.type === 'category' && w.entity.id === 'cat-1' && w.aggregation === 'lifetime',
    );
    expect(cat1Lifetime?.metrics.revenue).toBe(100);
    expect(cat1Lifetime?.metrics.quantity).toBe(5);

    const cat2Lifetime = writes.find(
      (w) =>
        w.entity.type === 'category' && w.entity.id === 'cat-2' && w.aggregation === 'lifetime',
    );
    expect(cat2Lifetime?.metrics.revenue).toBe(200);

    const cat1Daily = writes.find(
      (w) => w.entity.type === 'category' && w.entity.id === 'cat-1' && w.aggregation === 'daily',
    );
    expect(cat1Daily?.dimensions.date).toBe('2026-09-13');
    expect(cat1Daily?.metrics.views).toBe(3);

    const cat2Daily = writes.find(
      (w) => w.entity.type === 'category' && w.entity.id === 'cat-2' && w.aggregation === 'daily',
    );
    expect(cat2Daily?.metrics.views).toBe(1);
  });

  it('writes nothing when there are no products', async () => {
    ({ CategoryStatsDenormalizationHandler: Handler } = await import(
      '../category-stats-denormalization.handler'
    ));

    let writes: StatEvent[] | undefined;
    const handler = new Handler(
      makeDeps({
        setStats: async (events) => {
          writes = events;
        },
      }),
    );

    await handler.handle(forceEvent);
    expect(writes).toBeUndefined();
  });
});
