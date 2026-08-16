import { z } from 'zod';


export const buyMyInventoryStockDto = z.object({
    quantity: z.number().min(1)
})

export type buyMyInventoryStockDtoType = z.infer<typeof buyMyInventoryStockDto>