import type { AggregationLevel, EntityType, Metrics } from '@ecomerece/shared';
import { http } from './../../lib';

export type StatsAggregationLevel = Exclude<AggregationLevel, 'hourly'>;

export interface StatsSeriesPoint {
  entity: { type: string; id: string };
  aggregation: string;
  dimensions: {
    date: string | null;
    hour: string | null;
    week: string | null;
    month: string | null;
    country: string | null;
    platform: string | null;
    source: string | null;
  };
  metrics: Metrics;
  createdAt: string;
  updatedAt: string;
}

export interface LifetimeStatsResponse {
  entityType: EntityType;
  entityId: string;
  aggregation: 'lifetime';
  metrics: Metrics;
}

export interface TimeSeriesStatsResponse {
  entityType: EntityType;
  entityId: string;
  aggregation: StatsAggregationLevel;
  from: string;
  to: string;
  series: StatsSeriesPoint[];
}

export interface StatsPaginatedResult {
  entityType: string;
  aggregation: string;
  metric: string;
  items: StatsSeriesPoint[];
  nextCursor: string | null;
}

export interface AggregateStatsResponse {
  entityType: string;
  aggregation: string;
  metrics: Metrics;
}

export interface AggregateTimeSeriesPoint {
  key: string;
  metrics: Metrics;
}

export interface AggregateTimeSeriesResponse {
  entityType: string;
  aggregation: string;
  from: string;
  to: string;
  series: AggregateTimeSeriesPoint[];
}

export interface ProductStatsOverview {
  lifetime: Metrics;
  today: Metrics;
  thisWeek: Metrics;
  thisMonth: Metrics;
  thisYear: Metrics;
  monthlySeries: AggregateTimeSeriesPoint[];
  dailySeries: AggregateTimeSeriesPoint[];
}

export interface ProductStatsOverviewResponse {
  entityType: 'product';
  entityId: string;
  overview: ProductStatsOverview;
}

export interface StatsSyncSettings {
  intervalHours: number;
  lastRun: number | null;
  autoDenormalizeEnabled: boolean;
}

export class StatsService {
  getLifetime(entityType: EntityType, entityId: string): Promise<LifetimeStatsResponse> {
    return http.get(`/stats/${entityType}/${entityId}/lifetime`);
  }

  getTimeSeries(
    entityType: EntityType,
    entityId: string,
    aggregation: StatsAggregationLevel,
    from: string,
    to: string,
  ): Promise<TimeSeriesStatsResponse> {
    const query = new URLSearchParams({ aggregation, from, to });
    return http.get(`/stats/${entityType}/${entityId}/timeseries?${query}`);
  }

  getPaginatedStats(
    entityType: EntityType,
    params: {
      aggregation?: AggregationLevel;
      metric?: string;
      sort?: 'desc' | 'asc';
      cursor?: string;
      limit?: number;
    } = {},
  ): Promise<StatsPaginatedResult> {
    const searchParams = new URLSearchParams();
    if (params.aggregation) searchParams.set('aggregation', params.aggregation);
    if (params.metric) searchParams.set('metric', params.metric);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.cursor) searchParams.set('cursor', params.cursor);
    if (params.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return http.get(`/stats/${entityType}/paginated${qs ? `?${qs}` : ''}`);
  }

  getProductStatsOverview(
    productId: string,
    months = 12,
    days = 30,
  ): Promise<ProductStatsOverviewResponse> {
    return http.get(`/stats/product/${productId}/overview?months=${months}&days=${days}`);
  }

  getAggregate(
    entityType: EntityType,
    params: { aggregation?: AggregationLevel; ids?: string[] } = {},
  ): Promise<AggregateStatsResponse> {
    const searchParams = new URLSearchParams();
    if (params.aggregation) searchParams.set('aggregation', params.aggregation);
    if (params.ids && params.ids.length > 0) searchParams.set('ids', params.ids.join(','));
    const qs = searchParams.toString();
    return http.get(`/stats/${entityType}/aggregate${qs ? `?${qs}` : ''}`);
  }

  getAggregateTimeSeries(
    entityType: EntityType,
    params: { aggregation?: 'daily' | 'weekly' | 'monthly'; from?: string; to?: string } = {},
  ): Promise<AggregateTimeSeriesResponse> {
    const searchParams = new URLSearchParams();
    if (params.aggregation) searchParams.set('aggregation', params.aggregation);
    if (params.from) searchParams.set('from', params.from);
    if (params.to) searchParams.set('to', params.to);
    const qs = searchParams.toString();
    return http.get(`/stats/${entityType}/aggregate/timeseries${qs ? `?${qs}` : ''}`);
  }

  getSyncSettings(): Promise<StatsSyncSettings> {
    return http.get('/stats/settings');
  }

  updateSyncSettings(input: {
    intervalHours?: number;
    autoDenormalizeEnabled?: boolean;
  }): Promise<StatsSyncSettings> {
    return http.patch('/stats/settings', input);
  }

  triggerProductStatsDenormalization(): Promise<{ accepted: boolean }> {
    return http.post('/stats/denormalize', {});
  }
}

export const statsService = new StatsService();
