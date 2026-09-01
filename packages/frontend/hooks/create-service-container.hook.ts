'use client'
import { useEffect } from 'react';
import { useStore } from 'zustand';
import type { BaseService } from '../services/base.service';
import type { ContainerState } from '../models/base.model';

// 1. Stable static fallback reference (prevents infinite render loops)
const DEFAULT_CONTAINER_STATE: ContainerState<any> = {
    data: null,
    meta: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
    success: null,
    hydrated: false,
};

// 2. Shared Global Service Map (ensures Providers, Main, etc. share the same store)
const globalServiceRegistry = new Map<string, BaseService>();

function getOrCreateService<TService extends BaseService>(
    ServiceClass: new (...args: any[]) => TService,
    factoryArgs: any[]
): TService {
    const key = ServiceClass.name || 'DefaultService';
    let instance = globalServiceRegistry.get(key) as TService;

    if (!instance || instance.isDisposed()) {
        instance = new ServiceClass(...factoryArgs);
        globalServiceRegistry.set(key, instance);
    }
    return instance;
}

export function createServiceHook<TService extends BaseService>(
    ServiceClass: new (...args: any[]) => TService,
    ...factoryArgs: any[]
) {
    return function useServiceContainer<TData = unknown, TSelected = ContainerState<TData>>(
        containerKey: string,
        selector?: (state: ContainerState<TData>) => TSelected
    ): [TSelected, TService] {
        const service = getOrCreateService(ServiceClass, factoryArgs);

        // 3. Client-side hydration check (runs ONLY in browser after SSR)
        useEffect(() => {
            if (typeof window !== 'undefined' && 'hydrate' in service && typeof (service as any).hydrate === 'function') {
                void (service as any).hydrate();
            }
        }, [service]);

        // 4. Subscribe to shared store with stable default fallback
        const state = useStore(service.getStore(), (s) => {
            const raw = (s.containers[containerKey] as ContainerState<TData>) ?? DEFAULT_CONTAINER_STATE;
            return selector ? selector(raw) : (raw as unknown as TSelected);
        });

        return [state, service];
    };
}