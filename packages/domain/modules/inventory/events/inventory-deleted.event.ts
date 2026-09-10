import { IEvent } from '../../../events/event-bus.interface';
import { DeleteInfoVO, EffectiveDate, Id } from '../../../value-objects';

export class InventoryDeletedEvent
    implements IEvent<{ inventoryId: Id; variantId: Id; actorId: Id; deletionInfo: DeleteInfoVO }>
{
    readonly type = 'inventory.deleted';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: {
            inventoryId: Id;
            variantId: Id;
            actorId: Id;
            deletionInfo: DeleteInfoVO;
        },
    ) {}
}