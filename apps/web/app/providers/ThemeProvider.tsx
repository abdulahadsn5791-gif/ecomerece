
'use client'


import { useThemeStore } from '@ecomerece/frontend';
import { useEffect } from 'react';


export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const initTheme = useThemeStore((s) => s.initTheme);

    useEffect(() => {
        void initTheme();
    }, [initTheme]);

    return <>{children}</>;
}