import React from 'react';
import { useThemeStore } from '@ecomerece/frontend';

export default function AddressSkeleton() {
    const { darkMode } = useThemeStore();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
                <div
                    key={n}
                    className={`border rounded-3xl p-6 shadow-sm animate-pulse ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
                        }`}
                >
                    <div className={`h-5 w-24 rounded-full mb-4 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <div className={`h-10 w-full rounded-xl mb-4 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                    <div className={`h-4 w-32 rounded-md ${darkMode ? 'bg-neutral-800' : 'bg-neutral-200'}`} />
                </div>
            ))}
        </div>
    );
}