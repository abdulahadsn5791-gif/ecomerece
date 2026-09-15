'use client';

import {
  useCreateMyProductVariant,
  useGetVariantsByProductId,
  useSoftDeleteMyVariant,
  useToggleMyVariantAppearance,
  useUpdateMyVariantMeta,
  useUpdateMyVariantPrice,
} from '@ecomerece/frontend';
import { useThemeStore } from '@ecomerece/frontend/theme';
import type { ProductVariantResponseReadModel } from '@ecomerece/shared';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Layers, Pen, Plus, Tag, Trash2 } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { ReasonActionModal } from '@/components/admin-catalog/ReasonActionModal';
import { type RowActionItem, RowActionMenu } from '@/components/admin-catalog/RowActionMenu';
import { fmtCurrency } from '@/components/stats-page/format';
import {
  VariantCreateModal,
  type VariantCreatePayload,
} from '@/components/vendor-products/VariantCreateModal';
import {
  VariantEditModal,
  type VariantEditPayload,
} from '@/components/vendor-products/VariantEditModal';

const SKELETON_KEYS = ['v1', 'v2', 'v3', 'v4'];

function createdAt(v: ProductVariantResponseReadModel) {
  const d = new Date(v.createdAt);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US');
}

export function VendorProductVariantsTable({ productId }: { productId: string }) {
  const { darkMode } = useThemeStore();

  const { data: variants, isLoading, isError, error } = useGetVariantsByProductId(productId);

  const createVariant = useCreateMyProductVariant();
  const updateMeta = useUpdateMyVariantMeta();
  const updatePrice = useUpdateMyVariantPrice();
  const toggleAppearance = useToggleMyVariantAppearance();
  const softDelete = useSoftDeleteMyVariant();

  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<{
    variant: ProductVariantResponseReadModel;
    mode: 'title' | 'price';
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductVariantResponseReadModel | null>(null);

  const deletedIds = useRef<Set<string>>(new Set());
  const rows = useMemo(
    () => (variants ?? []).filter((v) => !deletedIds.current.has(v.id)),
    [variants],
  );

  const handleCreate = async (payload: VariantCreatePayload) => {
    const price = Number(payload.price);
    const discountedPrice = Number(payload.discountedPrice);
    if (!payload.title.trim() || !Number.isFinite(price) || !Number.isFinite(discountedPrice))
      return;
    try {
      await createVariant.mutateAsync({
        productId,
        title: payload.title.trim(),
        price,
        discountedPrice,
        active: payload.active,
      });
      createVariant.reset();
      setCreateOpen(false);
    } catch {
      /* surfaced via createVariant.error */
    }
  };

  const handleEdit = async (payload: VariantEditPayload) => {
    if (!edit) return;
    const { variant, mode } = edit;
    try {
      if (mode === 'title') {
        if (payload.title.trim().length < 3) return;
        await updateMeta.mutateAsync({
          productId,
          variantId: variant.id,
          title: payload.title.trim(),
        });
      } else {
        const price = Number(payload.price);
        const discountedPrice = Number(payload.discountedPrice);
        if (!Number.isFinite(price) || !Number.isFinite(discountedPrice)) return;
        await updatePrice.mutateAsync({
          productId,
          variantId: variant.id,
          price,
          discountedPrice,
        });
      }
      updateMeta.reset();
      updatePrice.reset();
      setEdit(null);
    } catch {
      /* surfaced via mutation error */
    }
  };

  const handleToggleActive = async (v: ProductVariantResponseReadModel) => {
    try {
      await toggleAppearance.mutateAsync({
        productId,
        variantId: v.id,
        appearance: !v.active,
      });
      toggleAppearance.reset();
    } catch {
      /* surfaced via toggleAppearance.error */
    }
  };

  const handleConfirmDelete = async (payload: { reason?: string }) => {
    if (!deleteTarget || !payload.reason?.trim()) return;
    try {
      await softDelete.mutateAsync({
        productId,
        variantId: deleteTarget.id,
        reason: payload.reason.trim(),
      });
      deletedIds.current.add(deleteTarget.id);
      softDelete.reset();
      setDeleteTarget(null);
    } catch {
      /* surfaced via softDelete.error */
    }
  };

  const closeDelete = () => {
    softDelete.reset();
    setDeleteTarget(null);
  };

  const menuItems = (v: ProductVariantResponseReadModel): RowActionItem[] => [
    {
      key: 'title',
      label: 'Edit title',
      icon: Pen,
      onClick: () => setEdit({ variant: v, mode: 'title' }),
    },
    {
      key: 'price',
      label: 'Edit price',
      icon: Tag,
      onClick: () => setEdit({ variant: v, mode: 'price' }),
    },
    {
      key: 'active',
      label: v.active ? 'Deactivate' : 'Activate',
      icon: v.active ? EyeOff : Eye,
      onClick: () => handleToggleActive(v),
    },
    {
      key: 'delete',
      label: 'Soft delete',
      icon: Trash2,
      danger: true,
      onClick: () => setDeleteTarget(v),
    },
  ];

  const card = `rounded-[28px] p-6 ${darkMode ? 'bg-neutral-900 border border-neutral-800' : 'bg-white shadow-sm border border-transparent'}`;
  const border = darkMode ? 'border-neutral-800' : 'border-neutral-100';
  const cellBase = 'px-5 py-4';
  const thCls = darkMode ? 'text-neutral-500' : 'text-neutral-500';
  const rowHover = darkMode ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-50';

  const inStockPill = (active: boolean) =>
    active
      ? darkMode
        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30'
        : 'bg-emerald-100 text-emerald-700 border-emerald-200'
      : darkMode
        ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
        : 'bg-neutral-100 text-neutral-600 border-neutral-200';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={card}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Layers className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              Product variants
            </h2>
            <p className={`text-sm mt-1 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Create variants, set pricing, and control which ones are live on the storefront.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add variant
          </button>
        </div>

        {isLoading ? (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-hidden`}>
            {SKELETON_KEYS.map((k) => (
              <div
                key={k}
                className={`flex items-center gap-4 px-5 py-4 border-b ${border} ${darkMode ? 'bg-neutral-900' : 'bg-white'}`}
              >
                <div className="flex-1 space-y-2">
                  <div
                    className={`h-3.5 w-48 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                  <div
                    className={`h-3 w-32 rounded animate-pulse ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div
            className={`mt-6 rounded-[20px] border p-8 text-center text-sm ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            Couldn&apos;t load variants. {(error as Error)?.message ?? ''}
          </div>
        ) : rows.length === 0 ? (
          <div
            className={`mt-6 rounded-[20px] border p-10 text-center ${border} ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
          >
            <Layers className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold">No variants yet.</p>
            <p className="text-xs mt-1 opacity-70">
              Add your first variant to start selling options.
            </p>
          </div>
        ) : (
          <div className={`mt-6 rounded-[20px] border ${border} overflow-x-auto`}>
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className={`border-b ${border}`}>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Variant
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Price
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Discounted
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Status
                  </th>
                  <th
                    className={`text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Created
                  </th>
                  <th
                    className={`text-right px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider ${thCls}`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((v) => (
                  <tr
                    key={v.id}
                    className={`border-b last:border-b-0 transition-colors ${rowHover} ${border}`}
                  >
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
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border whitespace-nowrap ${inStockPill(v.active)}`}
                      >
                        {v.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td
                      className={`${cellBase} whitespace-nowrap ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                    >
                      {createdAt(v)}
                    </td>
                    <td className={`${cellBase} text-right`}>
                      <RowActionMenu items={menuItems(v)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <VariantCreateModal
        isOpen={createOpen}
        isPending={createVariant.isPending}
        error={createVariant.error}
        onClose={() => {
          createVariant.reset();
          setCreateOpen(false);
        }}
        onConfirm={handleCreate}
      />

      <VariantEditModal
        isOpen={Boolean(edit)}
        mode={edit?.mode ?? 'title'}
        title={edit?.variant.title ?? ''}
        price={edit?.variant.price ?? 0}
        discountedPrice={edit?.variant.discountedPrice ?? 0}
        isPending={updateMeta.isPending || updatePrice.isPending}
        error={updateMeta.error ?? updatePrice.error}
        onClose={() => {
          updateMeta.reset();
          updatePrice.reset();
          setEdit(null);
        }}
        onConfirm={handleEdit}
      />

      <ReasonActionModal
        isOpen={Boolean(deleteTarget)}
        title={`Soft-delete "${deleteTarget?.title ?? ''}"?`}
        message="The variant will be hidden from the storefront. You can contact support to recover it later."
        variant="danger"
        confirmText="Soft delete"
        requireReason
        reasonPlaceholder="Why is this variant being removed?"
        isPending={softDelete.isPending}
        error={softDelete.error}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
