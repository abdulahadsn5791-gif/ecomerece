import { z } from 'zod';

export const updateMylowStockThresholdDto = z.object({
    lowStockThreshold: z.number().min(1)
})

export type updateMylowStockThresholdDtoType = z.infer<typeof updateMylowStockThresholdDto>