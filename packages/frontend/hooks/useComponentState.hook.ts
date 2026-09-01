'use client'
import { useState, useCallback } from 'react';

export interface ComponentState {
    isLoading: boolean;
    error: string | null;
    success: string | null;
    confirmation: {
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm?: () => void | Promise<void>;
        onCancel?: () => void;
    };
}

export const useComponentState = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: undefined as (() => void | Promise<void>) | undefined,
        onCancel: undefined as (() => void) | undefined,
    });

    const setLoading = useCallback((loading: boolean) => {
        setIsLoading(loading);
    }, []);

    const showConfirmation = useCallback(
        (params: {
            title: string;
            message: string;
            onConfirm?: () => void | Promise<void>;
            onCancel?: () => void;
        }) => {
            setConfirmation({
                isOpen: true,
                title: params.title,
                message: params.message,
                onConfirm: params.onConfirm,
                onCancel: params.onCancel,
            });
        },
        [],
    );

    const closeConfirmation = useCallback(() => {
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const reset = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setSuccess(null);
        setConfirmation({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: undefined,
            onCancel: undefined,
        });
    }, []);

    const withLoading = useCallback(
        async <T>(fn: () => Promise<T>): Promise<T> => {
            setLoading(true);
            setError(null);
            try {
                const result = await fn();
                return result;
            } catch (err: any) {
                setError(err.message || 'An error occurred');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [setLoading],
    );

    return {
        isLoading,
        error,
        success,
        confirmation,
        setLoading,
        setError,
        setSuccess,
        showConfirmation,
        closeConfirmation,
        reset,
        withLoading,
    };
};