'use client';

import {
  PRODUCT_QUERY_KEY,
  useAddMyProductDisclaimers,
  useAddMyProductImages,
  useAddMyProductIngredients,
  useGetProductById,
  useMakeMyProductPrivate,
  useMakeMyProductPublic,
  useRemoveMyProductDisclaimers,
  useRemoveMyProductImages,
  useRemoveMyProductIngredients,
  useSetMyProductDefaultImage,
  useSoftDeleteMyProduct,
  useToggleMyProductDisclaimer,
  useToggleMyProductIngredients,
  useUpdateMyProductMeta,
} from '@ecomerece/frontend/product';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { ReasonActionModal } from '@/components/admin-catalog/ReasonActionModal';
import Mutationbutton from '@/components/Mutationbutton';
import { DisclaimerEditor } from '@/components/vendor-products/DisclaimerEditor';
import { ImageListEditor } from '@/components/vendor-products/ImageListEditor';
import { IngredientEditor } from '@/components/vendor-products/IngredientEditor';

function SectionCard({
  darkMode,
  title,
  description,
  children,
}: {
  darkMode: boolean;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-[28px] p-6 space-y-4 ${
        darkMode
          ? 'bg-neutral-900 border border-neutral-800'
          : 'bg-white shadow-sm border border-transparent'
      }`}
    >
      <div>
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {description && (
          <p className={`text-xs mt-0.5 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls = (darkMode: boolean) =>
  darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

export function VendorEditProductForm({ productId }: { productId: string }) {
  const { darkMode } = useThemeStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading, isError, error } = useGetProductById(productId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const synced = useRef(false);

  useEffect(() => {
    if (product && !synced.current) {
      synced.current = true;
      setTitle(product.title);
      setDescription(product.description);
    }
  }, [product]);

  // ── Mutations ─────────────────────────────────────────────────────────
  const meta = useUpdateMyProductMeta();
  const makePublic = useMakeMyProductPublic();
  const makePrivate = useMakeMyProductPrivate();
  const addImages = useAddMyProductImages();
  const removeImages = useRemoveMyProductImages();
  const setDefaultImage = useSetMyProductDefaultImage();
  const toggleIngredients = useToggleMyProductIngredients();
  const addIngredients = useAddMyProductIngredients();
  const removeIngredients = useRemoveMyProductIngredients();
  const toggleDisclaimer = useToggleMyProductDisclaimer();
  const addDisclaimers = useAddMyProductDisclaimers();
  const removeDisclaimers = useRemoveMyProductDisclaimers();
  const softDelete = useSoftDeleteMyProduct();

  const refresh = () => queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });

  const handleSaveMeta = async () => {
    if (title.trim().length < 3 || description.trim().length < 10) return;
    try {
      await meta.mutateAsync({ productId, title: title.trim(), description: description.trim() });
      await refresh();
    } catch {
      /* surfaced via meta.error */
    }
  };

  const handleToggleAppearance = (to: 'public' | 'private') => {
    const action = to === 'public' ? makePublic : makePrivate;
    action
      .mutateAsync({ productId })
      .then(async () => {
        await refresh();
        action.reset();
      })
      .catch(() => undefined);
  };

  const handleConfirmDelete = async (payload: { reason?: string }) => {
    if (!payload.reason?.trim()) return;
    try {
      await softDelete.mutateAsync({ productId, reason: payload.reason.trim() });
      await queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
      softDelete.reset();
      setDeleteOpen(false);
    } catch {
      /* surfaced via softDelete.error */
    }
  };

  if (isLoading) {
    return (
      <div
        className={`rounded-[28px] p-10 flex items-center justify-center gap-3 text-sm ${
          darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'
        }`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
        Loading product…
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        className={`rounded-[28px] p-10 text-center text-sm ${
          darkMode ? 'bg-neutral-900 text-neutral-400' : 'bg-white shadow-sm text-neutral-500'
        }`}
      >
        Couldn&apos;t load this product. {(error as Error)?.message ?? ''}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard darkMode={darkMode} title="Basic information">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-product-title"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Title
            </label>
            <input
              id="edit-product-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Category
              </span>
              <div
                className={`px-4 py-2.5 rounded-2xl border text-sm ${darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}
              >
                {product.categoryId}
              </div>
            </div>
            <div>
              <span
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Vendor
              </span>
              <div
                className={`px-4 py-2.5 rounded-2xl border text-sm ${darkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-600'}`}
              >
                {product.vendorTitle}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-product-description"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Description
            </label>
            <textarea
              id="edit-product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 resize-y ${inputCls(darkMode)}`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
              >
                Appearance
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'private'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    disabled={makePublic.isPending || makePrivate.isPending}
                    onClick={() => handleToggleAppearance(a)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors capitalize disabled:opacity-50 ${
                      product.appearance === a
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : darkMode
                          ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <Mutationbutton
              variant="success"
              size="sm"
              isLoading={meta.isPending}
              onClick={handleSaveMeta}
            >
              Save changes
            </Mutationbutton>
          </div>
          {meta.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {meta.error instanceof Error ? meta.error.message : 'Could not save changes.'}
            </p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        darkMode={darkMode}
        title="Images"
        description="Add, remove, or choose the default image."
      >
        <ImageListEditor
          images={product.image.images}
          busy={addImages.isPending || removeImages.isPending || setDefaultImage.isPending}
          onAdd={(img) =>
            addImages
              .mutateAsync({
                productId,
                images: [{ url: img.url, alt: img.alt, isDefault: img.default }],
              })
              .then(async () => {
                await refresh();
                addImages.reset();
              })
              .catch(() => undefined)
          }
          onRemove={(img) =>
            removeImages
              .mutateAsync({
                productId,
                images: [{ url: img.url, alt: img.alt, isDefault: img.default }],
              })
              .then(async () => {
                await refresh();
                removeImages.reset();
              })
              .catch(() => undefined)
          }
          onSetDefault={(index) =>
            setDefaultImage
              .mutateAsync({ productId, index })
              .then(async () => {
                await refresh();
                setDefaultImage.reset();
              })
              .catch(() => undefined)
          }
        />
        {(addImages.error && (
          <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
            {(addImages.error as Error).message}
          </p>
        )) ||
          (removeImages.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(removeImages.error as Error).message}
            </p>
          )) ||
          (setDefaultImage.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(setDefaultImage.error as Error).message}
            </p>
          ))}
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Ingredients">
        <IngredientEditor
          enabled={product.ingredient.isIngredients}
          items={product.ingredient.ingredients}
          busy={
            toggleIngredients.isPending || addIngredients.isPending || removeIngredients.isPending
          }
          onToggle={(enable) =>
            toggleIngredients
              .mutateAsync({ productId, enable })
              .then(async () => {
                await refresh();
                toggleIngredients.reset();
              })
              .catch(() => undefined)
          }
          onAdd={(items) =>
            addIngredients
              .mutateAsync({ productId, items })
              .then(async () => {
                await refresh();
                addIngredients.reset();
              })
              .catch(() => undefined)
          }
          onRemove={(items) =>
            removeIngredients
              .mutateAsync({ productId, items })
              .then(async () => {
                await refresh();
                removeIngredients.reset();
              })
              .catch(() => undefined)
          }
        />
        {(toggleIngredients.error && (
          <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
            {(toggleIngredients.error as Error).message}
          </p>
        )) ||
          (addIngredients.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(addIngredients.error as Error).message}
            </p>
          )) ||
          (removeIngredients.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(removeIngredients.error as Error).message}
            </p>
          ))}
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Disclaimers">
        <DisclaimerEditor
          enabled={product.disclaimer.isDisclaimer}
          items={product.disclaimer.disclaimers}
          busy={
            toggleDisclaimer.isPending || addDisclaimers.isPending || removeDisclaimers.isPending
          }
          onToggle={(enable) =>
            toggleDisclaimer
              .mutateAsync({ productId, enable })
              .then(async () => {
                await refresh();
                toggleDisclaimer.reset();
              })
              .catch(() => undefined)
          }
          onAdd={(items) =>
            addDisclaimers
              .mutateAsync({ productId, items })
              .then(async () => {
                await refresh();
                addDisclaimers.reset();
              })
              .catch(() => undefined)
          }
          onRemove={(items) =>
            removeDisclaimers
              .mutateAsync({ productId, items })
              .then(async () => {
                await refresh();
                removeDisclaimers.reset();
              })
              .catch(() => undefined)
          }
        />
        {(toggleDisclaimer.error && (
          <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
            {(toggleDisclaimer.error as Error).message}
          </p>
        )) ||
          (addDisclaimers.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(addDisclaimers.error as Error).message}
            </p>
          )) ||
          (removeDisclaimers.error && (
            <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
              {(removeDisclaimers.error as Error).message}
            </p>
          ))}
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Danger zone">
        <div className="flex items-center justify-between gap-3">
          <p className={`text-sm ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Soft-delete removes the product from the storefront and your catalog.
          </p>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Soft delete
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/vendor/products';
            }
          }}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
            darkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Back
        </button>
      </div>

      <ReasonActionModal
        isOpen={deleteOpen}
        title={`Soft-delete "${product.title}"?`}
        message="The product will be removed from the storefront and hidden from your catalog."
        variant="danger"
        confirmText="Soft delete"
        requireReason
        reasonPlaceholder="Why is this product being removed?"
        isPending={softDelete.isPending}
        error={softDelete.error}
        onClose={() => {
          softDelete.reset();
          setDeleteOpen(false);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
