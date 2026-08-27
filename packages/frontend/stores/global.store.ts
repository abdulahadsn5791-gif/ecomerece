import { create } from 'zustand';

export interface GlobalUIState {
    // Global loading (stacked)
    isLoading: boolean;
    loadingCount: number;

    // Global feedback
    error: string | null;
    success: string | null;

    // Global confirmation modal
    confirmation: {
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void | Promise<void>;
        onCancel?: () => void;
    };

    // Actions
    showLoading: () => void;
    hideLoading: () => void;
    setError: (error: string | null) => void;
    setSuccess: (success: string | null) => void;
    showConfirmation: (params: {
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void | Promise<void>;
        onCancel?: () => void;
    }) => void;
    closeConfirmation: () => void;
    reset: () => void;
}

export const useGlobalUIStore = create<GlobalUIState>((set, get) => ({
    isLoading: false,
    loadingCount: 0,
    error: null,
    success: null,
    confirmation: {
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        onConfirm: undefined,
        onCancel: undefined,
    },

    showLoading: () => {
        set((state) => ({
            loadingCount: state.loadingCount + 1,
            isLoading: true,
        }));
    },

    hideLoading: () => {
        set((state) => {
            const newCount = Math.max(0, state.loadingCount - 1);
            return {
                loadingCount: newCount,
                isLoading: newCount > 0,
            };
        });
    },

    setError: (error) => set({ error, success: null }),

    setSuccess: (success) => set({ success, error: null }),

    showConfirmation: (params) => {
        set({
            confirmation: {
                isOpen: true,
                title: params.title,
                message: params.message,
                confirmText: params.confirmText || 'Confirm',
                cancelText: params.cancelText || 'Cancel',
                onConfirm: params.onConfirm,
                onCancel: params.onCancel,
            },
        });
    },

    closeConfirmation: () => {
        set({
            confirmation: {
                isOpen: false,
                title: '',
                message: '',
                confirmText: 'Confirm',
                cancelText: 'Cancel',
                onConfirm: undefined,
                onCancel: undefined,
            },
        });
    },

    reset: () => {
        set({
            isLoading: false,
            loadingCount: 0,
            error: null,
            success: null,
            confirmation: {
                isOpen: false,
                title: '',
                message: '',
                confirmText: 'Confirm',
                cancelText: 'Cancel',
                onConfirm: undefined,
                onCancel: undefined,
            },
        });
    },
}));