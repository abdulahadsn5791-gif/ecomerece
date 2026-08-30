export interface ServiceMeta {
    [key: string]: unknown;
}

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

export interface ServiceState<T> {
    data: T | null;
    meta: ServiceMeta | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
    confirmation: ConfirmationState;
    pendingAction: string | null;
    hydrated: boolean;
}

export type ServiceStateUpdate<T> =
    | Partial<ServiceState<T>>
    | ((state: ServiceState<T>) => Partial<ServiceState<T>>);

export interface PersistedShape<T> {
    data: T | null;
    meta: ServiceMeta | null;
}