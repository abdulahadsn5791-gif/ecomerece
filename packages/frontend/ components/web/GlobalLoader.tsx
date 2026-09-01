'use client';

import { Loader2 } from 'lucide-react';
import { useGlobalUI } from '../../hooks/useGlobalUI.hook';
import { useEffect, useState } from 'react';

// This reads the GLOBAL store's isLoading — the one you toggle explicitly
// with showLoading()/hideLoading() (e.g. around a full page navigation or
// an initial app boot check). It is NOT wired to any container's
// isLoading automatically, on purpose: if it were, a small background
// fetch in one corner of the page would throw a full-screen overlay over
// everything else. For per-request loading, use the container's own
// isLoading with a local Skeleton/InlineSpinner instead.
export function GlobalLoader() {
    const { isLoading } = useGlobalUI();

    if (!isLoading) return null;



    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-950/60">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500 dark:text-slate-400" />
        </div>
    );
}