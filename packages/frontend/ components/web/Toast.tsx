'use client';

import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { ComponentType } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastProps {
  variant: ToastVariant;
  message: string;
  onDismiss: () => void;
}

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: ComponentType<{ className?: string }>; border: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    border: 'border-emerald-200 dark:border-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    border: 'border-red-200 dark:border-red-900',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    border: 'border-slate-200 dark:border-slate-700',
    iconColor: 'text-slate-600 dark:text-slate-300',
  },
};

export function Toast({ variant, message, onDismiss }: ToastProps) {
  const { icon: Icon, border, iconColor } = VARIANT_STYLES[variant];
  return (
    <div
      role="status"
      className={`flex items-start gap-2.5 rounded-md border bg-white p-3 shadow-lg dark:bg-slate-900 ${border}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}