import type { StoreApi } from 'zustand/vanilla';
import type {
    ContainerState,
    ContainerConfig,
    ServiceStoreState,
    ServiceMeta,
} from '../models/base.model';

export class ServiceContainer<T> {
    constructor(
        private store: StoreApi<ServiceStoreState>,
        public readonly key: string,
        public readonly config: ContainerConfig = { autoError: true, autoSuccess: true },
    ) { }

    getState(): ContainerState<T> {
        return this.store.getState().containers[this.key] as ContainerState<T>;
    }

    setState(update: Partial<ContainerState<T>>) {
        this.store.setState((state) => ({
            containers: {
                ...state.containers,
                [this.key]: {
                    ...state.containers[this.key],
                    ...update,
                },
            },
        }));
    }

    // FIX: these used to also reset `error`/`success` to null on every call.
    // That meant the call in `request()`'s `finally` block — which always
    // runs, on success AND failure — wiped out the error/success message
    // you'd just set moments earlier in the same synchronous tick, so the
    // UI never got a chance to see it. These two now ONLY touch their own
    // flag. Clearing feedback is a separate, explicit step (see below).
    setLoading(loading: boolean = true) {
        this.setState({ isLoading: loading });
    }

    setSubmitting(submitting: boolean = true) {
        this.setState({ isSubmitting: submitting });
    }

    // Call this when a NEW attempt starts (not when one ends) if you want
    // to clear any stale error/success from a previous call.
    clearFeedback() {
        this.setState({ error: null, success: null });
    }

    setData(data: T | null, meta?: ServiceMeta | null) {
        this.setState({
            data,
            meta,
            isLoading: false,
            isSubmitting: false,
            error: null,
        });
    }

    setError(error: string | null) {
        this.setState({ error, isLoading: false, isSubmitting: false });
    }

    setSuccess(success: string | null) {
        this.setState({ success, isLoading: false, isSubmitting: false });
    }

    openConfirmation(
        title: string,
        message: string,
        onConfirm?: () => void | Promise<void>,
        onCancel?: () => void,
    ) {
        this.setState({
            confirmation: {
                isOpen: true,
                title,
                message,
                onConfirm,
                onCancel,
            },
        });
    }

    closeConfirmation() {
        this.setState({
            confirmation: {
                isOpen: false,
                title: '',
                message: '',
                onConfirm: undefined,
                onCancel: undefined,
            },
        });
    }

    reset() {
        this.setState({
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
        });
    }
}