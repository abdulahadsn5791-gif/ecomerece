'use client';

import { motion } from 'framer-motion';

interface DashboardSkeletonProps {
  darkMode: boolean;
}

const block = (darkMode: boolean, extra = '') =>
  `animate-pulse rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'} ${extra}`;

export const DashboardSkeleton = ({ darkMode }: DashboardSkeletonProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="lg:col-span-3 space-y-6"
  >
    <div
      className={`rounded-[28px] p-6 sm:p-8 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className={`w-20 h-20 rounded-2xl ${block(darkMode)}`} />
        <div className="flex-1 space-y-3 w-full">
          <div className={`h-7 w-56 ${block(darkMode)}`} />
          <div className={`h-4 w-72 ${block(darkMode)}`} />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`h-24 rounded-2xl ${block(darkMode)}`} />
      ))}
    </div>

    <div className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}>
      <div className={`h-72 ${block(darkMode)}`} />
    </div>

    <div className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}>
      <div className={`h-48 ${block(darkMode)}`} />
    </div>
  </motion.div>
);
