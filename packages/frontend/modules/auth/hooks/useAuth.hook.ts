import { useAuthStore } from '../store/auth.store';
import { useAuthService } from '../services/auth.service';
import { useEffect } from 'react';

export const useAuth = () => {
    const state = useAuthStore();
    const service = useAuthService();

    useEffect(() => {
        service.loadUser();
    }, []);

    const handleSignIn = async () => {
        await service.signInWithGoogle();
        service.loadUser();
    };

    const handleSignOut = async () => {
        await service.signOut();
    };

    return {
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        signInWithGoogle: handleSignIn,
        signOut: handleSignOut,
        loadUser: service.loadUser,
        isSignedIn: service.isSignedIn,
    };
};