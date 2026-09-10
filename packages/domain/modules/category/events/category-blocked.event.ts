import { IEvent } from '../../../events/event-bus.interface';
import { BlockInfoVO, EffectiveDate, Id } from '../../../value-objects';

export class CategoryBlockedEvent
    implements IEvent<{ categoryId: Id; actorId: Id; blockInfo: BlockInfoVO }>
{
    readonly type = 'category.blocked';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: {
            categoryId: Id;
            actorId: Id;
            blockInfo: BlockInfoVO;
        },
    ) {}
}