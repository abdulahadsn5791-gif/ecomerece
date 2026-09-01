// Providers.tsx
'use client';

import { ConfirmationDialog, ErrorBoundary, GlobalLoader, ToastContainer } from '@ecomerece/frontend';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary>
            {children}
            <GlobalLoader />
            <ToastContainer />
            <ConfirmationDialog />
        </ErrorBoundary>
    );
}