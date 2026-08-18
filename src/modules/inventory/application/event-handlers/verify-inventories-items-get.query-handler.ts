import { Id } from "../../../../core/domain/value-objects/id.vo";
import { InventoryAggregate } from "../../domain/inventory.aggregate";
import { InventoryInternalServcie } from "../inventory.internal.service";
import { VerifyInventoriesItemsGetQuery } from "../queries/verify-inventories-items-get.query";



export class VerifyInventoriesItemsGetQueryHander {
    readonly type = 'EnsureActiveAddressGetByIdQuery';
    constructor(private readonly internalService: InventoryInternalServcie) { }
    async handle(
        query: VerifyInventoriesItemsGetQuery,
    ): Promise<{ invalidIds: Id[], validIds: Id[], availableStockIds: Id[], buyableIds: Id[], inventories: InventoryAggregate[] }> {
        return await this.internalService.verifyInventoriesItemsGet(query.payload.inventoryItems);
    }
}
