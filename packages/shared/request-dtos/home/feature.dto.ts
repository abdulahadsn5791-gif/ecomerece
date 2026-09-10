import { z } from 'zod';
import { colorSchema, descriptionSchema, iconSchema, idSchema, titleSchema } from '../../dtos';

export const createFeatureDtoSchema = z.object({
    id: idSchema.optional(),
    title: titleSchema,
    detail: descriptionSchema,
    icon: iconSchema.default('sparkles'),
    accent: colorSchema.default('#10B981'),
});

export type CreateFeatureDtoType = z.infer<typeof createFeatureDtoSchema>;

export const updateFeatureDtoSchema = z.object({
    id: idSchema,
    title: titleSchema.optional(),
    detail: descriptionSchema.optional(),
    icon: iconSchema.optional(),
    accent: colorSchema.optional(),
});

export type UpdateFeatureDtoType = z.infer<typeof updateFeatureDtoSchema>;

export const deleteFeatureDtoSchema = z.object({
    id: idSchema,
});

export type DeleteFeatureDtoType = z.infer<typeof deleteFeatureDtoSchema>;

export const setFeaturesDtoSchema = z.object({
    features: z.array(createFeatureDtoSchema).max(8, 'Cannot exceed maximum of 8 features'),
});

export type SetFeaturesDtoType = z.infer<typeof setFeaturesDtoSchema>;
