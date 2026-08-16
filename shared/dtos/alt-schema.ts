import { z } from 'zod';

export const altSchema = z.string().min(3).max(150);
export const optionalAltSchema = altSchema.optional();


export type altType = z.infer<typeof altSchema>;
export type optionalAltType = z.infer<typeof optionalAltSchema>;