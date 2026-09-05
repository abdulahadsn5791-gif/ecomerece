// product.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { productService, type ProductMutationResult } from './product.service';
import {


    softDeleteMyProductDto,
    recoverProductDto,
    createMyProductVariantDtoType,
    softDeleteMyProductDtoType,
    CreateMyProductDtoSchema,
    recoverProductDtoType,
    blockProductDtoType,
    blockProductDto,
    blockLiftProductDto,
    blockLiftProductDtoType,
    productAppereanceDtoType,
    productAppereanceDto,
    updateProductMetaDtoType,
    updateProductMetaDto,
    toggleDiscalimerDtoType,
    toggleDiscalimerDto,
    disclaimerItemsDtoType,
    disclaimerItemsDto,
    imagesDtoType,
    imagesDto,
    deafultImageDtoType,
    deafultImageDto,
    toggleIngredientsDtoType,
    toggleIngredientsDto,
    ingredientsDtotype,
    ingredientsDto,
} from '@ecomerece/shared';

export const PRODUCT_QUERY_KEY = ['products'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetProductById(id: string) {
    return useQuery({
        queryKey: [...PRODUCT_QUERY_KEY, id],
        queryFn: () => productService.getProductById(id),
        enabled: Boolean(id),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

function applyProductMutationResult(queryClient: QueryClient, result: ProductMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...PRODUCT_QUERY_KEY, updated.id], updated);
    queryClient.invalidateQueries({ queryKey: [...PRODUCT_QUERY_KEY, 'paginated'] });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createMyProductVariantDtoType) =>
            productService.createMyProduct(CreateMyProductDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useSoftDeleteMyProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: softDeleteMyProductDtoType) =>
            productService.softDeleteMyProduct(softDeleteMyProductDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRecoverMyProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: recoverProductDtoType) =>
            productService.recoverMyProduct(recoverProductDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useBlockProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: blockProductDtoType) =>
            productService.blockProduct(blockProductDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useUnBlockProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: blockLiftProductDtoType) =>
            productService.unBlockProduct(blockLiftProductDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useMakeMyProductPublic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: productAppereanceDtoType) =>
            productService.makeMyProductPublic(productAppereanceDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useMakeMyProductPrivate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: productAppereanceDtoType) =>
            productService.makeMyProductPrivate(productAppereanceDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useUpdateMyProductMeta() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: updateProductMetaDtoType) =>
            productService.updateMyProductMeta(updateProductMetaDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useToggleMyProductDisclaimer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: toggleDiscalimerDtoType) =>
            productService.toggleMyProductDisclaimer(toggleDiscalimerDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductDisclaimers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: disclaimerItemsDtoType) =>
            productService.addMyProductDisclaimers(disclaimerItemsDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductDisclaimers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: disclaimerItemsDtoType) =>
            productService.removeMyProductDisclaimers(disclaimerItemsDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: imagesDtoType) =>
            productService.addMyProductImages(imagesDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useSetMyProductDefaultImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: deafultImageDtoType) =>
            productService.setMyProductDefaultImage(deafultImageDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: imagesDtoType) =>
            productService.removeMyProductImages(imagesDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useToggleMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: toggleIngredientsDtoType) =>
            productService.toggleMyProductIngredients(toggleIngredientsDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ingredientsDtotype) =>
            productService.addMyProductIngredients(ingredientsDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ingredientsDtotype) =>
            productService.removeMyProductIngredients(ingredientsDto.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}