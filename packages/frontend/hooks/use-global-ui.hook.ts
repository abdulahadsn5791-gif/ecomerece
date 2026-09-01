'use client'
import { useGlobalUIStore } from '../stores/global.store';

export const useGlobalUI = () => {
    const store = useGlobalUIStore();

    return {
        isLoading: store.isLoading,
        loadingCount: store.loadingCount,
        notifications: store.notifications,
        confirmation: store.confirmation,

        showError: store.showError,
        showSuccess: store.showSuccess,
        showWarning: store.showWarning,
        showInfo: store.showInfo,
        notify: store.notify,
        removeNotification: store.removeNotification,
        clearNotifications: store.clearNotifications,

        showLoading: store.showLoading,
        hideLoading: store.hideLoading,

        showConfirmation: store.showConfirmation,
        closeConfirmation: store.closeConfirmation,

        reset: store.reset,
    };
};