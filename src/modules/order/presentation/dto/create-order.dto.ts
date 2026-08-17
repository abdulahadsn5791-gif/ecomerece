import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { moneySchema } from '../../../../../shared/dtos/money-schema';
import { positiveNumberSchema } from '../../../../../shared/dtos/positive-number-schema';

export const createMyOrderDto = z.object({
    idempotentKey: idSchema,
    addressId: idSchema,
    items: z.array(
        z.object({
            variantId: idSchema,
            quantity: positiveNumberSchema,
            unitPrice: moneySchema,
        })
    )


})

export type createMyOrderDtoType = z.infer<typeof createMyOrderDto>