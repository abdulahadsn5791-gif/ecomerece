'use client';

import { useThemeStore } from '@ecomerece/frontend/theme';
import type React from 'react';
import { GenericConfirmModal, type ModalVariant } from '@/components/GenericConfirmModal';

export interface ReasonPayload {
  reason?: string;
}

interface ReasonActionModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  variant?: ModalVariant;
  confirmText?: string;
  reasonPlaceholder?: string;
  /** When true the user must enter a reason before confirming. Defaults to true. */
  requireReason?: boolean;
  isPending: boolean;
  error: unknown;
  onClose: () => void;
  onConfirm: (payload: ReasonPayload) => void;
}

function ReasonField({
  payload,
  updatePayload,
  placeholder,
  darkMode,
}: {
  payload: Partial<ReasonPayload>;
  updatePayload: (u: Partial<ReasonPayload>) => void;
  placeholder: string;
  darkMode: boolean;
}) {
  return (
    <label className="block">
      <span
        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
      >
        Reason <span className="text-red-500">*</span>
      </span>
      <textarea
        value={payload.reason ?? ''}
        onChange={(e) => updatePayload({ reason: e.target.value })}
        placeholder={placeholder}
        rows={3}
        className={`w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none transition-colors focus:ring-2 focus:ring-violet-500 ${
          darkMode
            ? 'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-violet-500'
            : 'bg-white border border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-violet-500'
        }`}
      />
    </label>
  );
}

export function ReasonActionModal({
  isOpen,
  title,
  message,
  variant = 'danger',
  confirmText = 'Confirm',
  reasonPlaceholder = 'Provide a short reason…',
  requireReason = true,
  isPending,
  error,
  onClose,
  onConfirm,
}: ReasonActionModalProps) {
  const { darkMode } = useThemeStore();

  return (
    <GenericConfirmModal<ReasonPayload>
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      message={message}
      variant={variant}
      confirmText={confirmText}
      isLoading={isPending}
      error={error}
      defaultPayload={{}}
      onConfirm={onConfirm}
      renderFields={
        requireReason
          ? (payload, updatePayload) => (
              <ReasonField
                payload={payload}
                updatePayload={updatePayload}
                placeholder={reasonPlaceholder}
                darkMode={darkMode}
              />
            )
          : undefined
      }
    />
  );
}
