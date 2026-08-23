import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export class UserLoggedInEvent implements IEvent<{ userId: Id }> {
    readonly type = 'user.logged-in';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { userId: Id }) {}
}
