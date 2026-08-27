export interface ServiceMeta {
    total?: number;
    page?: number;
    limit?: number;
}

export interface ServiceState<T> {
    data: T | null;
    meta: ServiceMeta | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
    success: string | null;
    confirmation: {
        isOpen: boolean;
        title?: string;
        message?: string;
        onConfirm?: () => void | Promise<void>;
        onCancel?: () => void;
    };
    pendingAction: (() => Promise<void>) | null;
    hydrated: boolean;   // ← new flag
}

export type ServiceStateUpdate<T> = Partial<ServiceState<T>>;