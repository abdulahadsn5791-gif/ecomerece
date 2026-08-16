export class AppError extends Error {
    code: string;
    status: number;
    issues?: { field: string; message: string }[];

    constructor(
        message: string | { message: string; issues?: any },
        code: string = 'BAD_REQUEST',
        status: number = 400,
    ) {
        if (typeof message === 'string') {
            super(message);
        } else {
            super(message.message);
            this.issues = message.issues;
        }

        this.code = code;
        this.status = status;
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 'NOT_FOUND', 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 'UNAUTHORIZED', 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 'FORBIDDEN', 403);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Already exists') {
        super(message, 'CONFLICT', 409);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 'BAD_REQUEST', 400);
    }
}

export class TooManyRequestError extends AppError {
    constructor(message = 'Too Many request') {
        super(message, 'TOO_MANY_REQUEST', 429);
    }
}

export class ConcurrencyError extends AppError {
    constructor(
        message = 'The resource was modified by another request. Please reload and try again.',
    ) {
        super(message, 'CONCURRENCY_ERROR', 409);
    }
}
