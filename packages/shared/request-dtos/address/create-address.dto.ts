import { z } from 'zod';
import { nameSchema, titleSchema } from '../../dtos';


export const createMyAddressDto = z.object({
    streetAddress: titleSchema,
    city: nameSchema,
    state: nameSchema,
    postalCode: z.string().min(1).max(10),
    country: nameSchema,
});

export type createMyAddressDtoType = z.infer<typeof createMyAddressDto>;
