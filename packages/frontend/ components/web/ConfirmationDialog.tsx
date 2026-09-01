'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useGlobalUI } from '../../hooks/useGlobalUI.hook';

export function ConfirmationDialog() {
    const { confirmation, closeConfirmation } = useGlobalUI();
    const [isConfirming, setIsConfirming] = useState(false);

    if (!confirmation.isOpen) return null;

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await confirmation.onConfirm?.();
        } finally {
            setIsConfirming(false);
            closeConfirmation();
        }
    };

    const handleCancel = () => {
        confirmation.onCancel?.();
        closeConfirmation();
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {confirmation.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {confirmation.message}
                </p>
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isConfirming}
                        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        {confirmation.cancelText || 'Cancel'}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-60"
                    >
                        {isConfirming && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        {confirmation.confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}