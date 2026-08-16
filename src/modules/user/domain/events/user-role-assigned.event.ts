import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { RoleInfoVO } from '../value-objects/role-info.vo';
export class UserRoleAssignedEvent implements IEvent<{ userId: Id; roleInfo: RoleInfoVO }> {
    readonly type = 'user.role-assigned';
    readonly occurredOn = new Date();
    constructor(public readonly payload: { userId: Id; roleInfo: RoleInfoVO }) {}
}
