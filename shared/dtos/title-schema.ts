import { z } from 'zod';

export const titleSchema = z.string().min(3).max(150);
export const optionalTitleSchema = titleSchema.optional();


export type titleType = z.infer<typeof titleSchema>;
export type optionalTitleType = z.infer<typeof optionalTitleSchema>;