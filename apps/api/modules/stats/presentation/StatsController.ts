import { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { AggregationLevel, EntityType } from '@ecomerece/shared';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { statsBufferService } from '../application/StatsBufferService';
import { statsQueryService } from '../application/StatsQueryService';
import type { StatsViewGuard, ViewEntityType } from '../application/StatsViewGuard';

export class StatsController {
  constructor(private readonly viewGuard: StatsViewGuard) {}

  public recordProductView = (c: Context) => this.recordView(c, 'product', 'productId');

  public recordCategoryView = (c: Context) => this.recordView(c, 'category', 'categoryId');

  public recordPageView = (c: Context) => this.recordView(c, 'page', 'pageKey');

  public recordProductClick = (c: Context) => {
    const productId = this.requireParam(c, 'productId');
    statsBufferService.track({
      entity: { type: 'product', id: productId },
      metrics: { clicks: 1 },
      dimensions: { source: c.req.query('source') },
    });
    return c.json({}, 202);
  };

  private recordView = async (c: Context, type: ViewEntityType, paramName: string) => {
    const rawId = this.requireParam(c, paramName);
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

    const decision = await this.viewGuard.shouldTrack({
      type,
      id,
      visitorId: c.req.header('x-visitor-id') ?? c.req.query('visitorId'),
      ip: this.clientIp(c),
      ua: c.req.header('user-agent'),
    });

    if (decision === 'skip') {
      // Silent non-tracking: duplicates, bots, and rate-limited traffic all
      // look identical on the wire so attackers can't probe the guard.
      return c.json({}, 202);
    }

    statsBufferService.track({
      entity: { type, id },
      metrics: { views: 1 },
      dimensions: {
        country: c.req.header('x-country-code'),
        platform: c.req.header('x-platform'),
        source: c.req.query('source') || c.req.header('referer'),
      },
    });
    return c.json({}, 202);
  };

  public getLifetimeStats = async (c: Context) => {
    const entityType = this.requireParam(c, 'entityType') as EntityType;
    const entityId = this.requireParam(c, 'entityId');
    const metrics = await statsQueryService.getLifetimeStats(entityType, entityId);
    return c.json({ entityType, entityId, aggregation: 'lifetime', metrics });
  };

  public getTimeSeries = async (c: Context) => {
    const entityType = this.requireParam(c, 'entityType') as EntityType;
    const entityId = this.requireParam(c, 'entityId');
    const from = c.req.query('from');
    const to = c.req.query('to');
    const aggregation = c.req.query('aggregation') ?? 'daily';

    if (!from || !to) {
      return c.json({ message: '`from` and `to` query params are required (YYYY-MM-DD)' }, 400);
    }

    const series =
      aggregation === 'weekly'
        ? await statsQueryService.getWeeklyTimeSeries(entityType, entityId, from, to)
        : aggregation === 'monthly'
          ? await statsQueryService.getMonthlyTimeSeries(entityType, entityId, from, to)
          : await statsQueryService.getDailyTimeSeries(entityType, entityId, from, to);

    return c.json({ entityType, entityId, aggregation, from, to, series });
  };

  public getTopEntities = async (c: Context) => {
    const entityType = this.requireParam(c, 'entityType') as EntityType;
    const metric = c.req.query('metric') ?? 'revenue';
    const aggregation = (c.req.query('aggregation') ?? 'lifetime') as Exclude<
      AggregationLevel,
      'hourly'
    >;
    const limit = Number(c.req.query('limit') ?? '10');

    const results = await statsQueryService.getTopByMetric(entityType, aggregation, metric, limit);
    return c.json({ entityType, aggregation, metric, results });
  };

  public getHealth = (c: Context) => {
    return c.json({ pendingInBuffer: statsBufferService.pendingCount });
  };

  private requireParam(c: Context, key: string): string {
    const value = c.req.param(key);
    if (!value) {
      throw new HTTPException(400, { message: `Missing required path parameter: ${key}` });
    }
    return value;
  }

  private clientIp(c: Context): string {
    return (
      c.req.header('cf-connecting-ip') ||
      c.req.header('x-forwarded-for')?.split(',')[0] ||
      'unknown'
    );
  }
}
