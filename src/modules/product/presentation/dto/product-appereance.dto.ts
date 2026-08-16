import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';

export const productAppereanceDto = z.object({
    productId: idSchema
})

export type productAppereanceDtoType = z.infer<typeof productAppereanceDto>