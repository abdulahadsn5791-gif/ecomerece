'use client';

import { useGetAdminPaginatedProducts } from '@ecomerece/frontend/product';
import { useGetProductStatsOverview } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { fmtCurrency, fmtNumber } from '@/components/stats-page/format';
import { MetricTile } from '@/components/stats-page/MetricTile';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { ProductStatsTable } from '@/components/stats-page/ProductStatsTable';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';
import { StatsPageSkeleton } from '@/components/stats-page/StatsPageSkeleton';
import { StatsSyncSettingsCard } from '@/components/stats-page/StatsSyncSettingsCard';

export default function AdminProductStatsPage() {
  const { darkMode } = useThemeStore();
  const {
    data: productsResult,
    isLoading,
    error,
  } = useGetAdminPaginatedProducts({ sort: 'most_revenue', limit: 50 });

  const products = productsResult?.data ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const overview = useGetProductStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const overviewData = overview.data?.overview;

  const aggregate = useMemo(() => {
    if (!products.length) return { views: 0, purchases: 0, revenue: 0, quantity: 0 };
    return products.reduce(
      (acc, p) => ({
        views: acc.views + (p.stats?.views ?? 0),
        purchases: acc.purchases + (p.stats?.purchases ?? 0),
        revenue: acc.revenue + (p.stats?.revenue ?? 0),
        quantity: acc.quantity + (p.stats?.quantity ?? 0),
      }),
      { views: 0, purchases: 0, revenue: 0, quantity: 0 },
    );
  }, [products]);

  if (isLoading) {
    return <StatsPageSkeleton />;
  }

  if (error) {
    return (
      <StatsEmptyState
        title="Could not load stats"
        description="An unexpected error occurred while loading product stats."
        icon={BarChart3}
      />
    );
  }

  if (products.length === 0) {
    return (
      <main className="lg:col-span-3 space-y-6">
        <StatsSyncSettingsCard />
        <StatsEmptyState
          title="No product data yet"
          description="Stats will appear once products have views, clicks, or purchases. Run a data correction after your first traffic."
        />
      </main>
    );
  }

  return (
    <main className="lg:col-span-3 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[28px] p-6 sm:p-8 transition-colors duration-500 ${
          darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
        }`}
      >
        <h1 className="text-xl font-bold tracking-tight mb-1">Product Stats</h1>
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Aggregate lifetime metrics across your catalog and drill into per-product trends
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricTile
          label="Total revenue"
          value={fmtCurrency(aggregate.revenue)}
          icon={BarChart3}
          accent="#7C3AED"
          helper={`${products.length} products`}
          delay={0}
        />
        <MetricTile
          label="Units"
          value={fmtNumber(aggregate.quantity)}
          icon={BarChart3}
          accent="#7C3AED"
          delay={0.05}
        />
        <MetricTile
          label="Purchases"
          value={fmtNumber(aggregate.purchases)}
          icon={BarChart3}
          accent="#7C3AED"
          delay={0.1}
        />
        <MetricTile
          label="Views"
          value={fmtNumber(aggregate.views)}
          icon={BarChart3}
          accent="#7C3AED"
          delay={0.15}
        />
      </div>

      <StatsSyncSettingsCard />

      <ProductStatsTable
        products={products}
        selectedId={selectedId}
        onSelect={setSelectedId}
        accent="#7C3AED"
      />

      {selectedId && overview.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-[28px] p-10 text-center text-sm ${darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'}`}
        >
          Loading product overview…
        </motion.div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Product overview"
          accent="#7C3AED"
        />
      )}

      {!selectedId && !overview.isLoading && (
        <StatsEmptyState
          title="Select a product"
          description="Click on any row above to view its per-period stats and trend charts."
        />
      )}
    </main>
  );
}
