import { create } from 'zustand';
import type { AppNotification, ConfirmationState } from '../models/base.model';

export interface GlobalUIState {
    // Global Spinner State
    loadingCount: number;
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;

    // Toast Notification System
    notifications: AppNotification[];
    notify: (notification: Omit<AppNotification, 'id'>) => void;
    showError: (message: string, duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;

    // Global Modal Confirmation
    confirmation: ConfirmationState;
    showConfirmation: (params: Omit<ConfirmationState, 'isOpen'>) => void;
    closeConfirmation: () => void;

    reset: () => void;
}

const DEFAULT_CONFIRMATION: ConfirmationState = {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDestructive: false,
};

const notificationTimers = new Map<string, ReturnType<typeof setTimeout>>();

export const useGlobalUIStore = create<GlobalUIState>((set, get) => ({
    loadingCount: 0,
    isLoading: false,
    notifications: [],
    confirmation: DEFAULT_CONFIRMATION,

    showLoading: () =>
        set((state) => ({
            loadingCount: state.loadingCount + 1,
            isLoading: true,
        })),

    hideLoading: () =>
        set((state) => {
            const newCount = Math.max(0, state.loadingCount - 1);
            return {
                loadingCount: newCount,
                isLoading: newCount > 0,
            };
        }),

    notify: (notification) => {
        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 9);

        const newNotification: AppNotification = { ...notification, id };

        set((state) => ({ notifications: [...state.notifications, newNotification] }));

        const duration = notification.duration ?? 5000;
        if (duration > 0) {
            const timer = setTimeout(() => {
                get().removeNotification(id);
            }, duration);
            notificationTimers.set(id, timer);
        }
    },

    showError: (message, duration = 6000) => get().notify({ type: 'error', message, duration }),
    showSuccess: (message, duration = 4000) => get().notify({ type: 'success', message, duration }),
    showWarning: (message, duration = 5000) => get().notify({ type: 'warning', message, duration }),
    showInfo: (message, duration = 4000) => get().notify({ type: 'info', message, duration }),

    removeNotification: (id) => {
        if (notificationTimers.has(id)) {
            clearTimeout(notificationTimers.get(id)!);
            notificationTimers.delete(id);
        }
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },

    clearNotifications: () => {
        notificationTimers.forEach((timer) => clearTimeout(timer));
        notificationTimers.clear();
        set({ notifications: [] });
    },

    showConfirmation: (params) =>
        set({
            confirmation: {
                ...DEFAULT_CONFIRMATION,
                ...params,
                isOpen: true,
            },
        }),

    closeConfirmation: () =>
        set((state) => ({
            confirmation: { ...state.confirmation, isOpen: false },
        })),

    reset: () => {
        get().clearNotifications();
        set({
            loadingCount: 0,
            isLoading: false,
            confirmation: DEFAULT_CONFIRMATION,
        });
    },
}));