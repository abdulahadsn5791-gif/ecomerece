'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';

import { GenericConfirmModal } from '@/components/GenericConfirmModal';

export interface CreateCategoryPayload {
  title?: string;
  image?: string;
}

interface CreateCategoryModalProps {
  isOpen: boolean;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (payload: CreateCategoryPayload) => void;
}

function inputCls(darkMode: boolean) {
  return `w-full px-4 py-3 rounded-2xl text-sm outline-none transition-colors focus:ring-2 focus:ring-violet-500 ${
    darkMode
      ? 'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500'
      : 'bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-violet-500'
  }`;
}

export function CreateCategoryModal({
  isOpen,
  isPending,
  error,
  onClose,
  onConfirm,
}: CreateCategoryModalProps) {
  const { darkMode } = useThemeStore();
  const cls = inputCls(darkMode);

  return (
    <GenericConfirmModal<CreateCategoryPayload>
      isOpen={isOpen}
      onClose={onClose}
      title="Create category"
      message="Add a new category to organize the catalog. The image is shown on the storefront."
      variant="confirm"
      confirmText="Create category"
      isLoading={isPending}
      error={error}
      wide
      defaultPayload={{}}
      onConfirm={onConfirm}
      renderFields={(payload, updatePayload) => (
        <div className="space-y-4">
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              Title <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={payload.title ?? ''}
              onChange={(e) => updatePayload({ title: e.target.value })}
              placeholder="e.g. Electronics"
              className={cls}
            />
          </label>
          <label className="block">
            <span
              className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
            >
              Image URL <span className="text-red-500">*</span>
            </span>
            <input
              type="url"
              value={payload.image ?? ''}
              onChange={(e) => updatePayload({ image: e.target.value })}
              placeholder="https://…"
              className={cls}
            />
          </label>
        </div>
      )}
    />
  );
}
