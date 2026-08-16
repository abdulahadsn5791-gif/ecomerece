import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';

export const ExtendBanDTOSchema = z.object({
    userId: clerkUserIdSchema,
    forDays: z.number(),
});

export type ExtendBanDTO = z.infer<typeof ExtendBanDTOSchema>;
