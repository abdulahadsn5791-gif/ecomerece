import { createStore, type StoreApi } from 'zustand/vanilla';
import { QueryClient } from '@tanstack/react-query';
import type {
    ContainerState,
    ContainerConfig,
    ServiceStoreState,
} from '../models/base.model';
import { ServiceContainer } from './service-container';
import { storageAdapter } from '@ecomerece/frontend/storage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: { code?: string; message: string };
    message?: string;
}

export abstract class BaseService {
    protected store: StoreApi<ServiceStoreState>;
    protected queryClient: QueryClient;
    private containers = new Map<string, ServiceContainer<any>>();
    private containerSequences = new Map<string, number>();
    private persistTimers = new Map<string, ReturnType<typeof setTimeout>>();
    private readonly activeControllers = new Set<AbortController>();
    private disposed = false;

    constructor(protected storageKey?: string) {
        this.store = createStore<ServiceStoreState>(() => ({ containers: {} }));
        this.queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 5 * 60 * 1000,
                    retry: 1,
                    refetchOnWindowFocus: false,
                },
            },
        });
    }

    // ------------------------------------------------------------
    // Container management
    // ------------------------------------------------------------
    protected getContainer<T>(
        key: string,
        config?: ContainerConfig & { autoPersist?: boolean },
    ): ServiceContainer<T> {
        if (!this.containers.has(key)) {
            const container = new ServiceContainer<T>(this.store, key, {
                autoError: config?.autoError ?? true,
                autoSuccess: config?.autoSuccess ?? true,
                autoPersist: config?.autoPersist ?? false,
            });
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

    public async hydrateContainer(key: string): Promise<void> {
        if (this.disposed) return;
        const container = this.getContainer(key);
        if (container.getState().hydrated) return;

        try {
            await storageAdapter.ensureReady();
            const stored = await storageAdapter.getItem<{ data: any; meta?: any }>(
                `${this.storageKey}:${key}`,
            );
            if (stored) {
                container.setData(stored.data, stored.meta);
            }
            container.setState({ hydrated: true });
        } catch (err) {
            console.warn(`[${this.storageKey}:${key}] hydration failed:`, err);
        }
    }

    public async saveContainerNow(key: string): Promise<void> {
        if (this.disposed) return;
        const container = this.getContainer(key);
        const state = container.getState();
        try {
            await storageAdapter.ensureReady();
            await storageAdapter.setItem(`${this.storageKey}:${key}`, {
                data: state.data,
                meta: state.meta,
            });
        } catch (err) {
            console.warn(`[${this.storageKey}:${key}] save failed:`, err);
        }
    }

    private schedulePersist(key: string) {
        if (this.persistTimers.has(key)) {
            clearTimeout(this.persistTimers.get(key)!);
        }
        const timer = setTimeout(() => {
            this.persistTimers.delete(key);
            void this.saveContainerNow(key);
        }, 300);
        this.persistTimers.set(key, timer);
    }

    public async clearContainerStorage(key: string): Promise<void> {
        if (this.disposed) return;
        try {
            await storageAdapter.ensureReady();
            await storageAdapter.removeItem(`${this.storageKey}:${key}`);
        } catch (err) {
            console.warn(`[${this.storageKey}:${key}] clear storage failed:`, err);
        }
    }

    public destroyContainer(key: string): void {
        if (this.disposed) return;
        if (this.persistTimers.has(key)) {
            clearTimeout(this.persistTimers.get(key)!);
            this.persistTimers.delete(key);
        }
        this.containerSequences.delete(key);
        this.containers.delete(key);
        this.store.setState((state) => {
            const containers = { ...state.containers };
            delete containers[key];
            return { containers };
        });
    }

    // ------------------------------------------------------------
    // HTTP Request
    // ------------------------------------------------------------
    protected async request<T>(
        method: HttpMethod,
        url: string,
        containerKey: string,
        body?: unknown,
        options?: RequestInit,
        configOverride?: Partial<ContainerConfig>,
    ): Promise<T> {
        if (this.disposed) throw new Error('Service has been disposed');

        const controller = new AbortController();
        this.activeControllers.add(controller);

        const currentSeq = (this.containerSequences.get(containerKey) ?? 0) + 1;
        this.containerSequences.set(containerKey, currentSeq);

        const container = this.getContainer<T>(containerKey, configOverride);
        const isMutation = method !== 'GET';

        // FIX 1: clear stale error/success explicitly when a NEW attempt
        // starts. This is now the only place feedback gets reset — the
        // busy-flag setters below no longer touch it.
        container.clearFeedback();
        if (isMutation) container.setSubmitting(true);
        else container.setLoading(true);

        try {
            if (method === 'GET') {
                const data = await this.queryClient.fetchQuery<T>({
                    queryKey: [containerKey, url],
                    queryFn: async ({ signal }) => {
                        const res = await fetch(url, {
                            ...options,
                            method,
                            signal: controller.signal || signal,
                            headers: options?.headers,
                        });
                        const json = await res.json().catch(() => ({}));
                        if (!res.ok || json.success === false) {
                            const errorMessage =
                                json?.error?.message ||
                                json?.message ||
                                `Request failed with status ${res.status}`;
                            throw new Error(errorMessage);
                        }
                        return json.data as T;
                    },
                });

                if (this.containerSequences.get(containerKey) === currentSeq && !this.disposed) {
                    container.setData(data);
                    if (container.config.autoPersist) this.schedulePersist(containerKey);
                }
                return data;
            } else {
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

                const json = (await res.json().catch(() => ({}))) as ApiResponse;

                if (!res.ok || json.success === false) {
                    const errorMessage =
                        json?.error?.message ||
                        json?.message ||
                        `Request failed with status ${res.status}`;
                    if (container.config.autoError) container.setError(errorMessage);
                    throw new Error(errorMessage);
                }

                let dataToSet: T | undefined;
                let successMessage: string | undefined;

                if (method === 'DELETE') {
                    container.reset();
                    successMessage = json.message;
                } else {
                    const responseData = json.data as {
                        updatedData?: T;
                        data?: T;
                        message?: string;
                    } | undefined;

                    if (responseData?.updatedData !== undefined) {
                        dataToSet = responseData.updatedData;
                    } else if (responseData?.data !== undefined) {
                        dataToSet = responseData.data;
                    } else if (json.data !== undefined) {
                        dataToSet = json.data as T;
                    } else {
                        throw new Error('Invalid API response: unexpected data shape');
                    }
                    successMessage = responseData?.message || json.message;
                }

                if (this.containerSequences.get(containerKey) === currentSeq && !this.disposed) {
                    if (dataToSet !== undefined) {
                        container.setData(dataToSet);
                        if (container.config.autoPersist) this.schedulePersist(containerKey);
                    }
                    if (successMessage && container.config.autoSuccess) {
                        container.setSuccess(successMessage);
                    }
                }

                this.queryClient.invalidateQueries({ queryKey: [containerKey] });

                return (dataToSet !== undefined ? dataToSet : json) as T;
            }
        } catch (error) {
            if (controller.signal.aborted || this.disposed) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Unexpected error';
            if (
                container.config.autoError &&
                this.containerSequences.get(containerKey) === currentSeq
            ) {
                container.setError(message);
            }
            throw error;
        } finally {
            // FIX 2 (bonus): only clear the busy flag if THIS call is still
            // the latest one for this container key. Without this guard, an
            // older, slower request finishing after a newer one has already
            // started will flip isSubmitting/isLoading back to false while
            // the newer request is still in flight — a real flicker bug on
            // double-clicks or fast repeated calls to the same container.
            const isLatest = this.containerSequences.get(containerKey) === currentSeq;
            if (isLatest) {
                if (isMutation) container.setSubmitting(false);
                else container.setLoading(false);
            }
            this.activeControllers.delete(controller);
        }
    }

    // ------------------------------------------------------------
    // Public wrappers (used by subclasses)
    // ------------------------------------------------------------
    protected async get<T>(containerKey: string, url: string, options?: RequestInit): Promise<T> {
        return this.request<T>('GET', url, containerKey, undefined, options);
    }

    protected async post<T>(containerKey: string, url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>('POST', url, containerKey, body, options);
    }

    protected async put<T>(containerKey: string, url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>('PUT', url, containerKey, body, options);
    }

    protected async patch<T>(containerKey: string, url: string, body?: unknown, options?: RequestInit): Promise<T> {
        return this.request<T>('PATCH', url, containerKey, body, options);
    }

    protected async delete(containerKey: string, url: string, options?: RequestInit): Promise<void> {
        return this.request<void>('DELETE', url, containerKey, undefined, options);
    }

    protected async deleteWithBody(containerKey: string, url: string, body?: unknown, options?: RequestInit): Promise<void> {
        return this.request<void>('DELETE', url, containerKey, body, options);
    }

    public resetContainer(key: string) {
        if (this.disposed) return;
        this.getContainer(key).reset();
    }

    // ------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------
    public dispose(): void {
        this.disposed = true;
        for (const controller of this.activeControllers) controller.abort();
        this.activeControllers.clear();
        for (const timer of this.persistTimers.values()) clearTimeout(timer);
        this.persistTimers.clear();
        this.containers.forEach((container) => container.reset());
        this.containers.clear();
        this.containerSequences.clear();
    }

    public isDisposed(): boolean {
        return this.disposed;
    }

    public getStore(): StoreApi<ServiceStoreState> {
        return this.store;
    }
}