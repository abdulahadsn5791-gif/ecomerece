import { useUser, useClerk } from '@clerk/nextjs';
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
        // Safe guard – TypeScript now knows `window` because of DOM lib
        if (typeof window !== 'undefined') {
            await clerk.openSignIn({ redirectUrl: window.location.origin });
        } else {
            console.warn('Sign-in called on server side – ignoring.');
        }
    };

    const signOut = async (): Promise<void> => {
        await clerk.signOut();
    };

    const onAuthStateChange = (callback: (user: AuthUser | null) => void): (() => void) => {
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