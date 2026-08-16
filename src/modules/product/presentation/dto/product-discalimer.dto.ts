import { z } from 'zod';
import { booleanSchema } from '../../../../../shared/dtos/boolean-schema';
import { idSchema } from '../../../../../shared/dtos/id-schema';
import { nameSchema } from '../../../../../shared/dtos/name-schema';
import { titleSchema } from '../../../../../shared/dtos/title-schema';

export const toggleDiscalimerDto = z.object({
    productId: idSchema,
    enable: booleanSchema,
});
export type toggleDiscalimerDtoType = z.infer<typeof toggleDiscalimerDto>;

export const disclaimerItemDto = z.object({
    name: nameSchema,
    title: titleSchema,
});

export const disclaimerItemsDto = z.object({
    items: z.array(disclaimerItemDto),
    productId: idSchema,
});

export type disclaimerItemsDtoType = z.infer<typeof disclaimerItemsDto>;
