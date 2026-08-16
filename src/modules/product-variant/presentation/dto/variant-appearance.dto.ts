import { z } from 'zod';
import { booleanSchema } from '../../../../../shared/dtos/boolean-schema';
import { idSchema } from '../../../../../shared/dtos/id-schema';

export const toggleVariantApperaaracneDto = z.object({
    productId: idSchema,
    variantId: idSchema,
    appearance: booleanSchema,
});

export type toggleVariantApperaaracneDtoType = z.infer<typeof toggleVariantApperaaracneDto>;
