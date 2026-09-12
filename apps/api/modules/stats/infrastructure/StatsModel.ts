import { METRIC_FIELDS } from '@ecomerece/shared';
import mongoose, { type InferSchemaType, Schema } from 'mongoose';

const metricsSchemaDef = METRIC_FIELDS.reduce<Record<string, unknown>>((acc, field) => {
  acc[field] = { type: Number, default: 0 };
  return acc;
}, {});

const StatsSchema = new Schema(
  {
    entity: {
      type: {
        type: String,
        required: true,
        enum: ['product', 'category', 'vendor', 'user', 'order', 'coupon', 'page'],
      },
      id: { type: String, required: true },
    },
    aggregation: {
      type: String,
      required: true,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'lifetime'],
    },
    dimensions: {
      date: { type: String, default: null },
      hour: { type: String, default: null },
      week: { type: String, default: null },
      month: { type: String, default: null },
      country: { type: String, default: null },
      platform: { type: String, default: null },
      source: { type: String, default: null },
    },
    metrics: metricsSchemaDef,
  },
  { timestamps: true, minimize: false },
);

// One document per unique (entity, aggregation level, dimension combo).
// This is what makes the upsert + $inc pattern collision-free: every bulk
// write targets exactly one slot, and Mongo resolves the increment atomically.
StatsSchema.index(
  {
    'entity.type': 1,
    'entity.id': 1,
    aggregation: 1,
    'dimensions.date': 1,
    'dimensions.hour': 1,
    'dimensions.week': 1,
    'dimensions.month': 1,
    'dimensions.country': 1,
    'dimensions.platform': 1,
    'dimensions.source': 1,
  },
  { unique: true, name: 'uniq_stat_slot' },
);

// Read-path indexes for common queries (dashboards, top-N, time series).
StatsSchema.index(
  { 'entity.type': 1, aggregation: 1, 'dimensions.date': -1 },
  { name: 'by_type_agg_date' },
);
StatsSchema.index({ 'entity.type': 1, 'entity.id': 1, aggregation: 1 }, { name: 'by_entity_agg' });

export type StatsDocument = InferSchemaType<typeof StatsSchema>;
export const StatsModel = mongoose.model('Stats', StatsSchema);
