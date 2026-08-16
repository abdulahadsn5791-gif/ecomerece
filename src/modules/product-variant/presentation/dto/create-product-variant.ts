import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { titleSchema } from '../../../../../shared/dtos/title-schema';
import { booleanSchema } from '../../../../../shared/dtos/boolean-schema';
import { moneySchema } from '../../../../../shared/dtos/money-schema';

export const createMyProductVariantDto = z.object({

    productId: idSchema,
    discountedPrice: moneySchema,
    price: moneySchema,
    title: titleSchema,
    active: booleanSchema
})

export type createMyProductVariantDtoType = z.infer<typeof createMyProductVariantDto>