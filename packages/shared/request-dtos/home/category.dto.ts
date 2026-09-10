import { z } from 'zod';
import { colorSchema, idSchema, titleSchema, urlSchema } from '../../dtos';

export const createHomeCategoryDtoSchema = z.object({
    id: idSchema.optional(),
    name: titleSchema,
    image: urlSchema,
    accent: colorSchema.default('#3B82F6'),
});

export type CreateHomeCategoryDtoType = z.infer<typeof createHomeCategoryDtoSchema>;

export const updateHomeCategoryDtoSchema = z.object({
    id: idSchema,
    name: titleSchema.optional(),
    image: urlSchema.optional(),
    accent: colorSchema.optional(),
});

export type UpdateHomeCategoryDtoType = z.infer<typeof updateHomeCategoryDtoSchema>;

export const deleteHomeCategoryDtoSchema = z.object({
    id: idSchema,
});

export type DeleteHomeCategoryDtoType = z.infer<typeof deleteHomeCategoryDtoSchema>;

export const reorderHomeCategoriesDtoSchema = z.object({
    orderedIds: z.array(idSchema).min(1, 'orderedIds array must contain at least one ID'),
});

export type ReorderHomeCategoriesDtoType = z.infer<typeof reorderHomeCategoriesDtoSchema>;
