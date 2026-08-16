import { z } from 'zod';

export const idSchema = z.uuid();
export const optionalIdSchema = idSchema.optional();


export type idType = z.infer<typeof idSchema>;
export type optionalIdType = z.infer<typeof optionalIdSchema>;