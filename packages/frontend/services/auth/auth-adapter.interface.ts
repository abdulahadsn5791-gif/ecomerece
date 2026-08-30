import type { UserResponseReadModel } from '@ecomerece/shared';

export type AuthUser = UserResponseReadModel;

export interface AuthAdapter {
  ensureReady(): Promise<void>;
  isSignedIn(): boolean;
  getClerkUser(): { id: string; email: string; name: string } | null;
  signInWithGoogle(): Promise<void>;
  signOut(): Promise<void>;
  /** Returns the session token, or null if not available. */
  getToken(): Promise<string | null>;
  isTokenValid(): Promise<boolean>;
  isExpired(): Promise<boolean>;
}