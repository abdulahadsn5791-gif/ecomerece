import { z } from 'zod';
import { idSchema, positiveNumberSchema } from '../../dtos';

export const createMyOrderDto = z.object({
    idempotentKey: idSchema,
    addressId: idSchema,
    waitingTime: z.coerce.date(),
    items: z.array(
        z.object({
            variantId: idSchema,
            quantity: positiveNumberSchema,
        }),
    ),
});

export type createMyOrderDtoType = z.infer<typeof createMyOrderDto>;
