'use client';

import { useEffect, useMemo } from 'react';
import { createServiceHook } from './create-service-container.hook';
import { AppInitService } from '../services/app-init.service';

const useAppContainer = createServiceHook<AppInitService>(AppInitService);

export function useAppInit(bootTasks: Array<() => Promise<any>> = []) {
    const [state, service] = useAppContainer<{ isReady: boolean }>('status');

    useEffect(() => {
        if (!state.data?.isReady && !state.isLoading) {
            void service.bootstrap(bootTasks);
        }
    }, [state.data?.isReady, state.isLoading, service, bootTasks]);

    return useMemo(
        () => ({
            isReady: !!state.data?.isReady,
            isLoading: state.isLoading,
            error: state.error,
        }),
        [state.data?.isReady, state.isLoading, state.error]
    );
}