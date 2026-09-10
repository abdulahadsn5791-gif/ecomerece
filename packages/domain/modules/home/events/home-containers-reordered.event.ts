import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomeContainersReorderedEvent implements IEvent<{ homeId: Id }> {
    readonly type = 'home.containers-reordered';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id }) {}
}
