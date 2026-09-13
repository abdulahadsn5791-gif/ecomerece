import { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { Context, Next } from 'hono';
import { redis } from '../lib/redis';
import { CategoryRepository } from '../modules/category/infrastructure/category.repository';
import { ProductRepository } from '../modules/product/infrastructure/product.repository';
import { StatsViewGuard, type StatsViewGuardDeps, type ViewEntityType } from './statsViewGuard';

const defaultViewGuard = new StatsViewGuard({
  redis,
  productRepo: new ProductRepository(),
  categoryRepo: new CategoryRepository(),
});

function clientIp(c: Context): string {
  return (
    c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for')?.split(',')[0] || 'unknown'
  );
}

/**
 * Redis anti-abuse guard for view-tracking endpoints, mounted at the
 * middleware level like the other guards in `apps/api/middleware/`.
 *
 * - Bots/duplicates/rate-limited traffic are silently dropped with a 202 so
 *   attackers can't probe the guard.
 * - Approved views are flagged via `c.set('statsViewId', id)`, which the
 *   downstream controller reads instead of re-deciding.
 */
export function createStatsViewGuardMiddleware(
  type: ViewEntityType,
  paramName: string,
  deps: StatsViewGuardDeps = {},
) {
  const guard = Object.keys(deps).length > 0 ? new StatsViewGuard(deps) : defaultViewGuard;

  return async (c: Context, next: Next) => {
    const rawId = c.req.param(paramName) ?? '';

    let id: string;
    if (type === 'page') {
      // Page keys (home, cart, ...) are slugs, not UUIDs.
      id = rawId;
    } else {
      try {
        id = Id.create(rawId).value;
      } catch {
        return c.json({ message: 'Invalid id format' }, 400);
      }
    }

    const decision = await guard.shouldTrack({
      type,
      id,
      visitorId: c.req.header('x-visitor-id') ?? c.req.query('visitorId'),
      ip: clientIp(c),
      ua: c.req.header('user-agent'),
    });

    if (decision === 'skip') {
      // Silent non-tracking: duplicates, bots, and rate-limited traffic all
      // look identical on the wire so attackers can't probe the guard.
      return c.json({}, 202);
    }

    c.set('statsViewId', id);
    await next();
  };
}
