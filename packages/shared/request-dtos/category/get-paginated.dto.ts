import { z } from 'zod';
import { optionalIdSchema } from '../../dtos';

export const getPaginatedDto = z.object({
    cursor: optionalIdSchema,
    limit: z
        .number()
        .min(10, 'Limit must be at least 10')
        .max(50, 'Limit must not exceed 50')
        .optional(),
    direction: z.enum(['next', 'prev']).optional(),
});

export type getPaginatedDtoType = z.infer<typeof getPaginatedDto>;
