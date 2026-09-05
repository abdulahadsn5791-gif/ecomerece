// product-variant.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { productVariantService, type ProductVariantMutationResult } from './product-variant.service';
import {

    type ProductVariantResponseReadModel,
    createMyProductVariantDto,
    createMyProductVariantDtoType,
    softDeleteMyVariantDto,
    toggleVariantApperaaracneDto,
    updateMyVariatPriceDtoType,
    upadteMyVariantMetaDtoType,
    toggleVariantApperaaracneDtoType,
    softDeleteMyVariantDtoType,
    upadteMyVariantMetaDto,
    updateMyVariatPriceDto,
} from '@ecomerece/shared';

export const PRODUCT_VARIANT_QUERY_KEY = ['product-variants'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetVariantsByProductId(productId: string) {
    return useQuery({
        queryKey: [...PRODUCT_VARIANT_QUERY_KEY, 'product', productId],
        queryFn: () => productVariantService.getVariantsByProductId(productId),
        enabled: Boolean(productId),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

function applyProductVariantMutationResult(
    queryClient: QueryClient,
    result: ProductVariantMutationResult,
) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANT_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...PRODUCT_VARIANT_QUERY_KEY, updated.id], updated);
    queryClient.invalidateQueries({
        queryKey: [...PRODUCT_VARIANT_QUERY_KEY, 'product', updated.productId],
    });
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyProductVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createMyProductVariantDtoType) =>
            productVariantService.createMyProductVariant(createMyProductVariantDto.parse(data)),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}

export function useUpdateMyVariantPrice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: updateMyVariatPriceDtoType) =>
            productVariantService.updateMyVariantPrice(updateMyVariatPriceDto.parse(data)),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}

export function useUpdateMyVariantMeta() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: upadteMyVariantMetaDtoType) =>
            productVariantService.updateMyVariantMeta(upadteMyVariantMetaDto.parse(data)),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}

export function useToggleMyVariantAppearance() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: toggleVariantApperaaracneDtoType) =>
            productVariantService.toggleMyVariantAppearance(
                toggleVariantApperaaracneDto.parse(data),
            ),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}

export function useSoftDeleteMyVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: softDeleteMyVariantDtoType) =>
            productVariantService.softDeleteMyVariant(softDeleteMyVariantDto.parse(data)),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}

export function useRecoverVariant() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productVariantService.recoverVariant(id),
        onSuccess: (data) => applyProductVariantMutationResult(queryClient, data),
    });
}