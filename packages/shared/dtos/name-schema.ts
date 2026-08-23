import { z } from 'zod';

export const nameSchema = z.string().min(1).max(50);
export const optionalNameSchema = nameSchema.optional();


export type nameType = z.infer<typeof nameSchema>;
export type optionalNameType = z.infer<typeof optionalNameSchema>;