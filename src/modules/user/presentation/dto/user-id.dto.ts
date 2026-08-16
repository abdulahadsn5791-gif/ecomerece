import { z } from 'zod';
import { clerkUserIdSchema } from '../../../../shared/validation/clerkSchema';
export const ObjUserIdDTOSchema = z.object({ userId: clerkUserIdSchema });
export type ObjUserIdDTO = z.infer<typeof ObjUserIdDTOSchema>;
