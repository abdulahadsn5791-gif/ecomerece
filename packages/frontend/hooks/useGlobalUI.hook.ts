import { useGlobalUIStore } from '../stores/global.store';

export const useGlobalUI = () => {
    const state = useGlobalUIStore();

    return {
        // State
        isLoading: state.isLoading,
        error: state.error,
        success: state.success,
        confirmation: state.confirmation,

        // Actions
        showLoading: state.showLoading,
        hideLoading: state.hideLoading,
        setError: state.setError,
        setSuccess: state.setSuccess,
        showConfirmation: state.showConfirmation,
        closeConfirmation: state.closeConfirmation,
        reset: state.reset,
    };
};