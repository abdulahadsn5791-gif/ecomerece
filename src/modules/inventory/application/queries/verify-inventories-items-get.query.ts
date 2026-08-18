import { IQuery } from "../../../../core/domain/query/query-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { OrderItem } from "../../../order/domain/value-objects/order-item.vo";
import { InventoryAggregate } from "../../domain/inventory.aggregate";

export class VerifyInventoriesItemsGetQuery
    implements IQuery<{ invalidIds: Id[], validIds: Id[], availableStockIds: Id[], buyableIds: Id[], inventories: InventoryAggregate[] }> {
    readonly __result?: { invalidIds: Id[], validIds: Id[], availableStockIds: Id[], buyableIds: Id[], inventories: InventoryAggregate[] };
    readonly type = 'VerifyInventoriesItemsGetQuery';
    public readonly payload: { inventoryItems: OrderItem[] };

    constructor(...args: unknown[]) {
        const [payload] = args as [{ inventoryItems: OrderItem[] }];
        this.payload = payload;
    }
}