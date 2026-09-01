export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<T = unknown> {
    success?: boolean;
    data?: T | { data?: T; updatedData?: T; message?: string };
    error?: { code?: string; message: string };
    message?: string;
}

export interface ContainerState<T = unknown> {
    data: T | null;
    meta: Record<string, unknown> | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
    hydrated: boolean;
}

export interface ContainerConfig {
    autoError?: boolean;
    autoSuccess?: boolean;
    autoPersist?: boolean;
}

export interface ServiceStoreState {
    containers: Record<string, ContainerState<unknown>>;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

export interface ConfirmationState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
}