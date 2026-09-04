// product.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { productService, type ProductMutationResult } from './product.service';
import {

    type CreateMyProductDto,
    type softDeleteMyProductDtoType,
    type recoverProductDtoType,
    type blockProductDtoType,
    type blockLiftProductDtoType,
    type productAppereanceDtoType,
    type updateProductMetaDtoType,
    type toggleDiscalimerDtoType,
    type disclaimerItemsDtoType,
    type imagesDtoType,
    type deafultImageDtoType,
    type toggleIngredientsDtoType,
    type ingredientsDtotype,
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
        mutationFn: (data: CreateMyProductDto) =>
            productService.createMyProduct(CreateMyProductSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useSoftDeleteMyProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: softDeleteMyProductDtoType) =>
            productService.softDeleteMyProduct(softDeleteMyProductDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRecoverMyProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: recoverProductDtoType) =>
            productService.recoverMyProduct(recoverProductDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useBlockProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: blockProductDtoType) =>
            productService.blockProduct(blockProductDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useUnBlockProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: blockLiftProductDtoType) =>
            productService.unBlockProduct(blockLiftProductDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useMakeMyProductPublic() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: productAppereanceDtoType) =>
            productService.makeMyProductPublic(productAppereanceDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useMakeMyProductPrivate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: productAppereanceDtoType) =>
            productService.makeMyProductPrivate(productAppereanceDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useUpdateMyProductMeta() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: updateProductMetaDtoType) =>
            productService.updateMyProductMeta(updateProductMetaDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useToggleMyProductDisclaimer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: toggleDiscalimerDtoType) =>
            productService.toggleMyProductDisclaimer(toggleDiscalimerDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductDisclaimers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: disclaimerItemsDtoType) =>
            productService.addMyProductDisclaimers(disclaimerItemsDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductDisclaimers() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: disclaimerItemsDtoType) =>
            productService.removeMyProductDisclaimers(disclaimerItemsDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: imagesDtoType) =>
            productService.addMyProductImages(imagesDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useSetMyProductDefaultImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: deafultImageDtoType) =>
            productService.setMyProductDefaultImage(deafultImageDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: imagesDtoType) =>
            productService.removeMyProductImages(imagesDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useToggleMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: toggleIngredientsDtoType) =>
            productService.toggleMyProductIngredients(toggleIngredientsDtoSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useAddMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ingredientsDtotype) =>
            productService.addMyProductIngredients(ingredientsDtotypeSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}

export function useRemoveMyProductIngredients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ingredientsDtotype) =>
            productService.removeMyProductIngredients(ingredientsDtotypeSchema.parse(data)),
        onSuccess: (data) => applyProductMutationResult(queryClient, data),
    });
}