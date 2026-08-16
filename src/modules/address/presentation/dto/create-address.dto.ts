import { z } from 'zod';
import { nameSchema } from '../../../../../shared/dtos/name-schema';
import { titleSchema } from '../../../../../shared/dtos/title-schema';

export const createMyAddressDto = z.object({
    streetAddress: titleSchema,
    city: nameSchema,
    state: nameSchema,
    postalCode: z.string().min(1).max(10),
    country: nameSchema,
});

export type createMyAddressDtoType = z.infer<typeof createMyAddressDto>