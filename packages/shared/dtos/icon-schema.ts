import { z } from 'zod';

export const iconSchema = z
    .string()
    .trim()
    .min(1, 'Icon name must be at least 1 character')
    .max(50, 'Icon name must not exceed 50 characters');

export type IconSchemaType = z.infer<typeof iconSchema>;
