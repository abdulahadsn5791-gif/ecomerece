import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { RoleInfoVO } from '../value-objects/role-info.vo';
export class UserRoleAssignedEvent implements IEvent<{ userId: Id; roleInfo: RoleInfoVO }> {
    readonly type = 'user.role-assigned';
    readonly occurredOn = EffectiveDate.today()
    constructor(public readonly payload: { userId: Id; roleInfo: RoleInfoVO }) { }
}
