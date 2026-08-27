import { create, StoreApi, UseBoundStore } from 'zustand';
import { ServiceState, ServiceStateUpdate, ServiceMeta } from '../models/base.model';
import { storageAdapter } from '@ecomerece/frontend/storage';


export abstract class BaseService<T> {
    protected store: UseBoundStore<StoreApi<ServiceState<T>>>;
    protected storageKey: string;
    protected isHydrated: boolean = false;

    constructor(
        initialData: T | null = null,
        initialMeta: ServiceMeta | null = null,
        storageKey: string,
    ) {
        this.storageKey = storageKey;

        this.store = create<ServiceState<T>>(() => ({
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

        this.loadFromStorage();
    }

    // ─── State updaters ──────────────────────────────
    protected setState(update: ServiceStateUpdate<T>, persist: boolean = true) {
        this.store.setState(update);
        if (persist && this.isHydrated) {
            this.persistState();
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
        this.store.setState((state) => ({
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
    protected openConfirmation(title: string, message: string, onConfirm: () => void | Promise<void>, onCancel?: () => void) {
        this.setState({ confirmation: { isOpen: true, title, message, onConfirm, onCancel } }, false);
    }

    protected closeConfirmation() {
        this.setState({ confirmation: { isOpen: false, title: '', message: '', onConfirm: undefined, onCancel: undefined } }, false);
    }

    // ─── Persistence ──────────────────────────────────
    protected async persistState() {
        const state = this.store.getState();
        await storageAdapter.setItem(this.storageKey, { data: state.data, meta: state.meta });
    }

    protected async loadFromStorage() {
        try {
            const stored = await storageAdapter.getItem<{ data: T; meta: ServiceMeta }>(this.storageKey);
            if (stored) {
                this.store.setState({ data: stored.data, meta: stored.meta, hydrated: true });
                this.isHydrated = true;
            } else {
                this.store.setState({ hydrated: true });
                this.isHydrated = true;
            }
        } catch {
            this.store.setState({ hydrated: true });
            this.isHydrated = true;
        }
    }

    public async clearStorage() {
        await storageAdapter.removeItem(this.storageKey);
        this.store.setState({ data: null, meta: null, hydrated: true });
        this.isHydrated = true;
    }

    public async saveState() {
        if (this.isHydrated) {
            await this.persistState();
        }
    }

    // ─── HTTP methods ─────────────────────────────────
    private async _handleResponse<R>(res: Response): Promise<R> {
        if (!res.ok) {
            const errData = (await res.json().catch(() => ({}))) as { message?: string };
            throw new Error(errData.message || 'API error');
        }
        return (await res.json().catch(() => ({}))) as R;
    }

    protected async get(url: string, options?: RequestInit): Promise<T> {
        this.setLoading();
        try {
            const res = await fetch(url, { ...options, method: 'GET' });
            const result = await this._handleResponse<T>(res);
            this.setData(result);
            this.setSuccess('Data loaded successfully');
            return result;
        } catch (err: any) {
            this.setError(err.message);
            throw err;
        }
    }

    protected async post<B = any>(url: string, body: B, options?: RequestInit): Promise<T> {
        this.setSubmitting(true);
        try {
            const res = await fetch(url, {
                ...options,
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
                body: JSON.stringify(body),
            });
            const result = await this._handleResponse<T>(res);
            this.setData(result);
            this.setSuccess('Operation completed successfully');
            return result;
        } catch (err: any) {
            this.setError(err.message);
            throw err;
        } finally {
            this.setSubmitting(false);
        }
    }

    protected async put<B = any>(url: string, body: B, options?: RequestInit): Promise<T> {
        this.setSubmitting(true);
        try {
            const res = await fetch(url, {
                ...options,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
                body: JSON.stringify(body),
            });
            const result = await this._handleResponse<T>(res);
            this.setData(result);
            this.setSuccess('Update successful');
            return result;
        } catch (err: any) {
            this.setError(err.message);
            throw err;
        } finally {
            this.setSubmitting(false);
        }
    }

    protected async delete(url: string, options?: RequestInit): Promise<void> {
        this.setSubmitting(true);
        try {
            const res = await fetch(url, { ...options, method: 'DELETE' });
            await this._handleResponse<void>(res);
            this.resetState();
            this.setSuccess('Deleted successfully');
        } catch (err: any) {
            this.setError(err.message);
            throw err;
        } finally {
            this.setSubmitting(false);
        }
    }

    // ─── Hook ─────────────────────────────────────────
    public useStore() {
        return this.store((state) => state);
    }

    public reset() {
        this.resetState();
    }
}