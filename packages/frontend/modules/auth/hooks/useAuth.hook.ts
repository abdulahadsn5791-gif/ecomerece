import { useEffect } from 'react';
import { authAdapter } from '@ecomerece/frontend/auth';
import { createServiceContainerHook } from '../../../hooks/createServiceContainerHook.hook';
import { AuthService } from '../services/auth.service';
import type { ContainerState } from '../../../models/base.model';
import type { reasonType, UserResponseReadModel } from '@ecomerece/shared';


const useAuthContainer = createServiceContainerHook<AuthService>(
  AuthService,
  authAdapter,
);

type AuthUser = UserResponseReadModel;

interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
  confirmation: ContainerState<AuthUser>['confirmation'];
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  submitSignUp: () => Promise<void>;
  deleteAccount: (reason: reasonType) => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
  isSignedIn: () => Promise<boolean>;
}



export function useAuth(autoSync = false): UseAuthReturn {
  const [state, service] = useAuthContainer<AuthUser>('userProfile');

  useEffect(() => {
    if (autoSync) {


      void service.syncUser();

    }
  }, [service]);

  return {
    user: state.data,
    isLoading: state.isLoading,
    isSubmitting: state.isSubmitting,
    error: state.error,
    success: state.success,
    confirmation: state.confirmation,
    signInWithGoogle: () => service.signInWithGoogle(),
    signOut: () => service.signOut(),
    submitSignUp: () => service.submitSignUp(),
    deleteAccount: (reason) => service.deleteAccount(reason),
    refresh: () => service.syncUser(),
    isSignedIn: () => service.isSignedIn(),
  };
}