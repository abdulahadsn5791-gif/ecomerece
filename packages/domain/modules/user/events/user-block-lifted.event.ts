import { IEvent } from "../../../events/event-bus.interface";
import { BlockInfoVO, EffectiveDate, Id } from "../../../value-objects";


export class UserUnBlockLiftedEvent implements IEvent<{ userId: Id; blockInfo: BlockInfoVO }> {
    readonly type = 'user.block-lifted';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { userId: Id; blockInfo: BlockInfoVO }) { }
}
