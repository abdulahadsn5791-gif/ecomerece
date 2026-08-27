import { useUser, useClerk } from '@clerk/clerk-expo';
import { AuthAdapter, AuthUser } from './auth-adapter.interface';

export const useAuthAdapter = (): AuthAdapter => {
    const { user, isSignedIn } = useUser();
    const clerk = useClerk();

    const getUser = (): AuthUser | null => {
        if (!user) return null;
        return {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || '',
            imageUrl: user.imageUrl || undefined,
        };
    };

    const signInWithGoogle = async (): Promise<void> => {
        // Use your app's deep link scheme
        await clerk.openSignIn({ redirectUrl: 'myapp://' });
    };

    const signOut = async (): Promise<void> => {
        await clerk.signOut();
    };

    const onAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
        // No-op – Clerk hooks are reactive
        return () => { };
    };

    return {
        getUser,
        isSignedIn: () => !!isSignedIn,
        signInWithGoogle,
        signOut,
        onAuthStateChange,
    };
};