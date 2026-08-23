import { createMiddleware } from 'hono/factory';
import { ForbiddenError } from '../errors/app-error';

export const adminMiddleware = createMiddleware(async (c, next) => {
    const role = c.get('role');

    if (role !== 'admin') {
        throw new ForbiddenError('Admin access required');
    }

    await next();
});
