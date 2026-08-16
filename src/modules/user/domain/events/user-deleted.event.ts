import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

import type { DeleteInfoVO } from '../value-objects/delete-Info.vo';

export class UserDeletedEvent implements IEvent<{ userId: Id; deleteInfo: DeleteInfoVO }> {
    readonly type = 'user.deleted';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { userId: Id; deleteInfo: DeleteInfoVO }) {}
}
