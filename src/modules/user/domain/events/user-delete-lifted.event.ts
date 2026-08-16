import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { DeleteInfoVO } from '../value-objects/delete-Info.vo';
export class UserDeleteLiftedEvent implements IEvent<{ userId: Id; recoverInfo: DeleteInfoVO }> {
    readonly type = 'user.delete-lifted';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { userId: Id; recoverInfo: DeleteInfoVO }) {}
}
