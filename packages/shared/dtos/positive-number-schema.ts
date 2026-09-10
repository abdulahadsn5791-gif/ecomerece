import { z } from 'zod';

export const positiveNumberSchema = z.number().min(1, 'Must be at least 1');

export type positiveNumberType = z.infer<typeof positiveNumberSchema>;
