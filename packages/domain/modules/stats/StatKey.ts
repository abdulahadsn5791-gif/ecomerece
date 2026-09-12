import type { StatEvent } from '@ecomerece/shared';

// Fixed order so the in-memory buffer key and the Mongo filter always agree.
const DIMENSION_ORDER = ['date', 'hour', 'week', 'month', 'country', 'platform', 'source'] as const;

/** In-memory map key used by the buffer to accumulate repeated increments. */
export function buildStatKey(event: StatEvent): string {
  const dims = DIMENSION_ORDER.map((d) => event.dimensions[d] ?? '').join(':');
  return `${event.entity.type}:${event.entity.id}:${event.aggregation}:${dims}`;
}

/** Mongo filter used for the upsert. Must stay in sync with the unique index. */
export function buildMongoFilter(event: StatEvent): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    'entity.type': event.entity.type,
    'entity.id': event.entity.id,
    aggregation: event.aggregation,
  };
  for (const dim of DIMENSION_ORDER) {
    filter[`dimensions.${dim}`] = event.dimensions[dim] ?? null;
  }
  return filter;
}
