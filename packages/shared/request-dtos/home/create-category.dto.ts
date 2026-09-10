import { z } from "zod";
import { titleSchema, urlSchema } from "../../dtos";
import { colorSchema } from "../../dtos";

export const createCategoryDTOSchema = z.object({
    name: titleSchema,
    image: urlSchema,
    accent: colorSchema
})

export type createCategoryDTOSchema = z.infer<typeof createCategoryDTOSchema>