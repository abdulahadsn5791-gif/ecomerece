'use client';

import { useThemeStore } from '@ecomerece/frontend';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const darkMode = useThemeStore((s) => s.darkMode);
    const initTheme = useThemeStore((s) => s.initTheme);

    useEffect(() => {
        if (initTheme) {
            initTheme();
        }
    }, [initTheme]);

    useEffect(() => {
        // Check what value is actually coming from the store
        console.log("ThemeProvider - darkMode value:", darkMode);

        const root = document.documentElement;
        if (darkMode) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        console.log("Current HTML classes:", root.className);
    }, [darkMode]);

    return <>{children}</>;
}