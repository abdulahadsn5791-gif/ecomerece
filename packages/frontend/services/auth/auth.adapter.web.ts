import type { AuthAdapter, AuthUser } from './auth-adapter.interface';

interface ClerkGlobal {
  loaded?: boolean;
  load?: (opts?: unknown) => Promise<void>;
  user?: any;
  session?: any;
  client?: any;
  signOut?: (...args: any[]) => Promise<void>;
}

const CLERK_SCRIPT_POLL_MS = 50;
const CLERK_SCRIPT_TIMEOUT_MS = 15_000;
const CLERK_LOAD_MAX_RETRIES = 3;
const CLERK_LOAD_RETRY_DELAY_MS = 500;

class ClerkWebAuthAdapter implements AuthAdapter {
  private clerkReadyPromise: Promise<ClerkGlobal> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      void this.ensureClerkReady().catch(() => { });
    }
  }

  private getClerkGlobal(): ClerkGlobal | null {
    return typeof window !== 'undefined' ? ((window as any).Clerk as ClerkGlobal | undefined) ?? null : null;
  }
  public async ensureReady(): Promise<void> {
    await this.ensureClerkReady();
  }
  /**
   * Resolves once Clerk is fully usable: waits for the script tag to attach
   * `window.Clerk`, then waits for / triggers Clerk's own internal `.load()`
   * so `.user` / `.session` are actually hydrated. Retries `.load()` a few
   * times with a short delay if it throws (e.g. a transient network blip).
   */
  public async ensureClerkReady(): Promise<ClerkGlobal> {
    if (typeof window === 'undefined') {
      throw new Error('Clerk is not available outside the browser');
    }

    if (!this.clerkReadyPromise) {
      this.clerkReadyPromise = this.loadClerkWithRetry().catch((err) => {
        this.clerkReadyPromise = null; // allow a later call to retry
        throw err;
      });
    }

    return this.clerkReadyPromise;
  }

  private async waitForScriptTag(): Promise<ClerkGlobal> {
    const start = Date.now();
    let clerk = this.getClerkGlobal();
    while (!clerk) {
      if (Date.now() - start > CLERK_SCRIPT_TIMEOUT_MS) {
        throw new Error('Clerk script did not load in time');
      }
      await new Promise((resolve) => setTimeout(resolve, CLERK_SCRIPT_POLL_MS));
      clerk = this.getClerkGlobal();
    }
    return clerk;
  }

  private async loadClerkWithRetry(): Promise<ClerkGlobal> {
    const clerk = await this.waitForScriptTag();
    if (clerk.loaded) return clerk;

    let lastError: unknown;
    for (let attempt = 1; attempt <= CLERK_LOAD_MAX_RETRIES; attempt++) {
      try {
        if (typeof clerk.load === 'function') {
          await clerk.load();
        }
        if (clerk.loaded) return clerk;
        throw new Error('Clerk reported not loaded after load()');
      } catch (err) {
        lastError = err;
        if (attempt < CLERK_LOAD_MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, CLERK_LOAD_RETRY_DELAY_MS * attempt));
        }
      }
    }
    throw lastError instanceof Error ? lastError : new Error('Failed to load Clerk');
  }

  isSignedIn(): boolean {
    const clerk = this.getClerkGlobal();
    return Boolean(clerk?.loaded && clerk.user);
  }

  // FIX: return type is AuthUser (matches the interface exactly), not
  // UserResponseReadModel — that mismatch is what caused all three
  // reported TS errors (missing `name`, object literal rejected, and
  // the class failing to satisfy AuthAdapter).
  getClerkUser(): { id: string; email: string; name: string } | null {
    const clerk = this.getClerkGlobal();
    const user = clerk?.loaded ? clerk.user : null;
    if (!user) return null;
    return {
      id: user.id as string,
      email: user.primaryEmailAddress?.emailAddress ?? '',
      name: user.fullName ?? '',
    };
  }

  async signInWithGoogle(): Promise<void> {
    const clerk = await this.ensureClerkReady();
    await clerk.client.signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  }

  async signOut(): Promise<void> {
    const clerk = await this.ensureClerkReady().catch(() => null);
    await clerk?.signOut?.();
  }

  async getToken(): Promise<string | null> {
    const clerk = await this.ensureClerkReady().catch(() => null);
    const token = await clerk?.session?.getToken();
    return token ?? null;
  }

  async isTokenValid(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  async isExpired(): Promise<boolean> {
    const clerk = await this.ensureClerkReady().catch(() => null);
    const expireAt = clerk?.session?.expireAt;
    if (!expireAt) return true;
    return new Date(expireAt).getTime() <= Date.now();
  }
}

export const authAdapter: AuthAdapter = new ClerkWebAuthAdapter();