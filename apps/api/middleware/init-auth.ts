import { createMiddleware } from "hono/factory";
import { UnauthorizedError } from "../errors/app-error";
import { getBearerToken } from "../lib/getBearerToken";
import { supabaseAdmin } from "../lib/supabase";


export const initAuthMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');

    const token = getBearerToken(authHeader);

    if (!token) {
        throw new UnauthorizedError('Missing token');
    }

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


    c.set('email', email)
    c.set('userId', userId);


    await next();
});