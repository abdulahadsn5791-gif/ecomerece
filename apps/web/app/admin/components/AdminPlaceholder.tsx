'use client';

import { useThemeStore } from '@ecomerece/frontend';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import React from 'react';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

export const AdminPlaceholder = ({ title, description, icon: Icon }: AdminPlaceholderProps) => {
  const { darkMode } = useThemeStore();

  return (
    <main className="lg:col-span-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`border rounded-[28px] p-10 text-center shadow-sm transition-colors duration-300 ${
          darkMode
            ? 'bg-neutral-900 border-neutral-800'
            : 'bg-white border-neutral-100'
        }`}
      >
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            darkMode ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
          }`}
        >
          <Icon className="w-8 h-8" />
        </div>
        <h2
          className={`text-2xl font-bold tracking-tight mb-2 ${
            darkMode ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-sm max-w-md mx-auto ${
            darkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          {description}
        </p>
        <div
          className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
            darkMode
              ? 'bg-orange-900/30 text-orange-400'
              : 'bg-orange-100 text-orange-600'
          }`}
        >
          <Construction className="w-3.5 h-3.5" />
          Coming soon
        </div>
      </motion.div>
    </main>
  );
};
