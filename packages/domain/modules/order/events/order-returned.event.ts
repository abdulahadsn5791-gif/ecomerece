import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { Reason } from '../../../../core/domain/value-objects/reason.vo';

export class OrderReturnedEvent implements IEvent<{ orderId: Id; actorId: Id; reason: Reason }> {
    readonly type = 'order.returnded';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { orderId: Id; actorId: Id; reason: Reason }) {}
}
