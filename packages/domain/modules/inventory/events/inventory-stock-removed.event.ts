import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id, Quantity } from '../../../value-objects';

export class InventoryStockRemovedEvent
    implements IEvent<{ inventoryId: Id; variantId: Id; quantity: Quantity }>
{
    readonly type = 'inventory.stock-removed';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: { inventoryId: Id; variantId: Id; quantity: Quantity },
    ) {}
}