import { Id } from "../../../core/domain/value-objects/id.vo";
import { BaseService } from "../../../core/services/base.services";
import { OrderItem } from "../../order/domain/value-objects/order-item.vo";
import { InventoryAggregate } from "../domain/inventory.aggregate";
import { InventoryReposityory } from "../infrastructure/inventory.repository";

export class InventoryInternalServcie extends BaseService {
    constructor(private readonly inventoryRepo: InventoryReposityory) { super(); }

    async verifyInventoriesItemsGet(inventoryItems: OrderItem[]): Promise<{ invalidIds: Id[], validIds: Id[], availableStockIds: Id[], buyableIds: Id[], inventories: InventoryAggregate[] }> {
        const variantIds = inventoryItems.map(item => Id.create(item.variantId.value));
        const inventories = await this.inventoryRepo.FindByVariantIds(variantIds);
        const inventoryVariantIdSet = new Set(inventories.map(inv => inv.variantId.value));
        const invalidIds = variantIds.filter(id => !inventoryVariantIdSet.has(id.value));
        const validIds = variantIds.filter(id => inventoryVariantIdSet.has(id.value));
        const availableStockIds = [...new Set(inventories
            .filter(inv => inv.available.value > 0)
            .map(inv => Id.create(inv.variantId.value))
        )];
        const buyableIds = availableStockIds;
        return { invalidIds, validIds, availableStockIds, buyableIds, inventories };
    }

}