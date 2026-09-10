import { z } from 'zod';

export const dateSchema = z.date({ message: 'Must be a valid date' });

export type dateType = z.infer<typeof dateSchema>;
