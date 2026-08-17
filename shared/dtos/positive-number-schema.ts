import { z } from 'zod';


export const positiveNumberSchema = z.number().min(1);

export type positiveNumberType = z.infer<typeof positiveNumberSchema>;