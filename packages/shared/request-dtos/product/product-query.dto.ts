import { z } from 'zod';

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
});

export type GetPaginatedProductsQueryDto = z.infer<typeof getPaginatedProductsQuerySchema>;
