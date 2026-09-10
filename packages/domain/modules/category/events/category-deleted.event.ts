import { IEvent } from '../../../events/event-bus.interface';
import { DeleteInfoVO, EffectiveDate, Id } from '../../../value-objects';

export class CategoryDeletedEvent
    implements IEvent<{ categoryId: Id; actorId: Id; deletionInfo: DeleteInfoVO }>
{
    readonly type = 'category.deleted';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: {
            categoryId: Id;
            actorId: Id;
            deletionInfo: DeleteInfoVO;
        },
    ) {}
}