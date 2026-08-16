import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { moneySchema } from '../../../../../shared/dtos/money-schema';

export const updateMyVariatPriceDto = z.object({
    productId: idSchema,
    variantId: idSchema,
    price: moneySchema,
    discountedPrice: moneySchema,
});

export type updateMyVariatPriceDtoType = z.infer<typeof updateMyVariatPriceDto>;
