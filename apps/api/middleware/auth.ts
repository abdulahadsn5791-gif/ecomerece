import { verifyToken } from '@clerk/backend';
import { createMiddleware } from 'hono/factory';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';

import { getBearerToken } from '../lib/getBearerToken';
import { UserModel } from '../modules/user/infrastructure/user.models';

export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');

    const token = getBearerToken(authHeader);

    if (!token) {
        throw new UnauthorizedError('Missing token');
    }

    let payload;

    try {
        payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY!,
        });
    } catch (err) {
        throw new UnauthorizedError('Invalid or expired token');
    }

    const userId = String(payload.sub);
    if (!userId) {
        throw new UnauthorizedError('Invalid token payload');
    }

    const user = await UserModel.findById(userId);

    if (!user || user.deleted.deleted) {
        throw new UnauthorizedError('User not found');
    }

    if (user.block.blocked) {
        throw new ForbiddenError('User blocked');
    }

    if (user.ban.banned) {
        throw new ForbiddenError('User banned');
    }

    c.set('user', user);
    c.set('userId', userId);
    c.set('role', user.role.role);

    await next();
});
