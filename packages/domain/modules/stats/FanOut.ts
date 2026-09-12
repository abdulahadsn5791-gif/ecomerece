import type { StatEvent, TrackInput } from '@ecomerece/shared';
import { getTimeWindows } from './TimeWindows';

/**
 * Expands a single TrackInput into one StatEvent per aggregation level.
 *
 * This is what makes "multi-dimensional aggregation" automatic: callers call
 * `track()` once, and this fans it out to hourly/daily/weekly/monthly/lifetime
 * slots so the caller never has to duplicate the call per time scope.
 */
export function expandToStatEvents(input: TrackInput): StatEvent[] {
  const ts = input.timestamp ?? new Date();
  const { date, hour, week, month } = getTimeWindows(ts);
  const dims = { ...input.dimensions };

  return [
    {
      entity: input.entity,
      aggregation: 'hourly',
      dimensions: { ...dims, date, hour },
      metrics: input.metrics,
    },
    {
      entity: input.entity,
      aggregation: 'daily',
      dimensions: { ...dims, date },
      metrics: input.metrics,
    },
    {
      entity: input.entity,
      aggregation: 'weekly',
      dimensions: { ...dims, week },
      metrics: input.metrics,
    },
    {
      entity: input.entity,
      aggregation: 'monthly',
      dimensions: { ...dims, month },
      metrics: input.metrics,
    },
    // Lifetime intentionally drops time dimensions but keeps other slicing dims
    // (country/platform/source) so you can still ask "lifetime views from US".
    {
      entity: input.entity,
      aggregation: 'lifetime',
      dimensions: { ...dims },
      metrics: input.metrics,
    },
  ];
}
