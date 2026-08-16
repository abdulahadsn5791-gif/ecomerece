import { IEvent } from "../../../../core/domain/events/event-bus.interface";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../../core/domain/value-objects/quantity.vo";
import { FullAddressVO } from "../../../../core/domain/value-objects/street-address.vo";

export class OrderCreatedEvent implements IEvent<{ orderId: Id, actorId: Id, price: Quantity, variantId: Id, address: FullAddressVO }> {
    readonly type = 'order.created';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { orderId: Id, actorId: Id, price: Quantity, variantId: Id, address: FullAddressVO }) { }
}
