import { z } from "zod";
import { idSchema } from "../../../../../shared/dtos/id-schema";
import { booleanSchema } from "../../../../../shared/dtos/boolean-schema";


export const toggleVariantApperaaracneDto = z.object(
    {
        productId: idSchema,
        variantId: idSchema,
        appearance: booleanSchema,
    })

export type toggleVariantApperaaracneDtoType = z.infer<typeof toggleVariantApperaaracneDto>