import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class OrderItemCreatedEvent implements IEvent<{ orderItemId: Id; orderId: Id; variantId: Id; vendorId: Id }> {
    readonly type = 'order-item.created';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: { orderItemId: Id; orderId: Id; variantId: Id; vendorId: Id },
    ) {}
}