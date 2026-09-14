import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { AppError } from '../../errors/app-error';
import type { RedisLike } from '../rateLimiter';
import { createRateLimiter } from '../rateLimiter';

class FakeRedis implements RedisLike {
  counters = new Map<string, number>();

  async eval(_script: string, options: { keys: string[]; arguments: string[] }): Promise<unknown> {
    const key = options.keys[0];
    const max = Number(options.arguments[0]);
    const windowMs = Number(options.arguments[1]);
    const now = Number(options.arguments[2]);
    const window = Math.floor(now / windowMs);
    const currentKey = `${key}:${window}`;
    const previousKey = `${key}:${window - 1}`;
    const current = this.counters.get(currentKey) ?? 0;
    const previous = this.counters.get(previousKey) ?? 0;
    const weight = (now - window * windowMs) / windowMs;
    const estimate = previous * (1 - weight) + current;

    if (estimate >= max) return 0;
    this.counters.set(currentKey, current + 1);
    return 1;
  }
}

function buildApp(limiter: ReturnType<typeof createRateLimiter>): { app: Hono; handled: number[] } {
  const app = new Hono();
  const handled: number[] = [];
  app.onError((err, c) => {
    const status = (err && err instanceof AppError ? err.status : 500) as ContentfulStatusCode;
    return c.json({ success: false }, status);
  });
  app.use('*', limiter);
  app.get('/', (c) => {
    handled.push(1);
    return c.text('ok');
  });
  return { app, handled };
}

describe('createRateLimiter', () => {
  it('allows requests up to the limit, then rejects with 429', async () => {
    const time = 1_000_000;
    const now = () => time;
    const { app, handled } = buildApp(
      createRateLimiter({ max: 2, windowMs: 60_000 }, { redis: new FakeRedis(), now }),
    );

    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(429);
    expect(handled).toHaveLength(2);
  });

  it('reopens the window after it rolls over', async () => {
    let time = 1_000_000;
    const now = () => time;
    const redis = new FakeRedis();
    const { app } = buildApp(createRateLimiter({ max: 2, windowMs: 60_000 }, { redis, now }));

    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(429);

    time += 60_000;
    expect((await app.request('/')).status).toBe(200);
  });

  it('keeps buckets independent per keyPrefix', async () => {
    const time = 1_000_000;
    const now = () => time;
    const redis = new FakeRedis();
    const a = buildApp(
      createRateLimiter({ max: 1, windowMs: 60_000, keyPrefix: 'rl:a' }, { redis, now }),
    );
    const b = buildApp(
      createRateLimiter({ max: 1, windowMs: 60_000, keyPrefix: 'rl:b' }, { redis, now }),
    );

    expect((await a.app.request('/')).status).toBe(200);
    expect((await a.app.request('/')).status).toBe(429);
    expect((await b.app.request('/')).status).toBe(200);
  });

  it('separates buckets by client ip by default', async () => {
    const time = 1_000_000;
    const now = () => time;
    const { app } = buildApp(
      createRateLimiter({ max: 1, windowMs: 60_000 }, { redis: new FakeRedis(), now }),
    );
    const get = (ip?: string) =>
      app.request('/', {
        headers: ip ? { 'x-forwarded-for': ip } : {},
      });

    expect((await get('1.1.1.1')).status).toBe(200);
    expect((await get('2.2.2.2')).status).toBe(200);
    expect((await get('1.1.1.1')).status).toBe(429);
  });

  it('uses a custom keyGenerator when provided', async () => {
    const time = 1_000_000;
    const now = () => time;
    const { app } = buildApp(
      createRateLimiter(
        {
          max: 1,
          windowMs: 60_000,
          keyGenerator: (c) => c.req.header('x-user-id') ?? 'anon',
        },
        { redis: new FakeRedis(), now },
      ),
    );
    const get = (userId?: string) =>
      app.request('/', { headers: userId ? { 'x-user-id': userId } : {} });

    expect((await get('user-1')).status).toBe(200);
    expect((await get('user-2')).status).toBe(200);
    expect((await get('user-1')).status).toBe(429);
  });
});
