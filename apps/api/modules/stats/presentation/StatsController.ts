import { getISOWeek, getTimeWindows } from '@ecomerece/domain';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import {
  type AggregationLevel,
  type EntityType,
  getPaginatedStatsQuerySchema,
  getProductStatsOverviewQuerySchema,
  getStatsAggregateQuerySchema,
  getStatsAggregateTimeSeriesQuerySchema,
  type Metrics,
  updateProductStatsSettingsSchema,
} from '@ecomerece/shared';
import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { triggerProductStatsDenormalization } from '../application/ProductStatsSyncScheduler';
import { type StatsAccessGuard, statsAccessGuard } from '../application/StatsAccessGuard';
import { statsBufferService } from '../application/StatsBufferService';
import { statsQueryService } from '../application/StatsQueryService';
import { statsSyncSettingsService } from '../application/StatsSyncSettingsService';
import type { StatsViewGuard, ViewEntityType } from '../application/StatsViewGuard';

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function shiftDateKeys(count: number, fromKey: string): string[] {
  const [y, m, d] = fromKey.split('-').map(Number);
  const base = Date.UTC(y, (m ?? 1) - 1, d ?? 1) - (count - 1) * 86_400_000;
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(base + i * 86_400_000);
    keys.push(
      d == null
        ? `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
        : date.toISOString().split('T')[0],
    );
  }
  return keys;
}

function backWeeks(count: number, fromWeek: string): string[] {
  const [year, week] = fromWeek.split('-W').map(Number);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstMonday = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86_400_000);
  const base = firstMonday.getTime() + (week - 1) * 7 * 86_400_000;
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    keys.push(getISOWeek(new Date(base - (count - 1 - i) * 7 * 86_400_000)));
  }
  return keys;
}

export class StatsController {
  constructor(
    private readonly viewGuard: StatsViewGuard,
    private readonly accessGuard: StatsAccessGuard = statsAccessGuard,
  ) {}

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

  private maskFinancialMetrics(metrics: Metrics): Metrics {
    const { revenue, refunds, refundAmount, ...rest } = metrics;
    void revenue;
    void refunds;
    void refundAmount;
    return rest;
  }

  private async shouldExposeFullStats(
    c: Context,
    entityType: string,
    entityId: string,
  ): Promise<boolean> {
    if (c.get('role') === 'admin') return true;
    if (entityType !== 'product' && entityType !== 'vendor') return true;
    try {
      await this.accessGuard.ensureEntityReadable(
        entityType,
        entityId,
        c.get('role'),
        c.get('userId'),
      );
      return true;
    } catch {
      return false;
    }
  }

  public getLifetimeStats = async (c: Context) => {
    const entityType = this.requireParam(c, 'entityType') as EntityType;
    const entityId = this.requireParam(c, 'entityId');
    const raw = await statsQueryService.getLifetimeStats(entityType, entityId);
    const exposeFull = await this.shouldExposeFullStats(c, entityType, entityId);
    const metrics = exposeFull ? raw : this.maskFinancialMetrics(raw);
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

    const exposeFull = await this.shouldExposeFullStats(c, entityType, entityId);

    const rawSeries =
      aggregation === 'weekly'
        ? await statsQueryService.getWeeklyTimeSeries(entityType, entityId, from, to)
        : aggregation === 'monthly'
          ? await statsQueryService.getMonthlyTimeSeries(entityType, entityId, from, to)
          : await statsQueryService.getDailyTimeSeries(entityType, entityId, from, to);

    const series = exposeFull
      ? rawSeries
      : rawSeries.map((point) => ({
          ...point,
          metrics: this.maskFinancialMetrics(point.metrics as Metrics),
        }));

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

  public getProductStatsOverview = async (c: Context) => {
    const productId = this.requireParam(c, 'entityId');
    const parsed = getProductStatsOverviewQuerySchema.safeParse(c.req.query());
    if (!parsed.success) throw new HTTPException(400, { message: 'Invalid overview query params' });

    await this.accessGuard.ensureProductReadable(productId, c.get('role'), c.get('userId'));

    const overview = await statsQueryService.getProductOverview(
      productId,
      parsed.data.months,
      parsed.data.days,
    );
    return c.json({ entityType: 'product', entityId: productId, overview });
  };

  public getPaginatedEntityStats = async (c: Context) => {
    const raw = { ...c.req.query(), entityType: c.req.param('entityType') };
    const parsed = getPaginatedStatsQuerySchema.safeParse(raw);
    if (!parsed.success) {
      throw new HTTPException(400, {
        message: 'Invalid stats query params',
        cause: parsed.error.flatten(),
      });
    }

    const { entityType, aggregation, metric, sort, limit, cursor } = parsed.data;
    const result = await statsQueryService.getPaginatedByMetric(
      entityType as EntityType,
      aggregation,
      metric,
      sort,
      limit,
      cursor,
    );

    return c.json({ entityType, aggregation, metric, ...result });
  };

  public getAggregate = async (c: Context) => {
    const raw = {
      ...c.req.query(),
      entityType: c.req.param('entityType'),
      ids: (c.req.query('ids') ?? '').split(',').filter(Boolean),
    };
    const parsed = getStatsAggregateQuerySchema.safeParse(raw);
    if (!parsed.success) {
      throw new HTTPException(400, { message: 'Invalid aggregate query params' });
    }

    const { entityType, aggregation, ids } = parsed.data;
    const metrics = await statsQueryService.getAggregateMetrics(entityType, aggregation, ids);
    return c.json({ entityType, aggregation, metrics });
  };

  public getAggregateTimeSeries = async (c: Context) => {
    const raw = { ...c.req.query(), entityType: c.req.param('entityType') };
    const parsed = getStatsAggregateTimeSeriesQuerySchema.safeParse(raw);
    if (!parsed.success) {
      throw new HTTPException(400, { message: 'Invalid aggregate timeseries query params' });
    }

    const now = new Date();
    const { date, week, month } = getTimeWindows(now);
    const aggregation = parsed.data.aggregation;
    let from = parsed.data.from;
    let to = parsed.data.to;

    if (!from || !to) {
      if (aggregation === 'weekly') {
        const keys = backWeeks(12, week);
        from = keys[0];
        to = week;
      } else if (aggregation === 'daily') {
        const keys = shiftDateKeys(30, date);
        from = keys[0];
        to = date;
      } else {
        const keys = shiftDateKeys(12, `${month}-01`);
        from = keys[0];
        to = month;
      }
    }

    const series = await statsQueryService.getAggregateTimeSeries(
      parsed.data.entityType as EntityType,
      aggregation as 'daily' | 'weekly' | 'monthly',
      from,
      to,
    );

    return c.json({ entityType: parsed.data.entityType, aggregation, from, to, series });
  };

  public getSettings = async (c: Context) => {
    return c.json({ success: true, data: await statsSyncSettingsService.getSettings() });
  };

  public updateSettings = async (c: Context) => {
    const parsed = updateProductStatsSettingsSchema.safeParse(await c.req.json());
    if (!parsed.success) {
      throw new HTTPException(400, { message: 'Invalid settings body' });
    }
    const settings = await statsSyncSettingsService.update(parsed.data);
    return c.json({ success: true, data: settings });
  };

  public triggerDenormalization = async (c: Context) => {
    await triggerProductStatsDenormalization(true);
    return c.json({ success: true, data: { accepted: true } }, 202);
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
