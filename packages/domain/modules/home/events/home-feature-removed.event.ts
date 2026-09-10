import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomeFeatureRemovedEvent implements IEvent<{ homeId: Id; featureId: Id }> {
    readonly type = 'home.feature-removed';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id; featureId: Id }) {}
}
