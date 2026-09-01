'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Custom fallback renderer. Falls back to a default panel if omitted. */
    fallback?: (error: Error, reset: () => void) => ReactNode;
    /** Wire this to your logging service (Sentry, etc). */
    onError?: (error: Error, componentStack: string) => void;
}

interface ErrorBoundaryState {
    error: Error | null;
}

// Note: this only catches errors thrown during render/lifecycle in its
// subtree. Errors inside event handlers or async callbacks (fetch, your
// BaseService.request, onClick handlers) will NOT reach this — those
// already go through container.setError()/toasts instead, which is
// correct: a failed API call shouldn't blank the screen.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        this.props.onError?.(error, info.componentStack);
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    reset = () => {
        this.setState({ error: null });
    };

    render() {
        const { error } = this.state;
        if (error) {
            if (this.props.fallback) {
                return this.props.fallback(error, this.reset);
            }





            return (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/40">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Something went wrong.
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">{error.message}</p>
                    <button
                        onClick={this.reset}
                        className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/40"
                    >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// USAGE NOTE: this.state doesn't auto-reset when its children's props
// change (e.g. navigating from /products/1 to /products/2 that both
// crash the same way). Force a remount with a `key` tied to the thing
// that changed:
//
//   <ErrorBoundary key={productId}>
//     <ProductPage id={productId} />
//   </ErrorBoundary>