import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomeSlidesReorderedEvent implements IEvent<{ homeId: Id }> {
    readonly type = 'home.slides-reordered';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id }) {}
}
