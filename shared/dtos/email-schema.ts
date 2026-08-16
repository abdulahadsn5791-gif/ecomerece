import { z } from 'zod';

export const emailSchema = z.email();
export const optionalEmailSchema = emailSchema.optional();


export type emailType = z.infer<typeof emailSchema>;
export type optionalEmailType = z.infer<typeof optionalEmailSchema>;