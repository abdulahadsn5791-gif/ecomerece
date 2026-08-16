import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { BanInfoVO } from '../value-objects/ban-info.vo';

export class UserBannedEvent implements IEvent<{ userId: Id; banInfo: BanInfoVO }> {
    readonly type = 'user.banned';
    readonly occurredOn = EffectiveDate.today()
    constructor(public readonly payload: { userId: Id; banInfo: BanInfoVO }) { }
}
