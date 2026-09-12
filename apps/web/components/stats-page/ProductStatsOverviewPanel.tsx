'use client';

import type { ProductStatsOverview } from '@ecomerece/frontend/stats';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { Boxes, CalendarDays, DollarSign, MousePointerClick, ShoppingCart } from 'lucide-react';
import { fmtCurrency, fmtNumber } from './format';
import { MetricTile } from './MetricTile';
import { StatsTimeSeriesChart } from './StatsTimeSeriesChart';

interface ProductStatsOverviewPanelProps {
  overview: ProductStatsOverview;
  title?: string;
  accent?: string;
  days?: number;
  months?: number;
}

export const ProductStatsOverviewPanel = ({
  overview,
  title = 'Product overview',
  accent = '#7C3AED',
  days = 30,
  months = 12,
}: ProductStatsOverviewPanelProps) => {
  const { darkMode } = useThemeStore();

  const tiles = [
    {
      label: 'Lifetime revenue',
      value: fmtCurrency(overview.lifetime.revenue ?? 0),
      icon: DollarSign,
      helper: `${fmtNumber(overview.lifetime.quantity ?? 0)} units`,
    },
    {
      label: 'This year revenue',
      value: fmtCurrency(overview.thisYear.revenue ?? 0),
      icon: CalendarDays,
      helper: `${fmtNumber(overview.thisYear.purchases ?? 0)} purchases`,
    },
    {
      label: 'This month units',
      value: fmtNumber(overview.thisMonth.quantity ?? 0),
      icon: Boxes,
      helper: `${fmtNumber(overview.thisMonth.purchases ?? 0)} purchases`,
    },
    {
      label: 'This week purchases',
      value: fmtNumber(overview.thisWeek.purchases ?? 0),
      icon: ShoppingCart,
      helper: `${fmtNumber(overview.thisWeek.quantity ?? 0)} units`,
    },
    {
      label: 'Today views',
      value: fmtNumber(overview.today.views ?? 0),
      icon: MousePointerClick,
      helper: `${fmtNumber(overview.today.clicks ?? 0)} clicks`,
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
      >
        <h2 className="text-xl font-bold tracking-tight mb-1">{title}</h2>
        <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Lifetime, period windows, and {months}-month / {days}-day trends
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((tile, i) => (
          <MetricTile
            key={tile.label}
            label={tile.label}
            value={tile.value}
            icon={tile.icon}
            accent={accent}
            helper={tile.helper}
            delay={i * 0.05}
          />
        ))}
      </div>

      <StatsTimeSeriesChart
        title="Revenue"
        subtitle={`Last ${months} months`}
        points={overview.monthlySeries}
        metric="revenue"
        prefix="$"
        accent={accent}
        delay={0.15}
      />

      <StatsTimeSeriesChart
        title="Views"
        subtitle={`Last ${days} days`}
        points={overview.dailySeries}
        metric="views"
        accent={accent}
        delay={0.25}
      />
    </div>
  );
};
