import type { StoreApi } from 'zustand/vanilla';
import type { ContainerState, ContainerConfig, ServiceStoreState } from '../models/base.model';

export class ServiceContainer<T> {
    constructor(
        private store: StoreApi<ServiceStoreState>,
        public readonly key: string,
        public readonly config: ContainerConfig = { autoError: true, autoSuccess: true }
    ) { }

    public getState(): ContainerState<T> {
        return (this.store.getState().containers[this.key] as ContainerState<T>) ?? this.getInitialState();
    }

    public getInitialState(): ContainerState<T> {
        return {
            data: null,
            meta: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
            success: null,
            hydrated: false,
        };
    }

    public setState(update: Partial<ContainerState<T>>): void {
        this.store.setState((state) => ({
            containers: {
                ...state.containers,
                [this.key]: {
                    ...(state.containers[this.key] ?? this.getInitialState()),
                    ...update,
                },
            },
        }));
    }

    public setLoading(isLoading: boolean): void {
        this.setState({ isLoading });
    }

    public setSubmitting(isSubmitting: boolean): void {
        this.setState({ isSubmitting });
    }

    public clearFeedback(): void {
        this.setState({ error: null, success: null });
    }

    public setData(data: T | null, meta?: Record<string, unknown> | null): void {
        this.setState({
            data,
            meta: meta ?? null,
            isLoading: false,
            isSubmitting: false,
            error: null,
        });
    }

    public setError(error: string | null): void {
        this.setState({ error, isLoading: false, isSubmitting: false });
    }

    public setSuccess(success: string | null): void {
        this.setState({ success, isLoading: false, isSubmitting: false });
    }

    public reset(): void {
        this.setState(this.getInitialState());
    }
}