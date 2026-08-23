import { z } from 'zod';
import { clerkUserIdSchema, reasonSchema } from '../../dtos';


export const BanUserDTOSchema = z.object({
    userId: clerkUserIdSchema,
    forDays: z.number().min(1),
    reason: reasonSchema,
});

export type BanUserDTO = z.infer<typeof BanUserDTOSchema>;
