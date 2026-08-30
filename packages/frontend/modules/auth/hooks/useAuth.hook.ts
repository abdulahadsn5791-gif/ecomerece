import { useEffect } from 'react';
import { authAdapter } from '@ecomerece/frontend/auth';
import { createServiceHook } from '../../../hooks/createServiceHook.hook';
import { AuthService } from '../services/auth.service';
import type { ServiceState } from '../../../models/base.model';
import type { UserResponseReadModel } from '@ecomerece/shared';

const useAuthService = createServiceHook<AuthService, [typeof authAdapter]>(
  AuthService,
  authAdapter
);

type AuthUser = UserResponseReadModel;

type UseAuthReturn = ServiceState<AuthUser> & {
  user: AuthUser | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  submitSignUp: () => Promise<void>;
  submitLogin: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
  isSignedIn: () => boolean;
};

export function useAuth(): UseAuthReturn {
  const [state, service] = useAuthService();

  useEffect(() => {
    void service.syncUser();
  }, [service]);

  return {
    ...state,
    user: state.data,
    signInWithGoogle: () => service.signInWithGoogle(),
    signOut: () => service.signOut(),
    submitSignUp: () => service.submitSignUp(),
    submitLogin: () => service.submitLogin(),
    refresh: () => service.syncUser(),
    isSignedIn: service.isSignedIn.bind(service),
  };
}