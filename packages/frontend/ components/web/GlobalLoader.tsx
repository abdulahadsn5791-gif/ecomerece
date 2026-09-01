// components/GlobalLoader.tsx
'use client';

import { useGlobalUIStore } from "../../stores";

export function GlobalLoader() {
    const isLoading = useGlobalUIStore((state) => state.isLoading);

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[10000] h-1 w-full overflow-hidden bg-indigo-100 dark:bg-indigo-950">
            <div className="h-full w-full bg-indigo-600 animate-pulse" />
        </div>
    );
}