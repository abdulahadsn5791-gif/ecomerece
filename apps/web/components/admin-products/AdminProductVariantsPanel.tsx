'use client';

import type { ProductVariantReadModel } from '@ecomerece/domain';
import { useGetAdminPaginatedVariants, useRecoverVariant } from '@ecomerece/frontend';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { ProductVariantResponseReadModel } from '@ecomerece/shared';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, PackageOpen, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { fmtCurrency } from '@/components/stats-page/format';

type AdminVariantRow = ProductVariantResponseReadModel &
  Partial<Pick<ProductVariantReadModel, 'deleted'>>;

function createdAt(v: AdminVariantRow) {
  const d = new Date(v.createdAt);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US');
}

export function AdminProductVariantsPanel({ productId }: { productId: string }) {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useGetAdminPaginatedVariants({
    productId,
    limit: 100,
    direction: 'next',
  });

  const recover = useRecoverVariant();
  const rows: AdminVariantRow[] = useMemo(
    () => (data?.data as AdminVariantRow[] | undefined) ?? [],
    [data],
  );

  const handleRecover = async (v: AdminVariantRow) => {
    try {
      await recover.mutateAsync(v.id);
      recover.reset();
      await queryClient.invalidateQueries({
        queryKey: ['product-variants', 'admin-paginated'],
      });
    } catch {
      /* surfaced via recover.error */
    }
  };

  const card = `rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm'}`;
  const border = darkMode ? 'border-neutral-800' : 'border-neutral-100';
  const cellBase = 'px-5 py-4';
  const thCls = darkMode ? 'text-neutral-500' : 'text-neutral-500';

  const statusPill = (v: AdminVariantRow) => {
    if (v.deleted?.deleted) {
      return darkMode
        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
        : 'bg-neutral-200 text-neutral-600 border-neutral-300';
    }
    return v.active
      ? darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : darkMode
        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
        : 'bg-neutral-100 text-neutral-600 border-neutral-200';
  };

  const statusLabel = (v: AdminVariantRow) => {
    if (v.deleted?.deleted) return 'Deleted';
    return v.active ? 'Active' : 'Inactive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={card}
    >
      <div>
        <h2 className="text-base font-bold flex items-center gap-2">
          <PackageOpen className={`w-5 h-5 ${darkMode ? 'text-violet-400' : 'text-violet-600'}`} />
          Product variants
        </h2>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
          All variants for this product. Recover soft-deleted variants.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm py-6 text-neutral-500">
          <Loader2
            className={`w-4 h-4 animate-spin ${darkMode ? 'text-violet-400' : 'text-violet-600'}`}
          />
          Loading variants…
        </div>
      ) : isError ? (
        <div
          className={`mt-4 rounded-[20px] border p-6 text-center text-sm ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
        >
          Couldn&apos;t load variants. {(error as Error)?.message ?? ''}
        </div>
      ) : rows.length === 0 ? (
        <div
          className={`mt-4 rounded-[20px] border p-8 text-center ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
        >
          <PackageOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold">No variants for this product.</p>
        </div>
      ) : (
        <div className={`mt-4 rounded-[20px] border ${border} overflow-x-auto`}>
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className={`border-b ${border}`}>
                <th
                  className={`text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Variant
                </th>
                <th
                  className={`text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Price
                </th>
                <th
                  className={`text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Discounted
                </th>
                <th
                  className={`text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Status
                </th>
                <th
                  className={`text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Created
                </th>
                <th
                  className={`text-right px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.id} className={`border-b last:border-b-0 ${border}`}>
                  <td className={`${cellBase} font-semibold`}>{v.title}</td>
                  <td className={`${cellBase} whitespace-nowrap font-medium`}>
                    {fmtCurrency(v.price)}
                  </td>
                  <td className={`${cellBase} whitespace-nowrap`}>
                    <span
                      className={
                        v.discountedPrice < v.price
                          ? 'text-emerald-600'
                          : darkMode
                            ? 'text-neutral-500'
                            : 'text-neutral-400'
                      }
                    >
                      {fmtCurrency(v.discountedPrice)}
                    </span>
                  </td>
                  <td className={cellBase}>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${statusPill(v)}`}
                    >
                      {statusLabel(v)}
                    </span>
                  </td>
                  <td
                    className={`${cellBase} whitespace-nowrap ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                  >
                    {createdAt(v)}
                  </td>
                  <td className={`${cellBase} text-right`}>
                    {v.deleted?.deleted || false ? (
                      <button
                        type="button"
                        disabled={recover.isPending}
                        onClick={() => handleRecover(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-violet-500 hover:bg-violet-600 disabled:opacity-50 transition-colors"
                      >
                        {recover.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="w-3.5 h-3.5" />
                        )}
                        Recover
                      </button>
                    ) : (
                      <span className="text-xs opacity-40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
