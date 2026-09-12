'use client';

import { useGetMyPaginatedProducts } from '@ecomerece/frontend/product';
import { useGetVendorTimeSeries } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMyVendor, useUpdateMyStatsRefresh } from '@ecomerece/frontend/vendor';
import { motion } from 'framer-motion';
import { Boxes, DollarSign, MousePointerClick, ShoppingCart, Store } from 'lucide-react';
import { useMemo } from 'react';
import { fmtCurrency, fmtNumber } from '@/components/stats-page/format';
import { MetricTile } from '@/components/stats-page/MetricTile';
import { ProductStatsTable } from '@/components/stats-page/ProductStatsTable';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';
import { StatsPageSkeleton } from '@/components/stats-page/StatsPageSkeleton';
import { StatsTimeSeriesChart } from '@/components/stats-page/StatsTimeSeriesChart';

function toUtcDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function VendorProductsStatsPage() {
  const { darkMode } = useThemeStore();
  const { data: vendor, isLoading: vendorLoading, error } = useGetMyVendor();
  const updateRefresh = useUpdateMyStatsRefresh();

  const { data: productsResult, isLoading: productsLoading } = useGetMyPaginatedProducts({
    sort: 'most_revenue',
    limit: 100,
  });
  const products = productsResult?.data ?? [];

  const period = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setUTCDate(from.getUTCDate() - 29);
    return { from: toUtcDateStr(from), to: toUtcDateStr(now) };
  }, []);

  const vendorId = vendor?.id ?? '';
  const timeseries = useGetVendorTimeSeries(vendorId, 'daily', period.from, period.to);

  const chartData = useMemo(
    () =>
      (timeseries.data?.series ?? [])
        .map((s) => ({
          key: s.dimensions.date ?? '',
          metrics: s.metrics,
        }))
        .sort((a, b) => a.key.localeCompare(b.key)),
    [timeseries.data],
  );

  const aggregate = useMemo(
    () =>
      products.reduce(
        (acc, p) => ({
          revenue: acc.revenue + (p.stats?.revenue ?? 0),
          quantity: acc.quantity + (p.stats?.quantity ?? 0),
          purchases: acc.purchases + (p.stats?.purchases ?? 0),
          views: acc.views + (p.stats?.views ?? 0),
        }),
        { revenue: 0, quantity: 0, purchases: 0, views: 0 },
      ),
    [products],
  );

  const isNotFound =
    error && typeof error === 'object' && (error as { status?: number }).status === 404;

  if (isNotFound) {
    return (
      <StatsEmptyState
        title="Vendor account required"
        description="Create a vendor profile to unlock product performance stats."
        icon={Store}
      />
    );
  }

  if (vendorLoading || productsLoading) {
    return <StatsPageSkeleton />;
  }

  if (error) {
    return (
      <StatsEmptyState
        title="Could not load stats"
        description="An unexpected error occurred while loading your product stats."
        icon={Store}
      />
    );
  }

  const toggleRefresh = () => {
    if (!vendor) return;
    updateRefresh.mutate({ enabled: !vendor.statsRefreshEnabled });
  };

  const tiles = [
    {
      label: 'Revenue',
      value: fmtCurrency(aggregate.revenue),
      icon: DollarSign,
      helper: `${products.length} products`,
    },
    { label: 'Units', value: fmtNumber(aggregate.quantity), icon: Boxes, helper: 'lifetime' },
    {
      label: 'Purchases',
      value: fmtNumber(aggregate.purchases),
      icon: ShoppingCart,
      helper: 'lifetime',
    },
    {
      label: 'Views',
      value: fmtNumber(aggregate.views),
      icon: MousePointerClick,
      helper: 'lifetime',
    },
  ];

  return (
    <main className="lg:col-span-3 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] p-6 sm:p-8 transition-colors duration-500 ${
          darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Product Performance</h1>
            <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Lifetime units, purchases, and revenue across your catalog
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl cursor-pointer bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <input
              type="checkbox"
              checked={vendor?.statsRefreshEnabled ?? true}
              onChange={toggleRefresh}
              disabled={updateRefresh.isPending}
              className="accent-emerald-500"
            />
            Auto-refresh stats
          </label>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((tile, i) => (
          <MetricTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={tile.icon}
            accent="#059669"
            helper={tile.helper}
            delay={i * 0.05}
          />
        ))}
      </div>

      <StatsTimeSeriesChart
        title="Revenue"
        subtitle="Last 30 days"
        points={chartData}
        metric="revenue"
        prefix="$"
        accent="#059669"
        delay={0.15}
      />

      {products.length > 0 ? (
        <ProductStatsTable products={products} accent="#059669" delay={0.25} />
      ) : (
        <StatsEmptyState
          title="No products yet"
          description="Create products to start tracking views, purchases, and revenue."
        />
      )}
    </main>
  );
}
