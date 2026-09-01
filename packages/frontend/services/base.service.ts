import { createStore, type StoreApi } from 'zustand/vanilla';
import type { ContainerConfig, ServiceStoreState, HttpMethod, ApiResponse } from '../models/base.model';
import { ServiceContainer } from './service-container';
import { storageAdapter } from '@ecomerece/frontend/storage';

export abstract class BaseService {
    protected store: StoreApi<ServiceStoreState>;
    private containers = new Map<string, ServiceContainer<unknown>>();
    private activeRequests = new Map<string, AbortController>();
    private requestSequences = new Map<string, number>();
    private persistTimers = new Map<string, ReturnType<typeof setTimeout>>();
    private disposed = false;

    constructor(protected storageKey?: string) {
        this.store = createStore<ServiceStoreState>(() => ({ containers: {} }));
    }

    protected getContainer<T>(key: string, config?: ContainerConfig): ServiceContainer<T> {
        if (!this.containers.has(key)) {
            const container = new ServiceContainer<T>(this.store, key, {
                autoError: config?.autoError ?? true,
                autoSuccess: config?.autoSuccess ?? true,
                autoPersist: config?.autoPersist ?? false,
            });
            this.containers.set(key, container as ServiceContainer<unknown>);
            container.reset();
        }
        return this.containers.get(key) as ServiceContainer<T>;
    }

    public async hydrateContainer(key: string): Promise<void> {
        if (this.disposed || !this.storageKey) return;
        const container = this.getContainer(key);
        if (container.getState().hydrated) return;

        try {
            await storageAdapter.ensureReady();
            const stored = await storageAdapter.getItem<{ data: unknown; meta?: Record<string, unknown> }>(
                `${this.storageKey}:${key}`
            );
            if (stored && !this.disposed) {
                container.setData(stored.data, stored.meta);
            }
            container.setState({ hydrated: true });
        } catch (err) {
            console.warn(`[${this.storageKey}:${key}] Hydration error:`, err);
        }
    }

    private schedulePersist(key: string): void {
        if (!this.storageKey) return;
        if (this.persistTimers.has(key)) clearTimeout(this.persistTimers.get(key)!);

        const timer = setTimeout(async () => {
            this.persistTimers.delete(key);
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
                console.warn(`[${this.storageKey}:${key}] Save state failed:`, err);
            }
        }, 300);
        this.persistTimers.set(key, timer);
    }

    protected async request<T>(
        method: HttpMethod,
        url: string,
        containerKey: string,
        body?: unknown,
        options?: RequestInit,
        configOverride?: Partial<ContainerConfig>
    ): Promise<T> {
        if (this.disposed) throw new Error('Service has been disposed');

        // Cancel existing pending request for the same container key
        if (this.activeRequests.has(containerKey)) {
            this.activeRequests.get(containerKey)!.abort();
        }

        const controller = new AbortController();
        this.activeRequests.set(containerKey, controller);

        const seq = (this.requestSequences.get(containerKey) ?? 0) + 1;
        this.requestSequences.set(containerKey, seq);

        const container = this.getContainer<T>(containerKey, configOverride);
        const isMutation = method !== 'GET';

        container.clearFeedback();
        if (isMutation) container.setSubmitting(true);
        else container.setLoading(true);

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

            const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;

            if (!res.ok || json.success === false) {
                throw new Error(json?.error?.message || json?.message || `HTTP ${res.status}`);
            }

            let resultData: T;
            let successMessage: string | undefined;

            if (method === 'DELETE') {
                container.reset();
                resultData = undefined as unknown as T;
                successMessage = json.message;
            } else {
                const responseObj = json.data as { updatedData?: T; data?: T; message?: string } | undefined;
                resultData = (responseObj?.updatedData ?? responseObj?.data ?? json.data ?? json) as T;
                successMessage = responseObj?.message || json.message;
            }

            // Stale Check: Only process state update if this remains the latest request
            if (this.requestSequences.get(containerKey) === seq && !this.disposed) {
                if (method !== 'DELETE') {
                    container.setData(resultData);
                    if (container.config.autoPersist) this.schedulePersist(containerKey);
                }
                if (successMessage && container.config.autoSuccess) {
                    container.setSuccess(successMessage);
                }
            }

            return resultData;
        } catch (err: unknown) {
            if (controller.signal.aborted || this.disposed) throw err;
            const message = err instanceof Error ? err.message : 'Network request failed';

            if (container.config.autoError && this.requestSequences.get(containerKey) === seq) {
                container.setError(message);
            }
            throw err;
        } finally {
            if (this.requestSequences.get(containerKey) === seq && !this.disposed) {
                if (isMutation) container.setSubmitting(false);
                else container.setLoading(false);
            }
            this.activeRequests.delete(containerKey);
        }
    }

    protected get<T>(key: string, url: string, opts?: RequestInit) { return this.request<T>('GET', url, key, undefined, opts); }
    protected post<T>(key: string, url: string, body?: unknown, opts?: RequestInit) { return this.request<T>('POST', url, key, body, opts); }
    protected put<T>(key: string, url: string, body?: unknown, opts?: RequestInit) { return this.request<T>('PUT', url, key, body, opts); }
    protected patch<T>(key: string, url: string, body?: unknown, opts?: RequestInit) { return this.request<T>('PATCH', url, key, body, opts); }
    protected delete(key: string, url: string, opts?: RequestInit) { return this.request<void>('DELETE', url, key, undefined, opts); }

    public dispose(): void {
        this.disposed = true;
        this.activeRequests.forEach((ctrl) => ctrl.abort());
        this.activeRequests.clear();
        this.persistTimers.forEach((timer) => clearTimeout(timer));
        this.persistTimers.clear();
        this.containers.forEach((c) => c.reset());
        this.containers.clear();
    }

    public isDisposed(): boolean { return this.disposed; }
    public getStore(): StoreApi<ServiceStoreState> { return this.store; }
}