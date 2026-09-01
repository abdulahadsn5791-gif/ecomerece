import { useEffect, useRef } from 'react';
import { useGlobalUI } from './useGlobalUI.hook';

/**
 * Your architecture has TWO places feedback can live: per-container
 * (ContainerState.error/success, set by BaseService.request) and global
 * (useGlobalUIStore, presumably what your ToastContainer reads from).
 *
 * That split is fine — per-container error is great for inline "this field
 * failed" text right next to the form, and it lets two different requests
 * in two different containers fail independently without clobbering each
 * other. But if you also want a container's error/success to show up as a
 * toast, something has to forward it. That's this hook.
 *
 * Call it in any component that already uses `useContainer()`:
 *
 *   const [{ error, success }, service] = useProductsContainer('list');
 *   useContainerFeedback(error, success);
 *
 * Each message is forwarded exactly once — Zustand will keep reporting the
 * same string on every re-render until something else changes it, and
 * without the ref guard you'd re-toast it on every unrelated re-render.
 */
export function useContainerFeedback(
    error: string | null,
    success: string | null,
) {
    const { setError, setSuccess } = useGlobalUI();
    const lastError = useRef<string | null>(null);
    const lastSuccess = useRef<string | null>(null);

    useEffect(() => {
        if (error && error !== lastError.current) {
            lastError.current = error;
            setError(error);
        }
        if (!error) lastError.current = null;
    }, [error, setError]);

    useEffect(() => {
        if (success && success !== lastSuccess.current) {
            lastSuccess.current = success;
            setSuccess(success);
        }
        if (!success) lastSuccess.current = null;
    }, [success, setSuccess]);
}