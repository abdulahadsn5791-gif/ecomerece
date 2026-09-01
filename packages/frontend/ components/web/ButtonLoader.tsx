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
            className={`inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {children}
        </button>
    );
}