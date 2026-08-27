import { create } from 'zustand';
import { AuthUser } from '../../../services/auth';

export interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
}

export const useAuthStore = create<AuthState>(() => ({
    user: null,
    isLoading: false,
    error: null,
}));

export const setAuthLoading = () =>
    useAuthStore.setState({ isLoading: true, error: null });

export const setAuthUser = (user: AuthUser | null) =>
    useAuthStore.setState({ user, isLoading: false, error: null });

export const setAuthError = (error: string) =>
    useAuthStore.setState({ error, isLoading: false });