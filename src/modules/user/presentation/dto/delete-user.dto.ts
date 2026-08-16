import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';

export const DeleteUserDTOSchema = z.object({
    userId: clerkUserIdSchema,
    reason: z.string(),
});

export type DeleteUserDTO = z.infer<typeof DeleteUserDTOSchema>;

export const DeleteMeDTOSchema = z.object({
    reason: z.string(),
});

export type DeleteMeDTO = z.infer<typeof DeleteMeDTOSchema>;
