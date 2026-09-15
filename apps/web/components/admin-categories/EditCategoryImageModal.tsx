'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';

import { GenericConfirmModal } from '@/components/GenericConfirmModal';
import { ImageInput } from '@/components/image';

export interface EditCategoryImagePayload {
  image?: string;
}

interface EditCategoryImageModalProps {
  isOpen: boolean;
  isPending: boolean;
  error: unknown;
  title: string;
  initialImage: string;
  onClose: () => void;
  onConfirm: (payload: EditCategoryImagePayload) => void;
}

export function EditCategoryImageModal({
  isOpen,
  isPending,
  error,
  title,
  initialImage,
  onClose,
  onConfirm,
}: EditCategoryImageModalProps) {
  const { darkMode } = useThemeStore();

  return (
    <GenericConfirmModal<EditCategoryImagePayload>
      isOpen={isOpen}
      onClose={onClose}
      title={`Change image — ${title}`}
      message="Upload a new image file or paste an external URL. The previous stored image is cleaned up automatically."
      variant="confirm"
      confirmText="Save image"
      isLoading={isPending}
      error={error}
      wide
      defaultPayload={{ image: initialImage }}
      onConfirm={onConfirm}
      renderFields={(payload, updatePayload) => (
        <div className="space-y-4">
          <span
            className={`block text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
          >
            Image
          </span>
          <ImageInput
            value={payload.image ?? ''}
            onChange={(image) => updatePayload({ image })}
            darkMode={darkMode}
            tone="violet"
          />
        </div>
      )}
    />
  );
}