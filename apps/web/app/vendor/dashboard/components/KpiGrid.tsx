'use client';

import { motion } from 'framer-motion';
import { Box, DollarSign, Package, ShoppingBag, Star } from 'lucide-react';

interface KpiGridProps {
  revenue: number;
  units: number;
  items: number;
  activeProducts: number;
  avgRating: number;
  darkMode: boolean;
}

const fmt = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : n.toLocaleString('en-US');

const tiles = (
  revenue: number,
  units: number,
  items: number,
  activeProducts: number,
  avgRating: number,
) => [
  { icon: DollarSign, label: 'Total Revenue', value: `$${fmt(revenue)}`, color: 'bg-emerald-500' },
  { icon: Package, label: 'Units Sold', value: fmt(units), color: 'bg-blue-500' },
  { icon: ShoppingBag, label: 'Items Sold', value: fmt(items), color: 'bg-violet-500' },
  { icon: Box, label: 'Active Products', value: activeProducts, color: 'bg-orange-500' },
  { icon: Star, label: 'Avg Rating', value: avgRating.toFixed(1), color: 'bg-amber-500' },
];

export const KpiGrid = ({
  revenue,
  units,
  items,
  activeProducts,
  avgRating,
  darkMode,
}: KpiGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {tiles(revenue, units, items, activeProducts, avgRating).map((tile, i) => (
      <motion.div
        key={tile.label}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05, duration: 0.35 }}
        className={`flex items-center gap-3 p-4 rounded-2xl transition-transform duration-200 hover:-translate-y-1 ${
          darkMode ? 'bg-neutral-800' : 'bg-neutral-50'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tile.color}`}
        >
          <tile.icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p
            className={`text-xs font-medium ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            {tile.label}
          </p>
          <p className={`text-lg font-bold ${darkMode ? 'text-neutral-100' : 'text-neutral-900'}`}>
            {tile.value}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);
