'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import { VendorProductVariantsTable } from '@/components/vendor-products/VendorProductVariantsTable';

export function VendorProductVariantsPage({ productId }: { productId: string }) {
  const { darkMode } = useThemeStore();

  return (
    <main className="lg:col-span-3 space-y-6">
      <div
        className={`rounded-[28px] p-6 ${
          darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              darkMode ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Manage variants</h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Create, edit, and manage product variants and their pricing.
            </p>
          </div>
          <Link
            href={`/vendor/products/${productId}`}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
              darkMode
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to product
          </Link>
        </div>
      </div>

      <VendorProductVariantsTable productId={productId} />
    </main>
  );
}
