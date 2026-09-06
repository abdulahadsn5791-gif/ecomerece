'use client'
import { useThemeStore } from '@ecomerece/frontend';
import React, { ReactNode } from 'react'

function BgProvider({ children }: { children: ReactNode }) {
    const { darkMode } = useThemeStore();
    return (
        <div className={`h-screen transition-colors duration-300 ${darkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-white border-neutral-100'
            }`}>
            {children}
        </div>
    )
}

export default BgProvider