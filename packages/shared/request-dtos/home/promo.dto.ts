import { z } from 'zod';
import { colorSchema, idSchema, titleSchema, urlSchema } from '../../dtos';

export const createPromoDtoSchema = z.object({
    id: idSchema.optional(),
    title: titleSchema,
    subtitle: titleSchema,
    image: urlSchema,
    accent: colorSchema.default('#FB923C'),
    link: urlSchema.default('https://example.com/client/home'),
});

export type CreatePromoDtoType = z.infer<typeof createPromoDtoSchema>;

export const updatePromoDtoSchema = z.object({
    id: idSchema,
    title: titleSchema.optional(),
    subtitle: titleSchema.optional(),
    image: urlSchema.optional(),
    accent: colorSchema.optional(),
    link: urlSchema.optional(),
});

export type UpdatePromoDtoType = z.infer<typeof updatePromoDtoSchema>;

export const deletePromoDtoSchema = z.object({
    id: idSchema,
});

export type DeletePromoDtoType = z.infer<typeof deletePromoDtoSchema>;
