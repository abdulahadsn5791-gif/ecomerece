import { z } from 'zod';

export const emailSchema = z.email({ message: 'Must be a valid email address' });
export const optionalEmailSchema = emailSchema.optional();

export type emailType = z.infer<typeof emailSchema>;
export type optionalEmailType = z.infer<typeof optionalEmailSchema>;
