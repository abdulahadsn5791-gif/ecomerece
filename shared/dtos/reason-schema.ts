import { z } from 'zod';

export const reasonSchema = z.string().min(10).max(100);
export const optionalReasonSchema = reasonSchema.optional();


export type reasonType = z.infer<typeof reasonSchema>;
export type optionalReasonType = z.infer<typeof optionalReasonSchema>;