'use client'
import { useThemeStore } from '@ecomerece/frontend';
import React, { ReactNode } from 'react'

function BgProvider({ children }: { children: ReactNode }) {
    const { darkMode } = useThemeStore();
    return (
        <div className={`h-fit ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}>
            {children}
        </div>
    )
}

export default BgProvider
