'use client';

import { useGetAdminPaginatedProducts } from '@ecomerece/frontend/product';
import { useGetVendorStatsOverview } from '@ecomerece/frontend/stats';
import { useGetAdminPaginatedVendors } from '@ecomerece/frontend/vendor';
import { motion } from 'framer-motion';
import { Boxes, DollarSign, MousePointerClick, ShoppingCart, Store } from 'lucide-react';
import { useMemo, useState } from 'react';
import { fmtCurrency, fmtNumber } from '@/components/stats-page/format';
import { MetricTile } from '@/components/stats-page/MetricTile';
import { ProductStatsOverviewPanel } from '@/components/stats-page/ProductStatsOverviewPanel';
import { ProductStatsTable } from '@/components/stats-page/ProductStatsTable';
import { StatsEmptyState } from '@/components/stats-page/StatsEmptyState';
import { StatsPageSkeleton } from '@/components/stats-page/StatsPageSkeleton';
import { StatsSyncSettingsCard } from '@/components/stats-page/StatsSyncSettingsCard';
import { type VendorStatsRow, VendorStatsTable } from '@/components/stats-page/VendorStatsTable';

export default function AdminVendorStatsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: vendorsResult, isLoading: vendorsLoading } = useGetAdminPaginatedVendors({
    limit: 50,
    deleted: false,
  });
  const vendors = vendorsResult?.data ?? [];

  const rows: VendorStatsRow[] = useMemo(
    () =>
      vendors.map((vendor) => ({
        id: vendor.id,
        title: vendor.title,
        slug: vendor.slug,
        metrics: {
          quantity: vendor.stats?.quantity ?? 0,
          purchases: vendor.stats?.purchases ?? 0,
          views: vendor.stats?.views ?? 0,
          revenue: vendor.stats?.revenue ?? 0,
        },
      })),
    [vendors],
  );

  const overview = useGetVendorStatsOverview(selectedId ?? '', { enabled: !!selectedId });
  const overviewData = overview.data?.overview;

  const productsResult = useGetAdminPaginatedProducts({
    vendorId: selectedId ?? '',
    sort: 'most_revenue',
    limit: 50,
    enabled: Boolean(selectedId),
  });
  const products = productsResult.data?.data ?? [];

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

  if (vendorsLoading) {
    return <StatsPageSkeleton />;
  }

  if (rows.length === 0) {
    return (
      <main className="lg:col-span-3 space-y-6">
        <StatsSyncSettingsCard />
        <StatsEmptyState
          title="No vendor data yet"
          description="Stats will appear once vendors have products with views, clicks, or purchases. Run a data correction after your first traffic."
        />
      </main>
    );
  }

  const tiles = [
    {
      label: 'Revenue',
      value: fmtCurrency(aggregate.revenue),
      icon: DollarSign,
      helper: `${rows.length} vendors`,
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
        className="rounded-[28px] p-6 sm:p-8 bg-white shadow-sm dark:bg-neutral-900"
      >
        <h1 className="text-xl font-bold tracking-tight mb-1">Vendor Stats</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Aggregate lifetime metrics across vendors and drill into per-vendor trends
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

      <VendorStatsTable
        vendors={rows}
        selectedId={selectedId}
        onSelect={setSelectedId}
        accent="#7C3AED"
      />

      {selectedId && overview.isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[28px] p-10 text-center text-sm bg-white shadow-sm text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
        >
          Loading vendor overview…
        </motion.div>
      )}

      {overviewData && (
        <ProductStatsOverviewPanel
          overview={overviewData}
          title="Vendor overview"
          accent="#7C3AED"
        />
      )}

      {selectedId && products.length > 0 && (
        <ProductStatsTable products={products} accent="#7C3AED" delay={0.3} />
      )}

      {!selectedId && !overview.isLoading && (
        <StatsEmptyState
          title="Select a vendor"
          description="Click on any row above to view its per-period stats, trend charts, and top products."
          icon={Store}
        />
      )}
    </main>
  );
}
