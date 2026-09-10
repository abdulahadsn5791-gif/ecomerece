import { z } from 'zod';

export const urlSchema = z.url({ message: 'Must be a valid URL' });
export const optionalUrlSchema = urlSchema.optional();

export type UrlType = z.infer<typeof urlSchema>;
export type optionalUrlType = z.infer<typeof optionalUrlSchema>;
