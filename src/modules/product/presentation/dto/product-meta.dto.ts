import { z } from 'zod';
import { titleSchema } from '../../../../../shared/dtos/title-schema';
import { descriptionSchema } from '../../../../../shared/dtos/description-schema';
import { idSchema } from '../../../../../shared/dtos/id-schema';

export const updateProductMetaDto = z.object({
    title: titleSchema,
    productId: idSchema,
    description: descriptionSchema,
})

export type updateProductMetaDtoType = z.infer<typeof updateProductMetaDto>
