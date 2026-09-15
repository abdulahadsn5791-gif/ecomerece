'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import { GenericConfirmModal } from '@/components/GenericConfirmModal';

export interface VariantCreatePayload {
  title: string;
  price: string;
  discountedPrice: string;
  active: boolean;
}

interface VariantCreateModalProps {
  isOpen: boolean;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (payload: VariantCreatePayload) => void;
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

export function VariantCreateModal({
  isOpen,
  isPending,
  error,
  onClose,
  onConfirm,
}: VariantCreateModalProps) {
  const { darkMode } = useThemeStore();

  return (
    <GenericConfirmModal<VariantCreatePayload>
      isOpen={isOpen}
      onClose={onClose}
      title="Create variant"
      message="Add a new variant with its own title, price, and discount."
      variant="success"
      confirmText="Create variant"
      isLoading={isPending}
      error={error}
      wide
      defaultPayload={{ title: '', price: '', discountedPrice: '', active: true }}
      onConfirm={onConfirm}
      renderFields={(payload, update) => (
        <div className="space-y-4">
          <Field label="Title" htmlFor="variant-title" required darkMode={darkMode}>
            <input
              id="variant-title"
              type="text"
              value={payload.title ?? ''}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="e.g. 250ml, Blue, Small"
              className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none transition-colors focus:ring-2 focus:ring-emerald-500 ${inputCls(darkMode)}`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price" htmlFor="variant-price" required darkMode={darkMode}>
              <input
                id="variant-price"
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
              htmlFor="variant-discounted-price"
              required
              darkMode={darkMode}
            >
              <input
                id="variant-discounted-price"
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

          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(payload.active)}
              onChange={(e) => update({ active: e.target.checked })}
              className="w-4 h-4 accent-emerald-500"
            />
            Active (visible on storefront)
          </label>
        </div>
      )}
    />
  );
}
