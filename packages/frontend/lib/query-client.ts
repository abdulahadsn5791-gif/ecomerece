//frontend
import { QueryClient } from '@tanstack/react-query';
import { HttpError } from './http-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        // A validation or auth error won't fix itself on retry — only retry
        // network errors (status 0) and real 5xx failures, twice at most.
        if (error instanceof HttpError && error.status !== 0 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false, // never auto-retry a write
    },
  },
});
