import { IEvent } from "../../../events/event-bus.interface";
import { DeleteInfoVO, EffectiveDate, Id } from "../../../value-objects";


export class UserDeletedEvent implements IEvent<{ userId: Id; deleteInfo: DeleteInfoVO }> {
    readonly type = 'user.deleted';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { userId: Id; deleteInfo: DeleteInfoVO }) { }
}
