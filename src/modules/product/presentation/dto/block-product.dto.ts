import { z } from 'zod';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { reasonSchema } from '../../../../../shared/dtos/reason-schema';

export const blockProductDto = z.object({ reason: reasonSchema, productId: idSchema });
export const blockLiftProductDto = z.object({ productId: idSchema });

export type blockProductDtoType = z.infer<typeof blockProductDto>;
export type blockLiftProductDtoType = z.infer<typeof blockLiftProductDto>;
