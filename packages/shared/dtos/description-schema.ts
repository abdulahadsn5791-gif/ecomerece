import { z } from 'zod';


export const descriptionSchema = z.string().min(10).max(5000);
export const optionalDescriptionSchema = descriptionSchema.optional();


export type descriptionType = z.infer<typeof descriptionSchema>;
export type optionalDescriptionType = z.infer<typeof optionalDescriptionSchema>;
