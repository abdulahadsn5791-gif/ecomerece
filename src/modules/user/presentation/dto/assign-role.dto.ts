import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';

export const RoleSchema = z.enum(['customer', 'vendor', 'admin']);

export const UserRoleDtoSchema = z.object({
    role: RoleSchema.default('customer'),
    userId: clerkUserIdSchema,
    reason: z.string(),
});

export type UserRoleDto = z.infer<typeof UserRoleDtoSchema>;
