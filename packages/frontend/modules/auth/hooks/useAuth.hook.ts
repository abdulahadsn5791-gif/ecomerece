import { useEffect, useCallback, useMemo } from 'react';
import { authAdapter } from '@ecomerece/frontend/auth';
import { createServiceHook } from '@ecomerece/frontend';
import { AuthService } from '../services/auth.service';
import type { reasonType, UserResponseReadModel } from '@ecomerece/shared';

// Create a hook bound to the global AuthService singleton
const useAuthContainer = createServiceHook<AuthService>(AuthService, authAdapter);

type AuthUser = UserResponseReadModel;

export interface UseAuthReturn {
  // User Profile State
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;

  // Form States
  isLoggingIn: boolean;
  loginError: string | null;
  isSigningUp: boolean;
  signUpError: string | null;
  signUpSuccess: string | null;

  // Actions
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  submitSignUp: () => Promise<void>;
  deleteAccount: (reason: reasonType) => Promise<void>;
  syncUser: (forceRefresh?: boolean) => Promise<AuthUser | null>;
  isSignedIn: () => Promise<boolean>;
}

export function useAuth(autoSync = false): UseAuthReturn {
  // Subscribing to distinct container slices from the shared service store
  const [userState, service] = useAuthContainer<AuthUser>('userProfile');
  const [loginState] = useAuthContainer('loginForm');
  const [signUpState] = useAuthContainer('signUpForm');

  // Auto-sync logic on mount if autoSync flag is enabled
  useEffect(() => {
    if (autoSync) {
      void service.syncUser();
    }
  }, [autoSync, service]);

  // Stable method callbacks to prevent downstream re-render triggers
  const signInWithGoogle = useCallback(() => service.signInWithGoogle(), [service]);
  const signOut = useCallback(() => service.signOut(), [service]);
  const submitSignUp = useCallback(() => service.submitSignUp(), [service]);
  const deleteAccount = useCallback((reason: reasonType) => service.deleteAccount(reason), [service]);
  const syncUser = useCallback((forceRefresh = false) => service.syncUser(forceRefresh), [service]);
  const isSignedIn = useCallback(() => service.isSignedIn(), [service]);

  // Memoize return object reference
  return useMemo(
    () => ({
      // User Profile
      user: userState.data,
      isLoading: userState.isLoading,
      error: userState.error,

      // Login Form State
      isLoggingIn: loginState.isLoading || loginState.isSubmitting,
      loginError: loginState.error,

      // Sign-Up Form State
      isSigningUp: signUpState.isLoading || signUpState.isSubmitting,
      signUpError: signUpState.error,
      signUpSuccess: signUpState.success,

      // Actions
      signInWithGoogle,
      signOut,
      submitSignUp,
      deleteAccount,
      syncUser,
      isSignedIn,
    }),
    [
      userState.data,
      userState.isLoading,
      userState.error,
      loginState.isLoading,
      loginState.isSubmitting,
      loginState.error,
      signUpState.isLoading,
      signUpState.isSubmitting,
      signUpState.error,
      signUpState.success,
      signInWithGoogle,
      signOut,
      submitSignUp,
      deleteAccount,
      syncUser,
      isSignedIn,
    ]
  );
}