export interface AuthUser {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
}

export interface AuthAdapter {
    /** Returns the current user, or null if not signed in */
    getUser(): AuthUser | null;
    /** True if user is signed in */
    isSignedIn(): boolean;
    /** Sign in with Google OAuth – triggers redirect on web, opens browser on native */
    signInWithGoogle(): Promise<void>;
    /** Sign out */
    signOut(): Promise<void>;
    /** Subscribe to auth state changes – returns cleanup function */
    onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}