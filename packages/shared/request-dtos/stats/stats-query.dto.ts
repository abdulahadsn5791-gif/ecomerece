import { z } from 'zod';
import { METRIC_FIELDS } from '../../types/StatTypes';

export const statsEntityTypeSchema = z.enum([
  'product',
  'category',
  'vendor',
  'user',
  'order',
  'coupon',
  'page',
]);

export const statsAggregationSchema = z
  .enum(['hourly', 'daily', 'weekly', 'monthly', 'lifetime'])
  .default('lifetime');

export const statsMetricSchema = z.enum(METRIC_FIELDS as [string, ...string[]]).default('views');

export const getPaginatedStatsQuerySchema = z.object({
  entityType: statsEntityTypeSchema,
  aggregation: statsAggregationSchema,
  metric: statsMetricSchema,
  sort: z.enum(['desc', 'asc']).optional().default('desc'),
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .optional()
    .default(20),
});

export type GetPaginatedStatsQueryDto = z.infer<typeof getPaginatedStatsQuerySchema>;

export const getStatsAggregateQuerySchema = z.object({
  entityType: statsEntityTypeSchema,
  aggregation: statsAggregationSchema,
  ids: z.array(z.string()).optional(),
});

export type GetStatsAggregateQueryDto = z.infer<typeof getStatsAggregateQuerySchema>;

export const getStatsAggregateTimeSeriesQuerySchema = z.object({
  entityType: statsEntityTypeSchema,
  aggregation: statsAggregationSchema,
  from: z.string().optional(),
  to: z.string().optional(),
});

export type GetStatsAggregateTimeSeriesQueryDto = z.infer<
  typeof getStatsAggregateTimeSeriesQuerySchema
>;

export const getProductStatsOverviewQuerySchema = z.object({
  months: z.coerce.number().min(1).max(24).optional().default(12),
  days: z.coerce.number().min(1).max(90).optional().default(30),
});

export type GetProductStatsOverviewQueryDto = z.infer<typeof getProductStatsOverviewQuerySchema>;

export const updateProductStatsSettingsSchema = z.object({
  intervalHours: z.coerce
    .number()
    .min(1)
    .max(24 * 28)
    .optional(),
  autoDenormalizeEnabled: z.coerce.boolean().optional(),
});

export type UpdateProductStatsSettingsDto = z.infer<typeof updateProductStatsSettingsSchema>;
