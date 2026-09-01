// components/ConfirmationDialog.tsx
'use client';

import { useGlobalUIStore } from "../../stores";
import { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';

export function ConfirmationDialog() {
    const { confirmation, closeConfirmation } = useGlobalUIStore();
    const [isProcessing, setIsProcessing] = useState(false);

    if (!confirmation.isOpen) return null;

    const handleConfirm = async () => {
        if (!confirmation.onConfirm) {
            closeConfirmation();
            return;
        }

        setIsProcessing(true);
        try {
            await confirmation.onConfirm();
            closeConfirmation();
        } catch (error) {
            console.error('Confirmation action failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        if (confirmation.onCancel) confirmation.onCancel();
        closeConfirmation();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isProcessing ? handleCancel : undefined}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800">
                <div className="flex items-start gap-4">
                    {confirmation.isDestructive && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {confirmation.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            {confirmation.message}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isProcessing}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        {confirmation.cancelText || 'Cancel'}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${confirmation.isDestructive
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20'
                            }`}
                    >
                        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isProcessing ? 'Processing...' : confirmation.confirmText || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}