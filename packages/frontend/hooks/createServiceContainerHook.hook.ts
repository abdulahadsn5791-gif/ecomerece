import { useEffect, useMemo } from 'react';
import { useStore } from 'zustand';
import type { StoreApi } from 'zustand/vanilla';
import type { BaseService } from '../services/base.service';
import type { ContainerState } from '../models/base.model';

const EMPTY_CONTAINER_STATE: ContainerState<any> = {
    data: null,
    meta: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    success: null,
    confirmation: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: undefined,
        onCancel: undefined,
    },
    pendingAction: null,
    hydrated: false,
};

export function createServiceContainerHook<TService extends BaseService>(
    ServiceClass: new (...args: any[]) => TService,
    ...factoryArgs: any[]
) {
    let singleton: TService | null = null;
    let refCount = 0;
    let pendingDisposeTimer: ReturnType<typeof setTimeout> | null = null;

    function getInstance(): TService {
        if (!singleton) {
            singleton = new ServiceClass(...factoryArgs);
        }
        return singleton;
    }

    return function useContainer<TData = any>(
        containerKey: string,
        selector?: (state: ContainerState<TData>) => any,
    ): [any, TService] {
        const service = useMemo(() => getInstance(), []);

        useEffect(() => {
            if (pendingDisposeTimer) {
                clearTimeout(pendingDisposeTimer);
                pendingDisposeTimer = null;
            }
            refCount += 1;
            return () => {
                refCount -= 1;
                if (refCount <= 0) {
                    pendingDisposeTimer = setTimeout(() => {
                        pendingDisposeTimer = null;
                        if (refCount <= 0) {
                            refCount = 0;
                            service.dispose();
                            if (singleton === service) {
                                singleton = null;
                            }
                        }
                    }, 0);
                }
            };
        }, [service]);

        const store = service.getStore() as StoreApi<any>;

        const containerState = useStore(store, (state) => {
            const container = state.containers[containerKey] ?? EMPTY_CONTAINER_STATE;
            return selector ? selector(container) : container;
        });

        return [containerState, service];
    };
}