import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { reasonSchema } from '../../../../../shared/dtos/reason-schema';

export const softDeleteMyVariantDto = z.object({
    productId: idSchema,
    variantId: idSchema,
    reason: reasonSchema,
});

export type softDeleteMyVariantDtoType = z.infer<typeof softDeleteMyVariantDto>;
