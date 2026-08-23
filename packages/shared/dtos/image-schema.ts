import { z } from "zod";
import { urlSchema } from "./url-schema";
import { altSchema } from "./alt-schema";
import { booleanSchema } from "./boolean-schema";


export const imageSchema = z.object({
    url: urlSchema,
    alt: altSchema,
    isDefault: booleanSchema,
})

export const optionalImageSchema = imageSchema.optional();

export type imageType = z.infer<typeof imageSchema>;
export type optionalImageType = z.infer<typeof optionalImageSchema>;