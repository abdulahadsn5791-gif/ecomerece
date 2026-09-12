'use client';

import { useGetPaginatedProducts } from '@ecomerece/frontend/product';
import { useGetVendorLifetimeStats, useGetVendorTimeSeries } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMyVendor } from '@ecomerece/frontend/vendor';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { DashboardErrorState } from './components/DashboardErrorState';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { KpiGrid } from './components/KpiGrid';
import { ProductPerformance } from './components/ProductPerformance';
import { SalesChart } from './components/SalesChart';
import { VendorHeader } from './components/VendorHeader';

function toUtcDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function VendorDashboardPage() {
  const { darkMode } = useThemeStore();
  const { data: vendor, isLoading, error, refetch, isFetching } = useGetMyVendor();

  const period = useMemo(() => {
    const now = new Date();
    const from = new Date(now);
    from.setUTCDate(from.getUTCDate() - 29);
    return { from: toUtcDateStr(from), to: toUtcDateStr(now) };
  }, []);

  const vendorId = vendor?.id ?? '';
  const lifetime = useGetVendorLifetimeStats(vendorId);
  const timeseries = useGetVendorTimeSeries(vendorId, 'daily', period.from, period.to);
  const productsQuery = useGetPaginatedProducts({ vendorId: vendorId || undefined, limit: 20 });

  const metrics = lifetime.data?.metrics;
  const products = productsQuery.data?.data ?? [];
  const activeProducts = products.filter((p) => p.inStock && p.appearance === 'public').length;
  const avgRating =
    products.length > 0
      ? products.reduce((sum, p) => sum + p.averageRating, 0) / products.length
      : 0;

  const chartData = useMemo(() => {
    const series = timeseries.data?.series ?? [];
    return series
      .map((s) => ({
        date: s.dimensions.date ?? '',
        revenue: s.metrics.revenue ?? 0,
        units: s.metrics.quantity ?? 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [timeseries.data]);

  if (isLoading) {
    return <DashboardSkeleton darkMode={darkMode} />;
  }

  const isNotFound =
    error && typeof error === 'object' && (error as { status?: number }).status === 404;

  if (isNotFound) {
    return (
      <main className="lg:col-span-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[28px] p-10 text-center ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
            }`}
        >
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
              }`}
          >
            <UserPlus className={`w-8 h-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-400'}`} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
            No vendor account found
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Create a vendor profile to access your store dashboard.
          </p>
          <Link
            href="/vendor/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Create Vendor
          </Link>
        </motion.div>
      </main>
    );
  }

  if (error) {
    return <DashboardErrorState darkMode={darkMode} refetch={refetch} isFetching={isFetching} />;
  }

  return (
    <main className="lg:col-span-3 space-y-6">
      {vendor && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`rounded-[28px] p-6 sm:p-8 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
            }`}
        >
          <VendorHeader vendor={vendor} />
        </motion.div>
      )}

      <KpiGrid
        revenue={metrics?.revenue ?? 0}
        units={metrics?.quantity ?? 0}
        items={metrics?.purchases ?? 0}
        activeProducts={activeProducts}
        avgRating={avgRating}
        darkMode={darkMode}
      />

      <SalesChart data={chartData} darkMode={darkMode} />

      {products.length > 0 && <ProductPerformance products={products} darkMode={darkMode} />}
    </main>
  );
}
