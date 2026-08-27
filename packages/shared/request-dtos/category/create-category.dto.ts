import { z } from 'zod';
import { titleSchema, urlSchema } from '../../dtos';

export const createCategoryDto = z.object({
    title: titleSchema,
    image: urlSchema
});

export type createCategoryDtoType = z.infer<typeof createCategoryDto>