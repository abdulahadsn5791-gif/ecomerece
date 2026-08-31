import { createStore, type StoreApi } from 'zustand/vanilla';
import type {
    ContainerState,
    ContainerConfig,
    ServiceStoreState,
} from '../models/base.model';
import { ServiceContainer } from './service-container';
import { storageAdapter } from '@ecomerece/frontend/storage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export abstract class BaseService {
    protected store: StoreApi<ServiceStoreState>;
    private containers = new Map<string, ServiceContainer<any>>();
    private requestGeneration = 0;
    private readonly activeControllers = new Set<AbortController>();
    private disposed = false;

    constructor(protected storageKey?: string) {
        this.store = createStore<ServiceStoreState>(() => ({ containers: {} }));
        // NOTE: We do NOT auto‑load from storage here. This would delay
        // the initial render and hurt LCP. Instead, developers must call
        // `hydrateContainer()` explicitly when a container is needed.
    }

    /**
     * Returns (or creates) a ServiceContainer for the given key.
     */
    protected getContainer<T>(
        key: string,
        config?: ContainerConfig,
    ): ServiceContainer<T> {
        if (!this.containers.has(key)) {
            const container = new ServiceContainer<T>(this.store, key, config);
            this.containers.set(key, container);
            this.store.setState((state) => ({
                containers: {
                    ...state.containers,
                    [key]: {
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
                    },
                },
            }));
        }
        return this.containers.get(key) as ServiceContainer<T>;
    }

    /**
     * Lazy hydration: Loads persisted state for a container only when called.
     * This avoids blocking the initial render.
     */
    public async hydrateContainer(key: string): Promise<void> {
        const container = this.getContainer(key);
        if (container.getState().hydrated) return;

        try {
            await storageAdapter.ensureReady();
            const stored = await storageAdapter.getItem<{
                data: any;
                meta?: any;
            }>(`${this.storageKey}:${key}`);
            if (stored) {
                container.setData(stored.data, stored.meta);
            }
        } catch (err) {
            console.warn(`[${this.storageKey}:${key}] hydration failed:`, err);
        } finally {
            container.setState({ hydrated: true });
        }
    }

    /**
     * Core HTTP request method (unchanged from previous).
     */
    protected async request<T>(
        method: HttpMethod,
        url: string,
        containerKey: string,
        body?: unknown,
        options?: RequestInit,
        configOverride?: Partial<ContainerConfig>,
    ): Promise<T> {
        const generation = ++this.requestGeneration;
        const controller = new AbortController();
        this.activeControllers.add(controller);

        const container = this.getContainer<T>(containerKey, {
            autoError: true,
            autoSuccess: true,
            ...configOverride,
        });

        const isMutation = method !== 'GET';

        if (isMutation) {
            container.setSubmitting(true);
        } else {
            container.setLoading(true);
        }

        try {
            const res = await fetch(url, {
                ...options,
                method,
                signal: controller.signal,
                headers: {
                    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
                    ...(options?.headers || {}),
                },
                body: body !== undefined ? JSON.stringify(body) : undefined,
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok || json.success === false) {
                const errorMessage =
                    json?.error?.message ||
                    json?.message ||
                    `Request failed with status ${res.status}`;

                if (container.config.autoError !== false) {
                    container.setError(errorMessage);
                }
                throw new Error(errorMessage);
            }

            let dataToSet: T | undefined;
            let successMessage: string | undefined;

            if (method === 'GET') {
                dataToSet = json.data as T;
                successMessage = json.message;
            } else if (method === 'DELETE') {
                container.reset();
                successMessage = json.message;
            } else {
                if (json.data?.updatedData !== undefined) {
                    dataToSet = json.data.updatedData as T;
                } else if (json.data?.data !== undefined) {
                    dataToSet = json.data.data as T;
                } else if (json.data !== undefined) {
                    dataToSet = json.data as T;
                }
                successMessage = json.data?.message || json.message;
            }

            if (dataToSet !== undefined) {
                container.setData(dataToSet);
            }

            if (successMessage && container.config.autoSuccess !== false) {
                container.setSuccess(successMessage);
            }

            return (dataToSet !== undefined ? dataToSet : json) as T;
        } catch (error) {
            throw error;
        } finally {
            if (isMutation) {
                container.setSubmitting(false);
            } else {
                container.setLoading(false);
            }
            this.activeControllers.delete(controller);
        }
    }

    // Wrappers (unchanged)
    protected async get<T>(
        containerKey: string,
        url: string,
        options?: RequestInit,
    ): Promise<T> {
        return this.request<T>('GET', url, containerKey, undefined, options);
    }

    protected async post<T>(
        containerKey: string,
        url: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<T> {
        return this.request<T>('POST', url, containerKey, body, options);
    }

    protected async put<T>(
        containerKey: string,
        url: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<T> {
        return this.request<T>('PUT', url, containerKey, body, options);
    }

    protected async patch<T>(
        containerKey: string,
        url: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<T> {
        return this.request<T>('PATCH', url, containerKey, body, options);
    }

    protected async delete(
        containerKey: string,
        url: string,
        options?: RequestInit,
    ): Promise<void> {
        return this.request<void>('DELETE', url, containerKey, undefined, options);
    }

    protected async deleteWithBody(
        containerKey: string,
        url: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<void> {
        return this.request<void>('DELETE', url, containerKey, body, options);
    }

    public resetContainer(key: string) {
        this.getContainer(key).reset();
    }

    public dispose(): void {
        this.disposed = true;
        for (const controller of this.activeControllers) {
            controller.abort();
        }
        this.activeControllers.clear();
        this.containers.forEach((container) => container.reset());
        this.containers.clear();
    }

    public getStore(): StoreApi<ServiceStoreState> {
        return this.store;
    }
}