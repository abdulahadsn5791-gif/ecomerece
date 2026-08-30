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

export const setAuthLoading = (loading: boolean = true) =>
  useAuthStore.setState({ isLoading: loading, error: null });

export const setAuthUser = (user: AuthUser | null) =>
  useAuthStore.setState({ user, isLoading: false, error: null });

export const setAuthError = (error: string | null) =>
  useAuthStore.setState({ error, isLoading: false });

// If you have a reset function, type the state parameter:
export const resetAuth = () =>
  useAuthStore.setState((state: AuthState) => ({ ...state, user: null, isLoading: false, error: null }));