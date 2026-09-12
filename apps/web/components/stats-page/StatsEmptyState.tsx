'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import type React from 'react';

interface StatsEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export const StatsEmptyState = ({
  title,
  description,
  icon: Icon = PackageSearch,
}: StatsEmptyStateProps) => {
  const { darkMode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-[28px] p-10 text-center ${
        darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'
      }`}
    >
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
        }`}
      >
        <Icon className={`w-8 h-8 ${darkMode ? 'text-neutral-400' : 'text-neutral-400'}`} />
      </div>
      <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
        {title}
      </h3>
      <p
        className={`text-sm max-w-md mx-auto ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
      >
        {description}
      </p>
    </motion.div>
  );
};
