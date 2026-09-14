'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { useGetMyVendor } from '@ecomerece/frontend/vendor';
import { motion } from 'framer-motion';
import { Loader2, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { VendorCreateForm } from '@/components/vendor-create/VendorCreateForm';

export default function VendorCreatePage() {
  const { darkMode } = useThemeStore();
  const router = useRouter();
  const { data: vendor, isLoading } = useGetMyVendor();

  useEffect(() => {
    if (vendor) router.replace('/vendor/dashboard');
  }, [vendor, router]);

  if (isLoading || vendor) {
    return (
      <main className="lg:col-span-3">
        <div
          className={`rounded-[28px] p-10 flex items-center justify-center gap-3 text-sm ${
            darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'
          }`}
        >
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Checking your account…
        </div>
      </main>
    );
  }

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
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Become a vendor</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Create your store profile to start selling. An admin verifies your account before it
              goes live.
            </p>
          </div>
        </div>
      </motion.div>

      <VendorCreateForm />
    </main>
  );
}
