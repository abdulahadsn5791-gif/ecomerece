import type { AuthAdapter, AuthUser } from './auth-adapter.interface';
import { type SupabaseClient } from '@supabase/supabase-js';
import { supabase as defaultSupabase } from '../../services/supabaseClient';

class SupabaseWebAuthAdapter implements AuthAdapter {
    private supabase: SupabaseClient;
    private hasSession: boolean = false;
    private readyPromise: Promise<void>;

    constructor(supabaseClient: SupabaseClient) {
        this.supabase = supabaseClient;

        this.readyPromise = this.supabase.auth.getSession().then(({ data, error }) => {
            if (error) console.error('Supabase session fetch error:', error);
            this.hasSession = Boolean(data.session);
        });

        this.supabase.auth.onAuthStateChange((_event, session) => {
            this.hasSession = Boolean(session);
        });
    }

    public async ensureReady(): Promise<void> {
        await this.readyPromise;
    }

    isSignedIn(): boolean {
        return this.hasSession;
    }

    async getUser(): Promise<Partial<AuthUser> | null> {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        if (error || !user) return null;

        const metadata = user.user_metadata ?? {};
        return {
            id: user.id,
            email: user.email ?? '',
            fullName: metadata.full_name ?? metadata.name ?? '',
        };
    }

    async signInWithGoogle(): Promise<void> {
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/sso-callback`,
            },
        });
        if (error) throw error;
    }

    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    async getToken(): Promise<string | null> {

        const { data: { session }, error } = await this.supabase.auth.getSession();

        if (error || !session) {
            console.warn('[AuthAdapter] No session found. Storage keys:', Object.keys(localStorage));
            return null;
        }

        return session.access_token;
    }

    async isTokenValid(): Promise<boolean> {
        const token = await this.getToken();
        if (!token) return false;
        return !(await this.isExpired());
    }

    async isExpired(): Promise<boolean> {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error || !session) return true;

        const expiresAt = session.expires_at;
        if (!expiresAt) return true;

        return (expiresAt * 1000) <= Date.now();
    }
}

// Pass the shared singleton instance
export const authAdapter: AuthAdapter = new SupabaseWebAuthAdapter(defaultSupabase);