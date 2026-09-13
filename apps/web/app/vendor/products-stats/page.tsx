'use client';

import { useGetMyPaginatedProducts } from '@ecomerece/frontend/product';
import {
  useGetVendorForceRefreshUsage,
  useGetVendorStatsOverview,
  useGetVendorTimeSeries,
  useVendorForceRefresh,
} from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMyVendor } from '@ecomerece/frontend/vendor';
import { motion } from 'framer-motion';
import { Boxes, DollarSign, MousePointerClick, RefreshCw, ShoppingCart, Store } from 'lucide-react';
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
  const { data: overview, isLoading: overviewLoading } = useGetVendorStatsOverview(
    vendor?.id ?? '',
    { enabled: Boolean(vendor?.id) },
  );
  const { data: quota } = useGetVendorForceRefreshUsage();
  const forceRefresh = useVendorForceRefresh();

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

  const lifetime = overview?.overview?.lifetime ?? {};
  const today = overview?.overview?.today ?? {};

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

  if (vendorLoading || productsLoading || overviewLoading) {
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

  const remaining = quota?.remaining ?? 0;
  const quotaExhausted = remaining <= 0;

  const runForceRefresh = () => {
    if (!vendor || forceRefresh.isPending) return;
    forceRefresh.mutate();
  };

  const tiles = [
    {
      label: 'Revenue',
      value: fmtCurrency(lifetime.revenue ?? 0),
      icon: DollarSign,
      helper: 'lifetime',
    },
    {
      label: 'Units',
      value: fmtNumber(lifetime.quantity ?? 0),
      icon: Boxes,
      helper: 'lifetime',
    },
    {
      label: 'Purchases',
      value: fmtNumber(lifetime.purchases ?? 0),
      icon: ShoppingCart,
      helper: 'lifetime',
    },
    {
      label: 'Views',
      value: fmtNumber(lifetime.views ?? 0),
      icon: MousePointerClick,
      helper: 'lifetime',
    },
    {
      label: "Today's revenue",
      value: fmtCurrency(today.revenue ?? 0),
      icon: DollarSign,
      helper: 'auto-synced daily',
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

          <button
            type="button"
            onClick={runForceRefresh}
            disabled={forceRefresh.isPending || quotaExhausted}
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500"
          >
            <RefreshCw className={`w-4 h-4 ${forceRefresh.isPending ? 'animate-spin' : ''}`} />
            {forceRefresh.isPending
              ? 'Refreshing…'
              : quotaExhausted
                ? 'Refresh quota used'
                : `Refresh stats now (${remaining} left)`}
          </button>
        </div>

        {(forceRefresh.isError && (
          <p className="mt-3 text-xs text-rose-500">
            Refresh failed. Quota may be exhausted for this month — try again later.
          </p>
        )) ||
          (forceRefresh.isSuccess && (
            <p className="mt-3 text-xs text-emerald-500">
              Stats refreshed. Remaining refreshes this month: {forceRefresh.data?.remaining ?? 0}
            </p>
          ))}
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
