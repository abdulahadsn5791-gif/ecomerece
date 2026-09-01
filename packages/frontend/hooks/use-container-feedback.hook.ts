'use client'
import { useEffect, useRef } from 'react';
import { useGlobalUIStore } from '../stores/global.store';

export function useContainerFeedback(error: string | null, success: string | null): void {
    const notify = useGlobalUIStore((s) => s.notify);
    const prevError = useRef<string | null>(null);
    const prevSuccess = useRef<string | null>(null);

    useEffect(() => {
        if (error && error !== prevError.current) {
            notify({ type: 'error', message: error, duration: 6000 });
        }
        prevError.current = error;
    }, [error, notify]);

    useEffect(() => {
        if (success && success !== prevSuccess.current) {
            notify({ type: 'success', message: success, duration: 4000 });
        }
        prevSuccess.current = success;
    }, [success, notify]);
}