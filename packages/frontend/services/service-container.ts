// services/service-container.ts

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

    setLoading(loading: boolean = true) {
        this.setState({ isLoading: loading, error: null, success: null });
    }

    setSubmitting(submitting: boolean = true) {
        this.setState({ isSubmitting: submitting });
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