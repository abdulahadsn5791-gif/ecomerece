import { z } from 'zod';

export const dateSchema = z.date();

export type dateType = z.infer<typeof dateSchema>;