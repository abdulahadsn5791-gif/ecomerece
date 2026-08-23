import { z } from 'zod';
import { idSchema, imageSchema } from '../../dtos';


export const imagesDto = z.object({
    images: z.array(imageSchema
    ),
    productId: idSchema,
});

export const deafultImageDto = z.object({
    index: z.number().max(3).min(0),
    productId: idSchema,
});
export type deafultImageDtoType = z.infer<typeof deafultImageDto>;

export type imagesDtoType = z.infer<typeof imagesDto>;
