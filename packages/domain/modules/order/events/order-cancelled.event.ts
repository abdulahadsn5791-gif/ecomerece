import { IEvent } from "../../../events/event-bus.interface";
import { EffectiveDate, Id, Reason } from "../../../value-objects";


export class OrderCancelledEvent implements IEvent<{ orderId: Id; actorId: Id; reason: Reason }> {
    readonly type = 'order.cancelled';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { orderId: Id; actorId: Id; reason: Reason }) { }
}
