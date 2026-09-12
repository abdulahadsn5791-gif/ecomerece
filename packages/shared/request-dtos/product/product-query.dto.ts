import { z } from 'zod';

export const productPublicSortSchema = z.enum([
  'newest',
  'oldest',
  'most_sold',
  'most_views',
  'most_purchases',
]);

export const productAdminSortSchema = z.enum([
  'newest',
  'oldest',
  'most_sold',
  'most_views',
  'most_purchases',
  'most_revenue',
]);

export type ProductPublicSort = z.infer<typeof productPublicSortSchema>;
export type ProductAdminSort = z.infer<typeof productAdminSortSchema>;

export const getPaginatedProductsQuerySchema = z.object({
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  appearance: z.enum(['public', 'private']).optional(),
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .optional()
    .default(20),
  direction: z.enum(['next', 'prev']).optional().default('next'),
  sort: productPublicSortSchema.optional().default('newest'),
});

export type GetPaginatedProductsQueryDto = z.infer<typeof getPaginatedProductsQuerySchema>;

// Admin-only query — no visibility restrictions; optionally filter by deleted / blocked state
export const getAdminPaginatedProductsQuerySchema = z.object({
  categoryId: z.string().optional(),
  vendorId: z.string().optional(),
  appearance: z.enum(['public', 'private']).optional(),
  search: z.string().optional(),
  deleted: z.coerce.boolean().optional(),
  blocked: z.coerce.boolean().optional(),
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .optional()
    .default(20),
  direction: z.enum(['next', 'prev']).optional().default('next'),
  sort: productAdminSortSchema.optional().default('newest'),
});

export type GetAdminPaginatedProductsQueryDto = z.infer<
  typeof getAdminPaginatedProductsQuerySchema
>;

// Vendor's own products — no vendorId accepted (scope is forced server-side from the actor)
export const getMyPaginatedProductsQuerySchema = z.object({
  categoryId: z.string().optional(),
  appearance: z.enum(['public', 'private']).optional(),
  search: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .optional()
    .default(20),
  direction: z.enum(['next', 'prev']).optional().default('next'),
  sort: productAdminSortSchema.optional().default('newest'),
});

export type GetMyPaginatedProductsQueryDto = z.infer<typeof getMyPaginatedProductsQuerySchema>;
