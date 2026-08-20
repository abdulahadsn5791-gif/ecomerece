import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { OrderItem } from "../../../order/domain/value-objects/order-item.vo";
import { InventoryReadModel } from "../../domain/read-models/inventory.read-model";

export class VerifyInventoriesItemsGetQuery
    implements IQuery<{
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        availableStockIds: Id[];
        buyableIds: Id[];
        inventoriesReadModel: InventoryReadModel[];
    }> {
    readonly __result?: {
        validIds: Id[];
        notFoundIds: Id[];
        deletedIds: Id[];
        availableStockIds: Id[];
        buyableIds: Id[];
        inventoriesReadModel: InventoryReadModel[];
    };
    readonly type = 'VerifyInventoriesItemsGetQuery';
    public readonly payload: { inventoryItems: OrderItem[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ inventoryItems: OrderItem[] }];
        this.payload = payload;
    }
}