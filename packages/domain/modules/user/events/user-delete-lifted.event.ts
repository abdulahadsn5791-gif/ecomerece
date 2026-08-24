import { IEvent } from "../../../events/event-bus.interface";
import { DeleteInfoVO, EffectiveDate, Id } from "../../../value-objects";


export class UserDeleteLiftedEvent implements IEvent<{ userId: Id; recoverInfo: DeleteInfoVO }> {
    readonly type = 'user.delete-lifted';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { userId: Id; recoverInfo: DeleteInfoVO }) { }
}
