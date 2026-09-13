'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { ChevronRight, Tag } from 'lucide-react';
import { fmtCurrency, fmtNumber } from './format';

export interface CategoryStatsRow {
  id: string;
  title: string;
  image: string;
  metrics: {
    quantity: number;
    purchases: number;
    views: number;
    revenue: number;
  };
}

interface CategoryStatsTableProps {
  categories: CategoryStatsRow[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  accent?: string;
  delay?: number;
}

export const CategoryStatsTable = ({
  categories,
  selectedId,
  onSelect,
  accent = '#7C3AED',
  delay = 0.2,
}: CategoryStatsTableProps) => {
  const { darkMode } = useThemeStore();

  const rows = [...categories].sort((a, b) => b.metrics.revenue - a.metrics.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-[28px] p-6 transition-colors duration-500 ${
        darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
      }`}
    >
      <h3
        className={`text-base font-semibold mb-4 ${darkMode ? 'text-white' : 'text-neutral-900'}`}
      >
        Top Categories
      </h3>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr
              className={`border-b text-left text-xs font-medium uppercase tracking-wide ${
                darkMode
                  ? 'border-neutral-800 text-neutral-400'
                  : 'border-neutral-100 text-neutral-500'
              }`}
            >
              <th className="pb-3 pr-3">Category</th>
              <th className="pb-3 pr-3 text-right">Units</th>
              <th className="pb-3 pr-3 text-right">Purchases</th>
              <th className="pb-3 pr-3 text-right">Views</th>
              <th className="pb-3 pr-3 text-right">Revenue</th>
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = onSelect && selectedId === row.id;
              return (
                <tr
                  key={row.id}
                  onClick={onSelect ? () => onSelect(row.id) : undefined}
                  style={isSelected ? { backgroundColor: `${accent}14` } : undefined}
                  className={`border-b last:border-0 transition-colors ${
                    darkMode ? 'border-neutral-800/60' : 'border-neutral-50'
                  } ${onSelect ? 'cursor-pointer' : ''}`}
                >
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
                          darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
                        }`}
                      >
                        {row.image ? (
                          <img src={row.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Tag
                            className={`w-5 h-5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium truncate max-w-[200px] ${
                          darkMode ? 'text-neutral-100' : 'text-neutral-900'
                        }`}
                      >
                        {row.title}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`py-3 pr-3 text-right whitespace-nowrap ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    {fmtNumber(row.metrics.quantity)}
                  </td>
                  <td
                    className={`py-3 pr-3 text-right whitespace-nowrap ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    {fmtNumber(row.metrics.purchases)}
                  </td>
                  <td
                    className={`py-3 pr-3 text-right whitespace-nowrap ${
                      darkMode ? 'text-neutral-200' : 'text-neutral-700'
                    }`}
                  >
                    {fmtNumber(row.metrics.views)}
                  </td>
                  <td
                    className={`py-3 pr-3 text-right font-semibold whitespace-nowrap ${
                      darkMode ? 'text-neutral-100' : 'text-neutral-900'
                    }`}
                  >
                    {fmtCurrency(row.metrics.revenue)}
                  </td>
                  <td className="py-3 pr-1 text-right">
                    {onSelect ? (
                      <ChevronRight
                        className={`w-4 h-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};