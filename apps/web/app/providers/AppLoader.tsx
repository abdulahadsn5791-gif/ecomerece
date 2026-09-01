// apps/web/app/components/AppLoader.tsx
'use client';

import { useAuth, useThemeStore,useAppInit } from "@ecomerece/frontend";



export function AppLoader({ children }: { children: React.ReactNode }) {
    const initTheme = useThemeStore((s) => s.initTheme);
    const { syncUser } = useAuth();

    // Pass your package boot tasks into the service hook
    const { isReady, isLoading, error } = useAppInit([
        () => initTheme(),
        () => syncUser(),
    ]);

    if (isLoading || !isReady) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center space-y-3">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
                    <p className="text-sm text-gray-500">Loading your workspace...</p>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}