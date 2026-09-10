import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class AddressRecoveredEvent implements IEvent<{ addressId: Id; ownerId: Id; actorId: Id }> {
    readonly type = 'address.recovered';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { addressId: Id; ownerId: Id; actorId: Id }) {}
}