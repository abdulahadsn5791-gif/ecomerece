import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export class UserSignedInEvent implements IEvent<{ userId: Id }> {
    readonly type = 'user.signed-in';
    readonly occurredOn = new Date();

    constructor(public readonly payload: { userId: Id }) {}
}
