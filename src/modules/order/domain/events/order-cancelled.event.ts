import { IEvent } from "../../../../core/domain/events/event-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { Reason } from "../../../../core/domain/value-objects/reason.vo";

export class OrderCancelledEvent implements IEvent<{ orderId: Id, actorId: Id, reason: Reason }> {
    readonly type = 'order.cancelled';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { orderId: Id, actorId: Id, reason: Reason }) { }
}
