import { describe, expect, it } from 'bun:test';
import type { EntityExistsRepo, RedisLike } from '../statsViewGuard';
import { StatsViewGuard } from '../statsViewGuard';

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

const now = new Date('2026-09-12T10:30:00Z');

describe('StatsViewGuard', () => {
  describe('isBot', () => {
    it('rejects suspicious, empty, and crawler user agents', () => {
      const guard = new StatsViewGuard();
      expect(guard.isBot(undefined)).toBe(true);
      expect(guard.isBot('')).toBe(true);
      expect(guard.isBot('   ')).toBe(true);
      expect(guard.isBot('curl/7.88.1')).toBe(true);
      expect(guard.isBot('python-requests/2.32.3')).toBe(true);
      expect(
        guard.isBot('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
      ).toBe(true);
    });

    it('accepts real browser user agents', () => {
      const guard = new StatsViewGuard();
      expect(guard.isBot(REAL_UA)).toBe(false);
    });
  });

  describe('visitor dedupe', () => {
    it('tracks the first view and skips a repeat within 24h for the same visitor', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis() });
      const input = {
        type: 'product' as const,
        id: 'product-1',
        visitorId: 'visitor-1',
        ua: REAL_UA,
        now,
      };

      const first = await guard.shouldTrack(input);
      const second = await guard.shouldTrack(input);

      expect(first).toBe('track');
      expect(second).toBe('skip');
    });

    it('dedupes anonymous visitors by ip+ua when no visitor id is sent', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis() });
      const input = { type: 'product' as const, id: 'product-1', ip: '1.2.3.4', ua: REAL_UA, now };

      expect(await guard.shouldTrack(input)).toBe('track');
      expect(await guard.shouldTrack(input)).toBe('skip');
    });
  });

  describe('existence check', () => {
    it('drops views for products that do not exist', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis(), productRepo: existsRepo(false) });
      const decision = await guard.shouldTrack({
        type: 'product',
        id: 'ghost-1',
        ua: REAL_UA,
        now,
      });
      expect(decision).toBe('skip');
    });

    it('tracks views for existing products', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis(), productRepo: existsRepo(true) });
      const decision = await guard.shouldTrack({
        type: 'product',
        id: 'product-1',
        ua: REAL_UA,
        now,
      });
      expect(decision).toBe('track');
    });

    it('always allows generic pages (e.g. home) without a repo', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis() });
      const decision = await guard.shouldTrack({ type: 'page', id: 'home', ua: REAL_UA, now });
      expect(decision).toBe('track');
    });
  });

  describe('rate caps', () => {
    it('caps total tracked views per identity per hour', async () => {
      const guard = new StatsViewGuard({
        redis: new FakeRedis(),
        maxViewsPerHourPerIdentity: 2,
      });

      expect(
        await guard.shouldTrack({ type: 'product', id: 'a', visitorId: 'v1', ua: REAL_UA, now }),
      ).toBe('track');
      expect(
        await guard.shouldTrack({ type: 'product', id: 'b', visitorId: 'v1', ua: REAL_UA, now }),
      ).toBe('track');
      expect(
        await guard.shouldTrack({ type: 'product', id: 'c', visitorId: 'v1', ua: REAL_UA, now }),
      ).toBe('skip');
    });

    it('caps views per entity per hour across visitors', async () => {
      const guard = new StatsViewGuard({
        redis: new FakeRedis(),
        productRepo: existsRepo(true),
        maxViewsPerHourPerEntity: 2,
      });
      const base = { type: 'product' as const, id: 'product-1', ua: REAL_UA, now };

      expect(await guard.shouldTrack({ ...base, visitorId: 'v1' })).toBe('track');
      expect(await guard.shouldTrack({ ...base, visitorId: 'v2' })).toBe('track');
      expect(await guard.shouldTrack({ ...base, visitorId: 'v3' })).toBe('skip');
    });

    it('blocks bots before any redis or existence work', async () => {
      const guard = new StatsViewGuard({ redis: new FakeRedis(), productRepo: existsRepo(true) });
      const decision = await guard.shouldTrack({
        type: 'product',
        id: 'product-1',
        ua: 'curl/7.88.1',
        now,
      });
      expect(decision).toBe('skip');
    });
  });
});
