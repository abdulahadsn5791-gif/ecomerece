// models/base.model.ts

export interface ServiceMeta {
    [key: string]: unknown;
}

// Confirmation state used both in global UI and service containers
export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}

// State of a single component container inside a service
export interface ContainerState<T> {
    data: T | null;
    meta?: ServiceMeta | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
    confirmation: ConfirmationState;
    // Optional additional flags
    pendingAction?: string | null;
    hydrated?: boolean;
}

// Configuration for automatic handling of error/success in a container
export interface ContainerConfig {
    autoError?: boolean;    // default true
    autoSuccess?: boolean;  // default true
}

// The whole store of a service: a record of named containers
export interface ServiceStoreState {
    containers: Record<string, ContainerState<any>>;
}

// Shape used for persistence (if needed)
export interface PersistedContainerShape<T> {
    data: T | null;
    meta?: ServiceMeta | null;
}