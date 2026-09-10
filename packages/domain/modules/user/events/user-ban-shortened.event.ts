import { IEvent } from '../../../events/event-bus.interface';
import { BanInfoVO, EffectiveDate, Id } from '../../../value-objects';

export class UserBanShortenedEvent implements IEvent<{ userId: Id; banInfo: BanInfoVO }> {
    readonly type = 'user.ban-shortened';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { userId: Id; banInfo: BanInfoVO }) {}
}