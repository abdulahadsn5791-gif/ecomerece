import { motion } from 'framer-motion';
import { useThemeStore } from '@ecomerece/frontend';
import React from 'react';

interface HomeSkeletonProps {
  darkMode: boolean;
}

export const HomeSkeleton = ({ darkMode }: HomeSkeletonProps) => (
  <main className="lg:col-span-3">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`rounded-[28px] p-8 ${darkMode ? 'bg-neutral-900' : 'bg-white shadow-sm'}`}
    >
      <div className="flex items-center gap-4 mb-8 animate-pulse">
        <div
          className={`w-14 h-14 rounded-2xl ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
        />
        <div className="flex-1 space-y-2">
          <div
            className={`h-7 w-48 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
          />
          <div
            className={`h-4 w-64 rounded-full ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-24 rounded-2xl animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
          />
        ))}
      </div>

      {[1, 2, 3].map((s) => (
        <div key={s} className="mb-6">
          <div
            className={`h-5 w-32 rounded-full mb-4 animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((c) => (
              <div
                key={c}
                className={`h-20 rounded-2xl animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  </main>
);
