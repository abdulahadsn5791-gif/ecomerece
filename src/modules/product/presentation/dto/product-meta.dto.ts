import { z } from 'zod';
import { descriptionSchema } from '../../../../../shared/dtos/description-schema';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { titleSchema } from '../../../../../shared/dtos/title-schema';

export const updateProductMetaDto = z.object({
    title: titleSchema,
    productId: idSchema,
    description: descriptionSchema,
});

export type updateProductMetaDtoType = z.infer<typeof updateProductMetaDto>;
