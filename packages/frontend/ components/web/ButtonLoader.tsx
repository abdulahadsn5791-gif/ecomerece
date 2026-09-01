// components/ButtonLoader.tsx
'use client';

import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: ReactNode;
}

export function ButtonLoader({
    isLoading = false,
    disabled,
    children,
    className = '',
    ...rest
}: ButtonLoaderProps) {
    return (
        <button
            {...rest}
            disabled={isLoading || disabled}
            aria-busy={isLoading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500 active:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`}
        >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}