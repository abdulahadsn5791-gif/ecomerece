import { z } from 'zod';

export const urlSchema = z.url();
export const optionalUrlSchema = urlSchema.optional();


export type UrlType = z.infer<typeof urlSchema>;
export type optionalUrlType = z.infer<typeof optionalUrlSchema>;