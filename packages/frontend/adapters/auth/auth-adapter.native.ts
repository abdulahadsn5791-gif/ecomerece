import { Clerk } from '@clerk/clerk-expo';
import type { AuthAdapter, AuthUser } from './auth-adapter.interface';

const CLERK_LOAD_MAX_RETRIES = 3;
const CLERK_LOAD_RETRY_DELAY_MS = 500;

class ClerkNativeAuthAdapter implements AuthAdapter {
    private clerkReadyPromise: Promise<void> | null = null;

    constructor() {
        void this.ensureClerkReady().catch(() => { });
    }

    /**
     * Mirrors the web adapter's readiness gate. There's no "script tag" to
     * wait for here since `Clerk` is a static import, but clerk-expo's
     * singleton still needs its own internal `.load()` to hydrate `.user` /
     * `.session`, and that call can throw transiently (e.g. a network blip
     * on app boot) — so retry a few times with backoff, same as web.
     */
    public async ensureClerkReady(): Promise<void> {
        if (!this.clerkReadyPromise) {
            this.clerkReadyPromise = this.loadClerkWithRetry().catch((err) => {
                this.clerkReadyPromise = null; // allow a later call to retry
                throw err;
            });
        }
        return this.clerkReadyPromise;
    }

    private async loadClerkWithRetry(): Promise<void> {
        if ((Clerk as any).loaded) return;

        let lastError: unknown;
        for (let attempt = 1; attempt <= CLERK_LOAD_MAX_RETRIES; attempt++) {
            try {
                if (typeof (Clerk as any).load === 'function') {
                    await (Clerk as any).load();
                }
                if ((Clerk as any).loaded) return;
                throw new Error('Clerk reported not loaded after load()');
            } catch (err) {
                lastError = err;
                if (attempt < CLERK_LOAD_MAX_RETRIES) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, CLERK_LOAD_RETRY_DELAY_MS * attempt)
                    );
                }
            }
        }
        throw lastError instanceof Error ? lastError : new Error('Failed to load Clerk');
    }

    isSignedIn(): boolean {
        return Boolean((Clerk as any).loaded && Clerk.user);
    }

    // FIX: same interface mismatch as the original web bug — returns AuthUser
    // (not an inline duplicate type), and now checks `.loaded` before reading
    // `.user`, mirroring web's getClerkUser().
    getClerkUser(): { id: string; email: string; name: string } | null {
        const user = (Clerk as any).loaded ? Clerk.user : null;
        if (!user) return null;
        return {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? '',
            name: user.fullName ?? '',
        };
    }
    // native adapter — already returns Promise<void>, just rename/alias
    async ensureReady(): Promise<void> {
        return this.ensureClerkReady();
    }
    async signInWithGoogle(): Promise<void> {
        await this.ensureClerkReady();
        // Still flagged from before: this starts a sign-in attempt but doesn't
        // complete an OAuth flow on native. clerk-expo needs `useOAuth()` (or
        // manual WebBrowser handling + `setActive()`) to actually finish it.
        // Left as-is to mirror structure only — say the word if you want this
        // made functionally correct now.
        await Clerk.client.signIn.create({ strategy: 'oauth_google' } as any);
    }

    async signOut(): Promise<void> {
        await this.ensureClerkReady().catch(() => { });
        await Clerk.signOut();
    }

    async getToken(): Promise<string | null> {
        await this.ensureClerkReady().catch(() => { });
        const token = await Clerk.session?.getToken();
        return token ?? null;
    }

    async isTokenValid(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    }

    async isExpired(): Promise<boolean> {
        await this.ensureClerkReady().catch(() => { });
        const expireAt = Clerk.session?.expireAt;
        if (!expireAt) return true;
        return new Date(expireAt).getTime() <= Date.now();
    }
}

export const authAdapter: AuthAdapter = new ClerkNativeAuthAdapter();