import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { BanInfoVO } from '../value-objects/ban-info.vo';

export class UserBanLiftedEvent implements IEvent<{ userId: Id; banInfo: BanInfoVO }> {
    readonly type = 'user.ban-lifted';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { userId: Id; banInfo: BanInfoVO }) {}
}
