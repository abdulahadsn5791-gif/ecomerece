import { describe, expect, it } from 'bun:test';
import { Hono } from 'hono';
import type { EntityExistsRepo, RedisLike } from '../statsViewGuard';
import { createStatsViewGuardMiddleware } from '../statsViewGuard.middleware';

const REAL_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

class FakeRedis implements RedisLike {
  store = new Map<string, string>();
  counters = new Map<string, number>();

  async set(
    key: string,
    value: string,
    opts?: { NX?: boolean; EX?: number },
  ): Promise<string | null> {
    if (opts?.NX && this.store.has(key)) return null;
    this.store.set(key, value);
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const next = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, next);
    return next;
  }

  async expire(_key: string, _seconds: number): Promise<number> {
    return 1;
  }
}

const existsRepo = (value: boolean): EntityExistsRepo => ({
  Exists: async () => value,
});

function buildApp(
  overrides: {
    deps?: Parameters<typeof createStatsViewGuardMiddleware>[2];
    type?: 'product' | 'category' | 'page';
    paramName?: string;
  } = {},
) {
  const { deps = {}, type = 'product', paramName = 'productId' } = overrides;
  const app = new Hono();
  const handled: string[] = [];
  app.post(
    `/:${paramName}/view`,
    createStatsViewGuardMiddleware(type, paramName, {
      redis: new FakeRedis(),
      productRepo: existsRepo(true),
      categoryRepo: existsRepo(true),
      ...deps,
    }),
    (c) => {
      handled.push(c.req.path);
      return c.json({ ok: true });
    },
  );
  return { app, handled };
}

describe('createStatsViewGuardMiddleware', () => {
  it('passes approved views through and records the pre-validated id', async () => {
    const { app, handled } = buildApp();
    const res = await app.request('/product-1/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA, 'x-visitor-id': 'visitor-1' },
    });

    expect(res.status).toBe(200);
    expect(handled).toEqual(['/product-1/view']);
  });

  it('silently drops skipped views with a 202 without reaching the handler', async () => {
    const { app, handled } = buildApp();

    // First view is allowed...
    const first = await app.request('/product-1/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA, 'x-visitor-id': 'visitor-1' },
    });
    expect(first.status).toBe(200);

    // ...the duplicate is dropped with a silent 202.
    const second = await app.request('/product-1/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA, 'x-visitor-id': 'visitor-1' },
    });
    expect(second.status).toBe(202);
    expect(await second.json()).toEqual({});
    expect(handled).toEqual(['/product-1/view']);
  });

  it('drops bot traffic with a silent 202', async () => {
    const { app, handled } = buildApp();
    const res = await app.request('/product-1/view', {
      method: 'POST',
      headers: { 'user-agent': 'curl/7.88.1' },
    });

    expect(res.status).toBe(202);
    expect(handled).toEqual([]);
  });

  it('rejects malformed product ids with a 400', async () => {
    const { app, handled } = buildApp();
    const res = await app.request('/ab/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA },
    });

    expect(res.status).toBe(400);
    expect(handled).toEqual([]);
  });

  it('allows slug-based page keys without uuid validation', async () => {
    const { app, handled } = buildApp({ type: 'page', paramName: 'pageKey' });
    const res = await app.request('/home/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA, 'x-visitor-id': 'v1' },
    });

    expect(res.status).toBe(200);
    expect(handled).toEqual(['/home/view']);
  });

  it('drops views for a product that does not exist', async () => {
    const { app, handled } = buildApp({
      deps: { productRepo: existsRepo(false) },
    });
    const res = await app.request('/00000000-0000-7000-8000-000000000001/view', {
      method: 'POST',
      headers: { 'user-agent': REAL_UA, 'x-visitor-id': 'v1' },
    });

    expect(res.status).toBe(202);
    expect(handled).toEqual([]);
  });
});
