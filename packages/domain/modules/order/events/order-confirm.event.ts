import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export class OrderConfirmedEvent implements IEvent<{ orderId: Id; actorId: Id }> {
    readonly type = 'order.confirmed';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { orderId: Id; actorId: Id }) {}
}
