import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, Info, CheckCircle2, HelpCircle, AlertCircle } from 'lucide-react';
import { parseModalError, ParsedFieldError, useThemeStore } from '@ecomerece/frontend';

// ─── Variant Config ───────────────────────────────────────────────────────────

export type ModalVariant = 'danger' | 'warning' | 'info' | 'success' | 'confirm';

interface VariantStyle {
    icon: React.ElementType;
    lightIconBg: string;
    lightIconText: string;
    darkIconBg: string;
    darkIconText: string;
    confirmBtn: string;
}

const VARIANT_STYLES: Record<ModalVariant, VariantStyle> = {
    danger: {
        icon: AlertTriangle,
        lightIconBg: 'bg-red-100',
        lightIconText: 'text-red-600',
        darkIconBg: 'bg-red-900/30',
        darkIconText: 'text-red-400',
        confirmBtn: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
    },
    warning: {
        icon: AlertCircle,
        lightIconBg: 'bg-amber-100',
        lightIconText: 'text-amber-600',
        darkIconBg: 'bg-amber-900/30',
        darkIconText: 'text-amber-400',
        confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    },
    info: {
        icon: Info,
        lightIconBg: 'bg-blue-100',
        lightIconText: 'text-blue-600',
        darkIconBg: 'bg-blue-900/30',
        darkIconText: 'text-blue-400',
        confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500',
    },
    success: {
        icon: CheckCircle2,
        lightIconBg: 'bg-emerald-100',
        lightIconText: 'text-emerald-600',
        darkIconBg: 'bg-emerald-900/30',
        darkIconText: 'text-emerald-400',
        confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
    },
    confirm: {
        icon: HelpCircle,
        lightIconBg: 'bg-violet-100',
        lightIconText: 'text-violet-600',
        darkIconBg: 'bg-violet-900/30',
        darkIconText: 'text-violet-400',
        confirmBtn: 'bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500',
    },
};

// ─── Error banner styles ──────────────────────────────────────────────────────

const ERROR_STYLES = {
    light: 'bg-red-50/80 border-red-200/80 text-red-700',
    dark: 'bg-red-950/40 border-red-800/60 text-red-300',
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GenericConfirmModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: React.ReactNode;
    /** Controls icon and confirm button color. Defaults to "danger". */
    variant?: ModalVariant;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    error?: string | unknown | null;
    defaultPayload?: Partial<T>;
    onConfirm: (payload: T) => void;

    renderFields?: (
        payload: Partial<T>,
        updatePayload: (updates: Partial<T>) => void
    ) => React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GenericConfirmModal<T = Record<string, unknown>>({
    isOpen,
    onClose,
    title,
    message,
    variant = 'danger',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    error,
    defaultPayload = {},
    onConfirm,
    renderFields,
}: GenericConfirmModalProps<T>) {
    const [localPayload, setLocalPayload] = useState<Partial<T>>(defaultPayload);
    const prevIsOpenRef = useRef(false);
    const { darkMode } = useThemeStore();

    // Reset local payload state when opening
    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current) {
            setLocalPayload(defaultPayload);
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, defaultPayload]);

    // Keyboard support: Escape key closes modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isLoading, onClose]);

    // Prevent background scrolling while modal is active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleUpdate = (updates: Partial<T>) => {
        setLocalPayload((prev) => ({ ...prev, ...updates }));
    };

    const handleConfirm = () => {
        onConfirm(localPayload as T);
    };

    const parsedErrors: ParsedFieldError[] = parseModalError(error);
    const vs = VARIANT_STYLES[variant];
    const Icon = vs.icon;

    const iconWrapperCls = darkMode
        ? `${vs.darkIconBg} ${vs.darkIconText}`
        : `${vs.lightIconBg} ${vs.lightIconText}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={isLoading ? undefined : onClose}
                    />

                    {/* Modal Card */}
                    <motion.div
                        className={`relative z-10 w-full max-w-md p-6 rounded-3xl shadow-2xl border transition-colors ${darkMode
                                ? 'bg-neutral-900 border-neutral-800 text-white'
                                : 'bg-white border-neutral-100 text-neutral-900'
                            }`}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconWrapperCls}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                aria-label="Close modal"
                                className={`p-2 rounded-full transition-colors disabled:opacity-50 ${darkMode
                                        ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                                        : 'hover:bg-neutral-100 text-neutral-500 hover:text-black'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Title & Message */}
                        <h3 id="modal-title" className="text-xl font-bold mb-2">
                            {title}
                        </h3>
                        <div
                            id="modal-description"
                            className={`text-sm leading-relaxed ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
                        >
                            {message}
                        </div>

                        {/* Custom Form Fields */}
                        {renderFields && (
                            <div className="my-4">
                                {renderFields(localPayload, handleUpdate)}
                            </div>
                        )}

                        {/* Error Banner */}
                        <AnimatePresence>
                            {parsedErrors.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${darkMode ? ERROR_STYLES.dark : ERROR_STYLES.light
                                        }`}
                                    role="alert"
                                >
                                    {parsedErrors.map((err, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs font-medium">
                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                            <div className="flex flex-wrap items-center gap-1.5 leading-normal">
                                                {err.field && (
                                                    <span
                                                        className={`font-mono text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${darkMode
                                                                ? 'bg-red-900/60 border-red-700 text-red-200'
                                                                : 'bg-red-100 border-red-300 text-red-800'
                                                            }`}
                                                    >
                                                        {err.field}
                                                    </span>
                                                )}
                                                <span>{err.message}</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${darkMode
                                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                                    }`}
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${vs.confirmBtn}`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}