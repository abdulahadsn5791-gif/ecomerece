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
}

export const statsService = new StatsService();
