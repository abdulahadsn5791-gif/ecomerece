// components/Toast.tsx
'use client';

import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ComponentType } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

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
    border: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/90',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    border: 'border-red-200 dark:border-red-800 bg-red-50/90 dark:bg-red-950/90',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  info: {
    icon: Info,
    border: 'border-sky-200 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/90',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-200 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/90',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
};

export function Toast({ variant, message, onDismiss }: ToastProps) {
  const { icon: Icon, border, iconColor } = VARIANT_STYLES[variant] || VARIANT_STYLES.info;

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm transition-all duration-200 ${border}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">{message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}