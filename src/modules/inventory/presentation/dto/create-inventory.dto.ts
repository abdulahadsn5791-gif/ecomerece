import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';

export const createMyInventoryDto = z.object({

    variantId: idSchema,
    lowStockThreshold: z.number().min(1),
    available: z.number().min(1)
})

export type createMyInventoryDtoType = z.infer<typeof createMyInventoryDto>