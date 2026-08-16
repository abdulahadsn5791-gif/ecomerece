import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';

export const BlockUserDTOSchema = z.object({
    userId: clerkUserIdSchema,
    reason: z.string(),
});

export type BlockUserDTO = z.infer<typeof BlockUserDTOSchema>;
