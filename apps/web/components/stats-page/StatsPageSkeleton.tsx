'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';

export const StatsPageSkeleton = () => {
  const { darkMode } = useThemeStore();
  const block = `animate-pulse rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lg:col-span-3 space-y-6"
    >
      <div className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}>
        <div className={`h-7 w-64 ${block}`} />
        <div className={`h-4 w-80 mt-3 ${block}`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`h-24 rounded-2xl ${block}`} />
        ))}
      </div>

      <div className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}>
        <div className={`h-64 ${block}`} />
      </div>

      <div className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}>
        <div className={`h-48 ${block}`} />
      </div>
    </motion.div>
  );
};
