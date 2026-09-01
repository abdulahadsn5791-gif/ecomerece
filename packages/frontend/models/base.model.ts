export interface ServiceMeta {
    [key: string]: any;
}

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

export interface ContainerState<T = any> {
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

export interface ContainerConfig {
    autoError?: boolean;
    autoSuccess?: boolean;
    autoPersist?: boolean;
}

export interface ServiceStoreState {
    containers: Record<string, ContainerState<any>>;
}