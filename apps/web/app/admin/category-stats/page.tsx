'use client';

import { useGetAdminPaginatedCategories } from '@ecomerece/frontend/category';
import { useGetCategoryStatsOverview, useGetPaginatedCategoryStats } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { Boxes, DollarSign, MousePointerClick, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { type CategoryStatsRow, CategoryStatsTable } from '@/components/stats-page/CategoryStatsTable';
import { fmtCurrency, fmtNumber } from '@/components/stats-page/format';
import { MetricTile } from '@/components/stats-page/MetricTile';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';
import { StatsPageSkeleton } from '@/components/stats-page/StatsPageSkeleton';
import { StatsSyncSettingsCard } from '@/components/stats-page/StatsSyncSettingsCard';

export default function AdminCategoryStatsPage() {
  const { darkMode } = useThemeStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: categoriesResult, isLoading: categoriesLoading } = useGetAdminPaginatedCategories({
    limit: 50,
    deleted: false,
  });
  const { data: statsResult, isLoading: statsLoading } = useGetPaginatedCategoryStats({
    metric: 'revenue',
    sort: 'desc',
    limit: 50,
  });

  const categories = categoriesResult?.data ?? [];
  const statItems = statsResult?.items ?? [];

  const metaById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  const rows: CategoryStatsRow[] = useMemo(
    () =>
      statItems
        .map((item) => {
          const id = item.entity?.id ?? '';
          const meta = metaById.get(id);
          return {
            id,
            title: meta?.title ?? 'Unknown category',
            image: meta?.image ?? '',
            metrics: {
              quantity: item.metrics.quantity ?? 0,
              purchases: item.metrics.purchases ?? 0,
              views: item.metrics.views ?? 0,
              revenue: item.metrics.revenue ?? 0,
            },
          };
        })
        .sort((a, b) => b.metrics.revenue - a.metrics.revenue),
    [statItems, metaById],
  );

  const overview = useGetCategoryStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const overviewData = overview.data?.overview;

  const aggregate = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          revenue: acc.revenue + r.metrics.revenue,
          quantity: acc.quantity + r.metrics.quantity,
          purchases: acc.purchases + r.metrics.purchases,
          views: acc.views + r.metrics.views,
        }),
        { revenue: 0, quantity: 0, purchases: 0, views: 0 },
      ),
    [rows],
  );

  if (categoriesLoading || statsLoading) {
    return <StatsPageSkeleton />;
  }

  if (rows.length === 0) {
    return (
      <main className="lg:col-span-3 space-y-6">
        <StatsSyncSettingsCard />
        <StatsEmptyState
          title="No category data yet"
          description="Stats will appear once products in a category have views, clicks, or purchases. Run a data correction after your first traffic."
        />
      </main>
    );
  }

  const tiles = [
    {
      label: 'Revenue',
      value: fmtCurrency(aggregate.revenue),
      icon: DollarSign,
      helper: `${rows.length} categories`,
    },
    { label: 'Units', value: fmtNumber(aggregate.quantity), icon: Boxes, helper: 'lifetime' },
    { label: 'Purchases', value: fmtNumber(aggregate.purchases), icon: ShoppingCart, helper: 'lifetime' },
    { label: 'Views', value: fmtNumber(aggregate.views), icon: MousePointerClick, helper: 'lifetime' },
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
        <h1 className="text-xl font-bold tracking-tight mb-1">Category Stats</h1>
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Aggregate lifetime metrics across categories and drill into per-category trends
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((tile, i) => (
          <MetricTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={tile.icon}
            accent="#7C3AED"
            helper={tile.helper}
            delay={i * 0.05}
          />
        ))}
      </div>

      <StatsSyncSettingsCard />

      <CategoryStatsTable
        categories={rows}
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
          Loading category overview…
        </motion.div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Category overview"
          accent="#7C3AED"
        />
      )}

      {!selectedId && !overview.isLoading && (
        <StatsEmptyState
          title="Select a category"
          description="Click on any row above to view its per-period stats and trend charts."
        />
      )}
    </main>
  );
}