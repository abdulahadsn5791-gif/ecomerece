import { z } from 'zod';
import { clerkUserIdSchema } from '../../dtos';

export const ObjUserIdDTOSchema = z.object({ userId: clerkUserIdSchema });
export type ObjUserIdDTO = z.infer<typeof ObjUserIdDTOSchema>;
