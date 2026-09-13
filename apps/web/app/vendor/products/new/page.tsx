'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';
import { VendorCreateProductForm } from '@/components/vendor-products/VendorCreateProductForm';

export default function VendorNewProductPage() {
  const { darkMode } = useThemeStore();

  return (
    <main className="lg:col-span-3 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm'}`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              darkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <PackagePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add product</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Create a new listing with images, ingredients, and disclaimers.
            </p>
          </div>
        </div>
      </motion.div>

      <VendorCreateProductForm />
    </main>
  );
}
