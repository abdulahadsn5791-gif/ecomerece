import { buildMongoFilter } from '@ecomerece/domain';
import type { AggregationLevel, EntityType, StatEvent } from '@ecomerece/shared';
import type { AnyBulkWriteOperation } from 'mongoose';
import { type StatsDocument, StatsModel } from './StatsModel';

export class StatsRepository {
  /** Atomically increments every event's metrics into its matching document, creating it if needed. */
  async bulkUpsert(events: StatEvent[]): Promise<void> {
    if (events.length === 0) return;

    const operations: AnyBulkWriteOperation[] = [];

    for (const event of events) {
      const $inc: Record<string, number> = {};
      for (const [metric, value] of Object.entries(event.metrics)) {
        if (value) $inc[`metrics.${metric}`] = value;
      }
      if (Object.keys($inc).length === 0) continue; // nothing to increment, skip the write entirely

      operations.push({
        updateOne: {
          filter: buildMongoFilter(event),
          update: {
            $setOnInsert: {
              entity: event.entity,
              aggregation: event.aggregation,
              dimensions: event.dimensions,
            },
            $inc,
          },
          upsert: true,
        },
      });
    }

    if (operations.length === 0) return;

    // ordered: false so one bad op (e.g. a validation edge case) doesn't block the rest of the batch.
    await StatsModel.bulkWrite(operations, { ordered: false });
  }

  async getEntityStats(
    entityType: EntityType,
    entityId: string,
    aggregation: AggregationLevel,
    filter: Record<string, unknown> = {},
  ): Promise<StatsDocument | null> {
    return StatsModel.findOne({
      'entity.type': entityType,
      'entity.id': entityId,
      aggregation,
      ...filter,
    }).lean();
  }

  async getTimeSeries(
    entityType: EntityType,
    entityId: string,
    aggregation: Extract<AggregationLevel, 'hourly' | 'daily' | 'weekly' | 'monthly'>,
    from: string,
    to: string,
  ): Promise<StatsDocument[]> {
    const dateField =
      aggregation === 'hourly' || aggregation === 'daily'
        ? 'dimensions.date'
        : aggregation === 'weekly'
          ? 'dimensions.week'
          : 'dimensions.month';

    return StatsModel.find({
      'entity.type': entityType,
      'entity.id': entityId,
      aggregation,
      [dateField]: { $gte: from, $lte: to },
    })
      .sort({ [dateField]: 1 })
      .lean();
  }

  async getTopEntities(
    entityType: EntityType,
    aggregation: AggregationLevel,
    metric: string,
    limit = 10,
    filter: Record<string, unknown> = {},
  ): Promise<StatsDocument[]> {
    return StatsModel.find({ 'entity.type': entityType, aggregation, ...filter })
      .sort({ [`metrics.${metric}`]: -1 })
      .limit(limit)
      .lean();
  }
}

export const statsRepository = new StatsRepository();
