import type { PostgrestError } from '@supabase/supabase-js';
import { AppError, BadRequestError, ConflictError, NotFoundError } from './app-error';

export function handleSupabaseError(
    error: PostgrestError | null,
    defaultMessage = 'Database operation failed',
): AppError {
    if (!error) {
        return new AppError(defaultMessage, 'UNKNOWN_ERROR', 500);
    }

    const { code, message, details } = error;

    switch (code) {
        case '23505': {
            const field = extractFieldFromDetail(details);

            return new ConflictError(field ? `${field} already exists` : 'Resource already exists');
        }

        case '23503':
            return new BadRequestError('Related resource does not exist');

        case '23502':
            return new BadRequestError('Missing required field');

        case '22P02':
            return new BadRequestError('Invalid input format');

        case 'PGRST116':
            return new NotFoundError('Resource not found');

        default:
            return new AppError(message || defaultMessage, code || 'DATABASE_ERROR', 500);
    }
}

function extractFieldFromDetail(details?: string): string | null {
    if (!details) return null;

    const match = details.match(/Key \((\w+)\)=/);

    return match ? match[1] : null;
}
