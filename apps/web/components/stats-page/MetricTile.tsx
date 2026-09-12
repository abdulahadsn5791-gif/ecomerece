'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import type React from 'react';

interface MetricTileProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: string;
  helper?: string;
  delay?: number;
}

export const MetricTile = ({
  label,
  value,
  icon: Icon,
  accent = '#737373',
  helper,
  delay = 0,
}: MetricTileProps) => {
  const { darkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`rounded-2xl p-4 transition-colors duration-500 ${
        darkMode
          ? 'bg-neutral-900 border border-neutral-800'
          : 'bg-white shadow-sm border border-neutral-100'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}1a`, color: accent }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider ${
            darkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {label}
        </span>
      </div>
      <p
        className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-neutral-900'}`}
      >
        {value}
      </p>
      {helper ? (
        <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          {helper}
        </p>
      ) : null}
    </motion.div>
  );
};
