import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomeFeaturesSetEvent implements IEvent<{ homeId: Id }> {
    readonly type = 'home.features-set';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id }) {}
}
