import { useAuthAdapter } from '@ecomerece/frontend/auth';
import { setAuthUser, setAuthLoading, setAuthError } from '../store/auth.store';

export const useAuthService = () => {
    const adapter = useAuthAdapter();

    const signInWithGoogle = async (): Promise<void> => {
        setAuthLoading();
        try {
            await adapter.signInWithGoogle();
        } catch (err: any) {
            setAuthError(err.message || 'Failed to sign in');
        }
    };

    const signOut = async (): Promise<void> => {
        setAuthLoading();
        try {
            await adapter.signOut();
            setAuthUser(null);
        } catch (err: any) {
            setAuthError(err.message || 'Failed to sign out');
        }
    };

    const loadUser = (): void => {
        const user = adapter.getUser();
        setAuthUser(user);
    };

    const isSignedIn = (): boolean => {
        return adapter.isSignedIn();
    };

    return {
        signInWithGoogle,
        signOut,
        loadUser,
        isSignedIn,
    };
};