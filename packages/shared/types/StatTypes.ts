export type EntityType = 'product' | 'category' | 'vendor' | 'user' | 'order' | 'coupon' | 'page';

export type AggregationLevel = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'lifetime';

export type MetricName =
  | 'views'
  | 'clicks'
  | 'purchases'
  | 'revenue'
  | 'quantity'
  | 'addToCart'
  | 'wishlist'
  | 'refunds'
  | 'refundAmount';

export const METRIC_FIELDS: MetricName[] = [
  'views',
  'clicks',
  'purchases',
  'revenue',
  'quantity',
  'addToCart',
  'wishlist',
  'refunds',
  'refundAmount',
];

export type Metrics = Partial<Record<MetricName, number>>;

export interface StatDimensions {
  date?: string; // YYYY-MM-DD
  hour?: string; // 00-23
  week?: string; // YYYY-Www
  month?: string; // YYYY-MM
  source?: string;
  platform?: string;
  country?: string;
}

export interface StatEntity {
  type: EntityType;
  id: string;
}

/**
 * What the rest of the app calls. Callers only describe *what happened* —
 * they never need to think about aggregation levels, dates, or hours.
 */
export interface TrackInput {
  entity: StatEntity;
  metrics: Metrics;
  /** Free-form dimensions to slice by (country, platform, source, ...). Time fields are derived automatically. */
  dimensions?: Pick<StatDimensions, 'source' | 'platform' | 'country'>;
  /** Defaults to now. Pass an explicit timestamp for backfills / replays. */
  timestamp?: Date;
}

/**
 * A single fully-resolved, storable stat slot. One TrackInput expands into
 * several of these (one per aggregation level) via the fan-out logic.
 */
export interface StatEvent {
  entity: StatEntity;
  aggregation: AggregationLevel;
  dimensions: StatDimensions;
  metrics: Metrics;
}

export function emptyMetrics(): Required<Metrics> {
  return {
    views: 0,
    clicks: 0,
    purchases: 0,
    revenue: 0,
    quantity: 0,
    addToCart: 0,
    wishlist: 0,
    refunds: 0,
    refundAmount: 0,
  };
}
