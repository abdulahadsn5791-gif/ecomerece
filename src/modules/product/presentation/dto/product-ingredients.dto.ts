import { z } from "zod";
import { idSchema } from "../../../../../shared/dtos/id-schema";
import { booleanSchema } from "../../../../../shared/dtos/boolean-schema";
import { nameSchema } from "../../../../../shared/dtos/name-schema";

export const toggleIngredientsDto = z.object({
    productId: idSchema,
    enable: booleanSchema,
})


export const ingredientsDto = z.object({
    productId: idSchema,
    items: z.array(nameSchema)
})
export type ingredientsDtotype = z.infer<typeof ingredientsDto>
export type toggleIngredientsDtoType = z.infer<typeof toggleIngredientsDto>;