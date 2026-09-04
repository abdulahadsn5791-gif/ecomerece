// packages/shared/api-response.types.ts
//
// Mirrors the envelope shapes produced by registerErrorHandler() and the
// ok/created/accepted/noContent/paginated helpers on the backend.
// This is the ONLY file that describes what the wire format looks like —
// http-client.ts is the only file allowed to import it.

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiIssue {
    field: string;
    message: string;
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export interface ApiPaginatedResponse<T> {
    success: true;
    data: T[];
    meta: PaginationMeta;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        issues?: ApiIssue[];
        stack?: string; // dev-only, never rely on this in the client
    };
}

export type ApiEnvelope<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type ApiPaginatedEnvelope<T> = ApiPaginatedResponse<T> | ApiErrorResponse;