import { z } from 'zod';
import { booleanSchema } from '../../../../../shared/dtos/boolean-schema';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { moneySchema } from '../../../../../shared/dtos/money-schema';
import { titleSchema } from '../../../../../shared/dtos/title-schema';

export const createMyProductVariantDto = z.object({
    productId: idSchema,
    discountedPrice: moneySchema,
    price: moneySchema,
    title: titleSchema,
    active: booleanSchema,
});

export type createMyProductVariantDtoType = z.infer<typeof createMyProductVariantDto>;
