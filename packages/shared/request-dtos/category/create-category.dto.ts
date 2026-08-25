import { z } from 'zod';
import { titleSchema } from '../../dtos';

export const createCategoryDto = z.object({
    title: titleSchema
});

export type createCategoryDtoType = z.infer<typeof createCategoryDto>