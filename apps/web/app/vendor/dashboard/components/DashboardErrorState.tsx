'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorStateProps {
  darkMode: boolean;
  refetch: () => void;
  isFetching: boolean;
}

export const DashboardErrorState = ({
  darkMode,
  refetch,
  isFetching,
}: DashboardErrorStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`lg:col-span-3 rounded-[28px] p-10 text-center ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
  >
    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-rose-500">
      <AlertTriangle className="w-8 h-8 text-white" />
    </div>
    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-900'}`}>
      Failed to load your dashboard
    </h3>
    <p className={`mb-6 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
      Something went wrong while fetching your store data. Please try again.
    </p>
    <button
      type="button"
      onClick={() => refetch()}
      disabled={isFetching}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-60"
    >
      <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
      {isFetching ? 'Retrying…' : 'Retry'}
    </button>
  </motion.div>
);
