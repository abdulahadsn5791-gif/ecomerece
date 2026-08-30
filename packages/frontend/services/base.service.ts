import { createStore, type StoreApi } from 'zustand/vanilla';
import type { ServiceState, ServiceStateUpdate, ServiceMeta, PersistedShape } from '../models/base.model';
import { storageAdapter } from '@ecomerece/frontend/storage';

const PERSIST_DEBOUNCE_MS = 250;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<TData = unknown> {
    success?: boolean | null;
    message?: string;
    data?: TData;
}

export interface RetryOptions<R> {
    maxRetries?: number;
    baseDelayMs?: number;
    /**
     * Upper bound on the exponential backoff delay, in ms.
     * FIX (bug #1): without a cap, a caller passing a large `maxRetries`
     * (e.g. polling for local auth-state hydration) can balloon into
     * minutes of real wall-clock wait time. Default 5000ms.
     */
    maxDelayMs?: number;
    /** Optional: Return true if the result means we should retry (e.g., result is false/null) */
    shouldRetry?: (result: R) => boolean;
}

export abstract class BaseService<T> {
    protected readonly store: StoreApi<ServiceState<T>>;
    protected readonly storageKey: string;
    protected isHydrated = false;

    private persistTimer: ReturnType<typeof setTimeout> | null = null;
    private requestGeneration = 0;
    private readonly activeControllers = new Set<AbortController>();
    private disposed = false;

    constructor(
        initialData: T | null = null,
        initialMeta: ServiceMeta | null = null,
        storageKey: string,
    ) {
        this.storageKey = storageKey;

        this.store = createStore<ServiceState<T>>(() => ({
            data: initialData,
            meta: initialMeta,
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
        }));

        void this.loadFromStorage();
    }

    // ─── State updaters ──────────────────────────────
    protected setState(update: ServiceStateUpdate<T>, persist: boolean = true) {
        if (this.disposed) return;
        this.store.setState(update as Partial<ServiceState<T>>);
        if (persist && this.isHydrated) {
            this.schedulePersist();
        }
    }

    protected setLoading(loading: boolean = true) {
        this.setState({ isLoading: loading, error: null, success: null }, false);
    }

    protected setSubmitting(submitting: boolean = true) {
        this.setState({ isSubmitting: submitting }, false);
    }

    protected setData(data: T, meta?: ServiceMeta) {
        this.setState({ data, meta, isLoading: false, isSubmitting: false, error: null });
    }

    protected setError(error: string) {
        this.setState({ error, isLoading: false, isSubmitting: false }, false);
    }

    protected setSuccess(success: string) {
        this.setState({ success, isLoading: false, isSubmitting: false }, false);
    }

    protected resetState() {
        this.setState((state) => ({
            data: null,
            meta: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
            success: null,
            confirmation: { ...state.confirmation, isOpen: false },
            pendingAction: null,
        }));
    }

    // ─── Confirmation ─────────────────────────────────
    protected openConfirmation(
        title: string,
        message: string,
        onConfirm: () => void | Promise<void>,
        onCancel?: () => void,
    ) {
        this.setState({ confirmation: { isOpen: true, title, message, onConfirm, onCancel } }, false);
    }

    protected closeConfirmation() {
        this.setState(
            { confirmation: { isOpen: false, title: '', message: '', onConfirm: undefined, onCancel: undefined } },
            false,
        );
    }

    public async saveState() {
        if (this.isHydrated) {
            await this.persistState();
        }
    }

    // ─── HTTP ─────────────────────────────────────────
    private async parseResponse(res: Response): Promise<ApiResponse> {
        if (!res.ok) {
            const errData = (await res.json().catch(() => ({}))) as { message?: string };
            throw new Error(errData.message || `Request failed with status ${res.status}`);
        }
        return (await res.json().catch(() => ({}))) as ApiResponse;
    }

    private async request<R = T>(
        method: HttpMethod,
        url: string,
        body?: unknown,
        options?: RequestInit,
    ): Promise<R> {
        const generation = ++this.requestGeneration;
        const controller = new AbortController();
        this.activeControllers.add(controller);

        const isMutation = method !== 'GET';
        if (isMutation) this.setSubmitting(true);
        else this.setLoading();

        try {
            const res = await fetch(url, {
                ...options,
                method,
                signal: controller.signal,
                headers:
                    body !== undefined
                        ? { 'Content-Type': 'application/json', ...(options?.headers || {}) }
                        : options?.headers,
                body: body !== undefined ? JSON.stringify(body) : undefined,
            });

            const rawResult = await this.parseResponse(res);
            const stale = generation !== this.requestGeneration || this.disposed;

            let actualData: T | undefined = undefined;
            let successMessage: string | undefined = undefined;

            if (rawResult.success === false) {
                throw new Error(rawResult.message || 'Operation failed');
            }

            // ─── Extract data based on method ──────────────
            if (method === 'GET') {
                if (rawResult.data !== undefined) {
                    actualData = rawResult.data as T;
                }
                successMessage = rawResult.message || BaseService.successMessage(method);
            } else if (method === 'DELETE') {
                successMessage = rawResult.message || BaseService.successMessage(method);
            } else {
                const inner = rawResult.data as { updatedData?: T; data?: T } | undefined;
                if (inner?.updatedData !== undefined) {
                    actualData = inner.updatedData;
                } else if (inner?.data !== undefined) {
                    actualData = inner.data;
                } else if (rawResult.data !== undefined) {
                    actualData = rawResult.data as T;
                }
                successMessage = rawResult.message || BaseService.successMessage(method);
            }

            // ─── Apply to store ────────────────────────────
            if (!stale) {
                if (method === 'DELETE') {
                    this.resetState();
                } else if (actualData !== undefined) {
                    this.setData(actualData);
                }
                if (successMessage) {
                    this.setSuccess(successMessage);
                }
            }

            if (method === 'DELETE') {
                return rawResult as R;
            }
            return (actualData !== undefined ? actualData : rawResult) as R;
        } catch (err) {
            if (controller.signal.aborted) {
                if (!isMutation) {
                    this.setState({ isLoading: false }, false);
                }
                throw err;
            }
            const message = err instanceof Error ? err.message : 'Unexpected error';
            const stale = generation !== this.requestGeneration || this.disposed;
            if (!stale) this.setError(message);
            throw err;
        } finally {
            this.activeControllers.delete(controller);
            if (isMutation) {
                this.setSubmitting(false);
            } else {
                this.setState({ isLoading: false }, false);
            }
        }
    }

    private static successMessage(method: HttpMethod): string {
        switch (method) {
            case 'GET': return 'Data loaded successfully';
            case 'POST': return 'Created successfully';
            case 'PUT': return 'Updated successfully';
            case 'PATCH': return 'Updated successfully';
            case 'DELETE': return 'Deleted successfully';
        }
    }

    // ─── Public HTTP methods ──────────────────────────
    protected get(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>('GET', url, undefined, options);
    }

    protected post<B = unknown>(url: string, body: B, options?: RequestInit): Promise<T> {
        return this.request<T>('POST', url, body, options);
    }

    protected put<B = unknown>(url: string, body: B, options?: RequestInit): Promise<T> {
        return this.request<T>('PUT', url, body, options);
    }

    protected patch<B = unknown>(url: string, body: B, options?: RequestInit): Promise<T> {
        return this.request<T>('PATCH', url, body, options);
    }

    protected delete(url: string, options?: RequestInit): Promise<void> {
        return this.request<void>('DELETE', url, undefined, options);
    }

    // ─── React bridge ─────────────────────────────────
    public getStore(): StoreApi<ServiceState<T>> {
        return this.store;
    }

    /**
     * Retries `operation` up to `maxRetries` total attempts, with capped
     * exponential backoff between attempts.
     *
     * - If `operation` throws, it's retried (subject to `maxRetries`); the
     *   last error is rethrown once attempts are exhausted.
     * - If `shouldRetry(result)` returns true, the result is treated as a
     *   "not ready yet" signal and retried the same way; the last such
     *   result is returned (not thrown) once attempts are exhausted.
     *
     * FIX (bug #2): generic renamed from `T` to `R` — this method lives
     * inside `class BaseService<T>`, and re-declaring `<T>` here silently
     * shadowed the class's own type parameter.
     *
     * FIX (bug #1): backoff delay is now capped by `maxDelayMs` (default
     * 5000ms) so a caller with a large `maxRetries` (e.g. polling for
     * local auth-state hydration) can't end up waiting minutes.
     *
     * FIX (bug #3): rewritten to avoid using a thrown sentinel Error as
     * internal control flow for the "should retry" path.
     */
    public async executeWithRetry<R>(
        operation: () => Promise<R> | R,
        options: RetryOptions<R> = {},
    ): Promise<R> {
        const { maxRetries = 3, baseDelayMs = 1000, maxDelayMs = 5000, shouldRetry } = options;

        let lastError: unknown;
        let lastResult: R | undefined;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation();
                lastResult = result;

                if (!shouldRetry?.(result)) {
                    return result;
                }
                if (attempt === maxRetries) {
                    return result; // retries exhausted, hand back the last (not-ready) result
                }
                // else: fall through to backoff + retry
            } catch (error) {
                lastError = error;
                if (attempt === maxRetries) {
                    throw error; // retries exhausted, surface the last real error
                }
            }

            const delay = Math.min(baseDelayMs * Math.pow(2, attempt - 1), maxDelayMs);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Unreachable given maxRetries >= 1, but keeps control flow explicit.
        if (lastError !== undefined) throw lastError;
        return lastResult as R;
    }

    public async wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }








    public reset(): void {
        this.resetState();
    }










    // ─── Persistence ──────────────────────────────────
    private schedulePersist() {
        if (this.persistTimer) clearTimeout(this.persistTimer);
        this.persistTimer = setTimeout(() => {
            this.persistTimer = null;
            void this.persistState();
        }, PERSIST_DEBOUNCE_MS);
    }

    protected async persistState() {
        if (this.disposed) return;
        const state = this.store.getState();
        const payload: PersistedShape<T> = { data: state.data, meta: state.meta };
        try {
            // FIX: explicitly await readiness here instead of relying on
            // storageAdapter.setItem() to swallow it internally. If
            // storage is genuinely broken, we now know it's a storage
            // failure — not a mysteriously "successful" no-op write —
            // and can log it distinctly instead of both cases looking
            // the same to callers.
            await storageAdapter.ensureReady();
            await storageAdapter.setItem(this.storageKey, payload);
        } catch (err) {
            // still best-effort: don't throw out of a debounced background
            // persist, just make the failure visible.
            console.warn(`[${this.storageKey}] persistState failed:`, err);
        }
    }

    protected async loadFromStorage() {
        try {
            // FIX: same explicit readiness check. Previously, if storage
            // failed to initialize, getItem() silently returned null and
            // this branch was indistinguishable from "first run, no data
            // saved yet" — both ended in `hydrated: true` with no signal
            // anything was actually wrong.
            await storageAdapter.ensureReady();
            const stored = await storageAdapter.getItem<PersistedShape<T>>(this.storageKey);
            if (this.disposed) return;
            if (stored) {
                this.store.setState({ data: stored.data, meta: stored.meta, hydrated: true });
            } else {
                this.store.setState({ hydrated: true });
            }
        } catch (err) {
            // Storage never became ready (or getItem threw for some other
            // reason). We still mark hydrated: true so persistState() can
            // proceed on future writes (best-effort, matching prior
            // behavior) — but now the cause is logged instead of silent.
            console.warn(`[${this.storageKey}] loadFromStorage failed, continuing without persisted data:`, err);
            if (!this.disposed) this.store.setState({ hydrated: true });
        } finally {
            this.isHydrated = true;
        }
    }

    public async clearStorage() {
        try {
            await storageAdapter.ensureReady();
            await storageAdapter.removeItem(this.storageKey);
        } catch (err) {
            console.warn(`[${this.storageKey}] clearStorage failed:`, err);
        }
        if (this.disposed) return;
        this.store.setState({ data: null, meta: null, hydrated: true });
        this.isHydrated = true;
    }

    public async resetAndClearStorage(): Promise<void> {
        if (this.persistTimer) {
            clearTimeout(this.persistTimer);
            this.persistTimer = null;
        }

        try {
            await storageAdapter.ensureReady();
            await storageAdapter.removeItem(this.storageKey);
        } catch (err) {
            // best-effort, same as clearStorage() — but now visible.
            console.warn(`[${this.storageKey}] resetAndClearStorage failed:`, err);
        }

        if (this.disposed) return;

        this.store.setState((state) => ({
            data: null,
            meta: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
            success: null,
            confirmation: { ...state.confirmation, isOpen: false },
            pendingAction: null,
            hydrated: true,
        }));
        this.isHydrated = true;
    }

    // ─── Lifecycle ────────────────────────────────────
    public dispose(): void {
        const hadPendingPersist = this.persistTimer !== null;
        if (this.persistTimer) {
            clearTimeout(this.persistTimer);
            this.persistTimer = null;
        }
        if (hadPendingPersist) {
            const state = this.store.getState();
            const payload: PersistedShape<T> = { data: state.data, meta: state.meta };
            // FIX: same visibility fix on the final fire-and-forget write.
            void storageAdapter
                .ensureReady()
                .then(() => storageAdapter.setItem(this.storageKey, payload))
                .catch((err) => console.warn(`[${this.storageKey}] dispose() flush failed:`, err));
        }

        this.disposed = true;
        for (const controller of this.activeControllers) controller.abort();
        this.activeControllers.clear();
    }
}