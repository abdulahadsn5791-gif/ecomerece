import { createMiddleware } from 'hono/factory';
import { ForbiddenError, UnauthorizedError } from '../errors/app-error';
import { getBearerToken } from '../lib/getBearerToken';
import { UserModel } from '../modules/user/infrastructure/user.models';
import { supabaseAdmin } from '../lib/supabase';




export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    console.log('1');
    const token = getBearerToken(authHeader);
    console.log('2');
    if (!token) {
        throw new UnauthorizedError('Missing token');
    }
    console.log('3');
    // Verify the token securely via Supabase's server-side Auth API
    const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !supabaseUser) {
        throw new UnauthorizedError('Invalid or expired token');
    }

    const userId = String(supabaseUser.id);
    const email = String(supabaseUser.email)
    if (!userId) {
        throw new UnauthorizedError('Invalid token payload');
    }

    const user = await UserModel.findById(userId);

    if (!user || user.deleted?.deleted) {
        throw new UnauthorizedError('User not found');
    }

    if (user.block?.blocked) {
        throw new ForbiddenError('User blocked');
    }

    if (user.ban?.banned) {
        throw new ForbiddenError('User banned');
    }

    c.set('email', email)
    c.set('user', user);
    c.set('userId', userId);
    c.set('role', user.role?.role);

    await next();
});