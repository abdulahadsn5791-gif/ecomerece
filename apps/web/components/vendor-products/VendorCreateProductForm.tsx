'use client';

import { useGetAdminCategoriesInfinite } from '@ecomerece/frontend/category';
import { useCreateMyProduct } from '@ecomerece/frontend/product';
import { useThemeStore } from '@ecomerece/frontend/theme';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import Mutationbutton from '@/components/Mutationbutton';
import {
  DisclaimerEditor,
  type DisclaimerEntry,
} from '@/components/vendor-products/DisclaimerEditor';
import {
  ImageListEditor,
  type ProductImageEntry,
} from '@/components/vendor-products/ImageListEditor';
import { IngredientEditor } from '@/components/vendor-products/IngredientEditor';

const inputCls = (darkMode: boolean) =>
  darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

function SectionCard({
  darkMode,
  title,
  children,
}: {
  darkMode: boolean;
  title: string;
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
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

export function VendorCreateProductForm() {
  const { darkMode } = useThemeStore();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [appearance, setAppearance] = useState<'public' | 'private'>('public');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ProductImageEntry[]>([]);
  const [ingredientsEnabled, setIngredientsEnabled] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [disclaimersEnabled, setDisclaimersEnabled] = useState(false);
  const [disclaimers, setDisclaimers] = useState<DisclaimerEntry[]>([]);
  const [localError, setLocalError] = useState('');

  const create = useCreateMyProduct();

  const categoriesResult = useGetAdminCategoriesInfinite({});
  const categories = useMemo(
    () =>
      (categoriesResult.data?.pages.flatMap((p) => p.data) ?? []).filter(
        (c) => !c.isDeleted && !c.idBlocked,
      ),
    [categoriesResult.data],
  );

  const handleSubmit = async () => {
    setLocalError('');
    if (title.trim().length < 3) return setLocalError('Title must be at least 3 characters.');
    if (description.trim().length < 10) {
      return setLocalError('Description must be at least 10 characters.');
    }
    if (!categoryId) return setLocalError('Please select a category.');
    if (images.length === 0) return setLocalError('At least one image is required.');
    if (images.some((i) => !i.url || !i.alt))
      return setLocalError('Every image needs a URL and alt text.');
    if (ingredientsEnabled && ingredients.length === 0) {
      return setLocalError('Add at least one ingredient or turn the ingredients list off.');
    }
    if (disclaimersEnabled && disclaimers.length === 0) {
      return setLocalError('Add at least one disclaimer or turn disclaimers off.');
    }

    try {
      await create.mutateAsync({
        title: title.trim(),
        categoryId,
        appearance,
        description: description.trim(),
        ingredient: { isIngredients: ingredientsEnabled, ingredients },
        disclaimer: {
          isDisclaimer: disclaimersEnabled,
          disclaimers: disclaimers.map((d) => ({ name: d.name, title: d.title })),
        },
        image: { images: images.map((i) => ({ url: i.url, alt: i.alt, default: i.default })) },
      });
      router.push('/vendor/products');
    } catch {
      /* surfaced via create.error */
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard darkMode={darkMode} title="Basic information">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="create-product-title"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Title
            </label>
            <input
              id="create-product-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product title"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="create-product-category"
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Category
              </label>
              <select
                id="create-product-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer ${inputCls(darkMode)}`}
              >
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span
                className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                Appearance
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['public', 'private'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAppearance(a)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-colors capitalize ${
                      appearance === a
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
          </div>

          <div>
            <label
              htmlFor="create-product-description"
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              Description
            </label>
            <textarea
              id="create-product-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your product…"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 resize-y ${inputCls(darkMode)}`}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Images">
        <ImageListEditor
          images={images}
          busy={create.isPending}
          onAdd={(img) => setImages((prev) => [...prev, img])}
          onRemove={(img) =>
            setImages((prev) => prev.filter((i) => i.url !== img.url || i.alt !== img.alt))
          }
          onSetDefault={(index) =>
            setImages((prev) => prev.map((i, idx) => ({ ...i, default: idx === index })))
          }
        />
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Ingredients">
        <IngredientEditor
          enabled={ingredientsEnabled}
          items={ingredients}
          busy={create.isPending}
          onToggle={setIngredientsEnabled}
          onAdd={(items) => setIngredients((prev) => [...prev, ...items])}
          onRemove={(items) => setIngredients((prev) => prev.filter((i) => !items.includes(i)))}
        />
      </SectionCard>

      <SectionCard darkMode={darkMode} title="Disclaimers">
        <DisclaimerEditor
          enabled={disclaimersEnabled}
          items={disclaimers}
          busy={create.isPending}
          onToggle={setDisclaimersEnabled}
          onAdd={(items) => setDisclaimers((prev) => [...prev, ...items])}
          onRemove={(items) =>
            setDisclaimers((prev) => prev.filter((d) => !items.some((r) => r.name === d.name)))
          }
        />
      </SectionCard>

      {localError && (
        <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>{localError}</p>
      )}
      {create.error && (
        <p className={`text-sm ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>
          {create.error instanceof Error ? create.error.message : 'Could not create the product.'}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push('/vendor/products')}
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
            darkMode
              ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Cancel
        </button>
        <Mutationbutton
          variant="success"
          size="md"
          isLoading={create.isPending}
          onClick={handleSubmit}
        >
          Create product
        </Mutationbutton>
      </div>
    </div>
  );
}
