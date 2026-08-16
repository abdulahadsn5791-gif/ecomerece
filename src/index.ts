import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import app from './app';
import { registerErrorHandler } from './errors/error-handler';
import { dbMiddleware } from './middleware/db.middleware';
import { rateLimiter } from './middleware/rateLimiter';
import { requestGuards } from './middleware/requestguard.middleware';
import routes from './routes';

app.use(logger());
//  middleware
app.use(
    '*',
    secureHeaders({
        contentSecurityPolicy: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
        },
        xFrameOptions: 'DENY',
        xContentTypeOptions: 'nosniff',
        referrerPolicy: 'no-referrer',
    }),
);
app.use(
    '*',
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
    }),
);

app.use(
    '*',
    ...requestGuards({
        maxUrlLength: 200,
        maxQueryLength: 100,
        maxParamLength: 20,
        maxBodyBytes: 1_000,
        maxJsonDepth: 5,
        maxJsonNodes: 50,
    }),
);

app.use('*', dbMiddleware);
app.use('*', rateLimiter);

app.options('*', (c) => {
    return c.text('');
});

app.route('/', routes);

registerErrorHandler(app);
export default {
    port: 8000,
    fetch: app.fetch,
};
