'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';

export interface VariantEditPayload {
  mode: 'title' | 'price';
  title: string;
  price: string;
  discountedPrice: string;
}

interface VariantEditModalProps {
  isOpen: boolean;
  mode: 'title' | 'price';
  title: string;
  price: number;
  discountedPrice: number;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (payload: VariantEditPayload) => void;
}

function Field({
  label,
  htmlFor,
  required,
  darkMode,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  darkMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
    >
      <span className="block mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls = (darkMode: boolean) =>
  darkMode
    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus:border-emerald-500'
    : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500';

export function VariantEditModal({
  isOpen,
  mode,
  title,
  price,
  discountedPrice,
  isPending,
  error,
  onClose,
  onConfirm,
}: VariantEditModalProps) {
  const { darkMode } = useThemeStore();

  return (
    <GenericConfirmModal<VariantEditPayload>
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'title' ? 'Edit variant title' : 'Edit variant price'}
      message={
        mode === 'title'
          ? 'Update the title shown on the product page for this variant.'
          : 'Update the price and discount for this variant.'
      }
      variant="success"
      confirmText="Save changes"
      isLoading={isPending}
      error={error}
      wide
      defaultPayload={{
        mode,
        title,
        price: String(price),
        discountedPrice: String(discountedPrice),
      }}
      onConfirm={onConfirm}
      renderFields={(payload, update) =>
        mode === 'title' ? (
          <Field label="Title" htmlFor="variant-edit-title" required darkMode={darkMode}>
            <input
              id="variant-edit-title"
              type="text"
              value={payload.title ?? ''}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. 250ml, Blue, Small"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
            />
          </Field>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price" htmlFor="variant-edit-price" required darkMode={darkMode}>
              <input
                id="variant-edit-price"
                type="number"
                min={1}
                step="any"
                value={payload.price ?? ''}
                onChange={(e) => update({ price: e.target.value })}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
            <Field
              label="Discounted price"
              htmlFor="variant-edit-discounted-price"
              required
              darkMode={darkMode}
            >
              <input
                id="variant-edit-discounted-price"
                type="number"
                min={1}
                step="any"
                value={payload.discountedPrice ?? ''}
                onChange={(e) => update({ discountedPrice: e.target.value })}
                placeholder="0.00"
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
              />
            </Field>
          </div>
        )
      }
    />
  );
}
