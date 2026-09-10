import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id, Quantity } from '../../../value-objects';

export class InventoryReservedEvent
    implements IEvent<{ inventoryId: Id; variantId: Id; quantity: Quantity }>
{
    readonly type = 'inventory.reserved';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: { inventoryId: Id; variantId: Id; quantity: Quantity },
    ) {}
}