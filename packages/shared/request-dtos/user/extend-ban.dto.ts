import { z } from 'zod';
import { clerkUserIdSchema } from '../../dtos';


export const ExtendBanDTOSchema = z.object({
    userId: clerkUserIdSchema,
    forDays: z.number().min(1),
});

export type ExtendBanDTO = z.infer<typeof ExtendBanDTOSchema>;
