// inventory.service.ts
import { http } from './../../lib';
import type {
    InventoryResponseReadModel,
    createMyInventoryDtoType,
    buyMyInventoryStockDtoType,
    removeMyInventoryStockDtoType,
    updateMylowStockThresholdDtoType,
} from '@ecomerece/shared';

export type InventoryMutationResult = {
    message: string;
    updatedData?: InventoryResponseReadModel;
};

export class InventoryService {
    getInventoryByVariantId(variantId: string): Promise<InventoryResponseReadModel> {
        return http.get<InventoryResponseReadModel>(`/inventory/variant/${variantId}`);
    }

    createMyInventory(data: createMyInventoryDtoType): Promise<InventoryMutationResult> {
        return http.post<InventoryMutationResult>('/inventory/me', data);
    }

    buyMyInventoryStock(id: string, data: buyMyInventoryStockDtoType): Promise<InventoryMutationResult> {
        return http.patch<InventoryMutationResult>(`/inventory/me/${id}/buy`, data);
    }

    removeMyInventoryStock(id: string, data: removeMyInventoryStockDtoType): Promise<InventoryMutationResult> {
        return http.patch<InventoryMutationResult>(`/inventory/me/${id}/remove`, data);
    }

    updateMyLowStockThreshold(id: string, data: updateMylowStockThresholdDtoType): Promise<InventoryMutationResult> {
        return http.patch<InventoryMutationResult>(`/inventory/me/${id}/threshold`, data);
    }
}

export const inventoryService = new InventoryService();