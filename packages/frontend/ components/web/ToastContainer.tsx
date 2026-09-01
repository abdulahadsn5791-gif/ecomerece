// components/ToastContainer.tsx
'use client';


import { useEffect } from 'react';
import { Toast, ToastVariant } from './Toast';
import { AppNotification } from '@ecomerece/frontend/models/base.model';
import { useGlobalUIStore } from "../../stores";

export function ToastContainer() {
    const notifications = useGlobalUIStore((state) => state.notifications);
    const removeNotification = useGlobalUIStore((state) => state.removeNotification);

    return (
        <div className="pointer-events-none fixed top-4 right-4 z-50 flex max-w-sm w-full flex-col gap-2 p-4 sm:p-0">
            {notifications.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onRemove={() => removeNotification(toast.id)}
                />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: AppNotification; onRemove: () => void }) {
    useEffect(() => {
        if (toast.duration !== 0) {
            const timer = setTimeout(onRemove, toast.duration || 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, onRemove]);

    const variantMap: Record<string, ToastVariant> = {
        success: 'success',
        error: 'error',
        info: 'info',
        warning: 'warning',
    };

    return (
        <Toast
            variant={variantMap[toast.type] || 'info'}
            message={toast.message}
            onDismiss={onRemove}
        />
    );
}