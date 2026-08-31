import { create } from 'zustand';
import { storageAdapter } from '@ecomerece/frontend/storage';

interface ThemeState {
    darkMode: boolean;
    isLoading: boolean;
    toggleTheme: () => void;
    setDarkMode: (mode: boolean) => void;
    loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    darkMode: false,
    isLoading: true,

    toggleTheme: () => {
        const newMode = !get().darkMode;
        set({ darkMode: newMode });
        // Persist
        if (typeof window !== 'undefined') {
            storageAdapter.setItem('theme', newMode);
        }

    },

    setDarkMode: (mode: boolean) => {
        set({ darkMode: mode });
        if (typeof window !== 'undefined') {
            storageAdapter.setItem('theme', mode);
        }

    },

    loadTheme: async () => {
        try {
            const stored = await storageAdapter.getItem<boolean>('theme');
            const mode = stored ?? false;
            set({ darkMode: mode, isLoading: false });

        } catch {
            set({ isLoading: false });
        }
    },
}));

// Auto‑load on import (runs once)
if (typeof window !== 'undefined') {
    useThemeStore.getState().loadTheme();
}