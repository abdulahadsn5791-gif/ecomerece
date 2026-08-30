import { useEffect, useMemo } from 'react';
import { useStore } from 'zustand';
import type { StoreApi } from 'zustand/vanilla';
import type { BaseService } from '../services/base.service';
import type { ServiceState } from '../models/base.model';

type StateOf<T> = T extends BaseService<infer U> ? ServiceState<U> : never;

export function createServiceHook<TService extends BaseService<any>, TArgs extends any[]>(
    ServiceClass: new (...args: TArgs) => TService,
    ...factoryArgs: TArgs
) {
    let singleton: TService | null = null;
    let refCount = 0;
    // FIX (bug #4): dispose was happening synchronously in the effect
    // cleanup. In React 18 StrictMode (dev), effects run
    // mount -> cleanup -> mount again *synchronously* on first mount.
    // That cleanup was disposing the singleton and nulling it out, but
    // the component's `service` reference (from useMemo, deps=[]) was
    // never refreshed — so the component kept using a *disposed*
    // instance forever (setState on it silently no-ops), while any
    // later-mounting component would get a brand-new, different
    // singleton. Two components now disagree about state.
    //
    // Deferring disposal by a tick lets an immediate remount cancel it,
    // so a singleton is only ever torn down once nobody is left using it.
    let pendingDisposeTimer: ReturnType<typeof setTimeout> | null = null;

    function getInstance(): TService {
        if (!singleton) {
            singleton = new ServiceClass(...factoryArgs);
        }
        return singleton;
    }

    return function useService<R = StateOf<TService>>(
        selector?: (state: StateOf<TService>) => R,
    ): [R, TService] {
        const service = useMemo(() => getInstance(), []);

        useEffect(() => {
            // A new mount (real or StrictMode's simulated remount) cancels
            // any disposal that was scheduled by the matching cleanup.
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

        const store = service.getStore() as StoreApi<StateOf<TService>>;
        const state = useStore(store, selector ?? ((s) => s as R));

        return [state, service];
    };
}