import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';

export const BanUserDTOSchema = z.object({
    userId: clerkUserIdSchema,
    forDays: z.number(),
    reason: z.string(),
});

export type BanUserDTO = z.infer<typeof BanUserDTOSchema>;
