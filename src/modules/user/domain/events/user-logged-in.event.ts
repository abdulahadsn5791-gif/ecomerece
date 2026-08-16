import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export class UserLoggedInEvent implements IEvent<{ userId: Id }> {
    readonly type = 'user.logged-in';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { userId: Id }) {}
}
