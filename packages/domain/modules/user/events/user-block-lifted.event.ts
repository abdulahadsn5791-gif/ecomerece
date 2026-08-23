import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { BlockInfoVO } from '../value-objects/block-info.vo';

export class UserUnBlockLiftedEvent implements IEvent<{ userId: Id; blockInfo: BlockInfoVO }> {
    readonly type = 'user.block-lifted';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { userId: Id; blockInfo: BlockInfoVO }) {}
}
