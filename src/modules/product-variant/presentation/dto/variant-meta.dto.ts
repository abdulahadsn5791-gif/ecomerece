import { z } from "zod";
import { titleSchema } from "../../../../../shared/dtos/title-schema";
import { idSchema } from "../../../../../shared/dtos/id-schema";

export const upadteMyVariantMetaDto = z.object({
    title: titleSchema,
    productId: idSchema,
    variantId: idSchema
});


export type upadteMyVariantMetaDtoType = z.infer<typeof upadteMyVariantMetaDto>