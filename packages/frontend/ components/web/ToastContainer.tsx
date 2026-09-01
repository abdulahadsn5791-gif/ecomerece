'use client';

import { useEffect } from 'react';
import { useGlobalUI } from '../../hooks/useGlobalUI.hook';
import { Toast } from './Toast';

const AUTO_DISMISS_MS = 4000;

// Reads error/success off the GLOBAL store (useGlobalUI), not any one
// container directly. Anything that wants a container's error/success to
// show up here needs to forward it first — see useContainerFeedback.
//
// Because useGlobalUI's setError/setSuccess each clear the other, at most
// one of these two is ever set at a time, so there's no stacking/queue
// logic needed here. If you outgrow that (want multiple simultaneous
// toasts), swap the single error/success fields in global.store for an
// array-based toast queue instead — this component's shape would barely
// change.
export function ToastContainer() {
    const { error, success, setError, setSuccess } = useGlobalUI();

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [error, setError]);

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => setSuccess(null), AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [success, setSuccess]);

    if (!error && !success) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
            {error && <Toast variant="error" message={error} onDismiss={() => setError(null)} />}
            {success && <Toast variant="success" message={success} onDismiss={() => setSuccess(null)} />}
        </div>
    );
}