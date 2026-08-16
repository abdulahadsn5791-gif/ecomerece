import { EffectiveDate } from "../../../core/domain/value-objects/effective-date.vo"
import { Id } from "../../../core/domain/value-objects/id.vo"
import { Quantity } from "../../../core/domain/value-objects/quantity.vo"
import { InventoryResponseReadModel } from "../domain/read-models/inventory.response-read-model"

export type inventoryMessagesType = {
    updatedData?: InventoryResponseReadModel,
    message: string
}
export const InventoryMessages = {

    inventoryCreated(inventoryId: Id, actorId: Id, inventory: InventoryResponseReadModel): inventoryMessagesType {
        return { updatedData: inventory, message: `Inventory ${inventoryId.value} has been created by ${actorId.value} on ${EffectiveDate.today().value}` };

    },
    inventoryBought(inventoryId: Id, items: Quantity, actorId: Id, inventory: InventoryResponseReadModel): inventoryMessagesType {
        return {
            updatedData: inventory,
            message: `Inventory ${inventoryId.value} has been bought by ${actorId.value} if (quantity: ${items.value}) units on ${EffectiveDate.today().value}.`
        };
    },
    inventoryRemoved(inventoryId: Id, items: Quantity, actorId: Id, inventory: InventoryResponseReadModel): inventoryMessagesType {
        return {
            updatedData: inventory,
            message: `Inventory ${inventoryId.value} has been removed by ${actorId.value} if (quantity: ${items.value}) units on ${EffectiveDate.today().value}.`
        };
    },
    lowStockThresholdUpdated(inventoryId: Id, items: Quantity, actorId: Id, inventory: InventoryResponseReadModel): inventoryMessagesType {
        return {
            updatedData: inventory,
            message: `LowStockThreshold has been updated to (quantity: ${items.value}) for inventory ${inventoryId.value}  by ${actorId.value}  on ${EffectiveDate.today().value}.`
        };
    }



}