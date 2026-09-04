// inventory.hook.ts
import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { inventoryService, type InventoryMutationResult } from './inventory.service';
import {

    type createMyInventoryDtoType,
    type buyMyInventoryStockDtoType,
    type removeMyInventoryStockDtoType,
    type updateMylowStockThresholdDtoType,
    type InventoryResponseReadModel,
    createMyInventoryDto,
    buyMyInventoryStockDto,
    removeMyInventoryStockDto,
    updateMylowStockThresholdDto,
} from '@ecomerece/shared';

export const INVENTORY_QUERY_KEY = ['inventory'];

// ── Queries ─────────────────────────────────────────────────────────────────

export function useGetInventoryByVariantId(variantId: string) {
    return useQuery({
        queryKey: [...INVENTORY_QUERY_KEY, 'variant', variantId],
        queryFn: () => inventoryService.getInventoryByVariantId(variantId),
        enabled: Boolean(variantId),
    });
}

// ── Shared cache-update helper ───────────────────────────────────────────────

function applyInventoryMutationResult(queryClient: QueryClient, result: InventoryMutationResult) {
    const updated = result.updatedData;

    if (!updated) {
        queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
        return;
    }

    queryClient.setQueryData([...INVENTORY_QUERY_KEY, updated.id], updated);
    queryClient.setQueryData([...INVENTORY_QUERY_KEY, 'variant', updated.variantId], updated);
}

// ── Mutations ───────────────────────────────────────────────────────────────

export function useCreateMyInventory() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: createMyInventoryDtoType) =>
            inventoryService.createMyInventory(createMyInventoryDto.parse(data)),
        onSuccess: (data) => applyInventoryMutationResult(queryClient, data),
    });
}

export function useBuyMyInventoryStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: buyMyInventoryStockDtoType }) =>
            inventoryService.buyMyInventoryStock(id, buyMyInventoryStockDto.parse(data)),
        onSuccess: (data) => applyInventoryMutationResult(queryClient, data),
    });
}

export function useRemoveMyInventoryStock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: removeMyInventoryStockDtoType }) =>
            inventoryService.removeMyInventoryStock(id, removeMyInventoryStockDto.parse(data)),
        onSuccess: (data) => applyInventoryMutationResult(queryClient, data),
    });
}

export function useUpdateMyLowStockThreshold() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: updateMylowStockThresholdDtoType }) =>
            inventoryService.updateMyLowStockThreshold(id, updateMylowStockThresholdDto.parse(data)),
        onSuccess: (data) => applyInventoryMutationResult(queryClient, data),
    });
}