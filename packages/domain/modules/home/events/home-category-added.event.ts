import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomeCategoryAddedEvent implements IEvent<{ homeId: Id; categoryId: Id }> {
    readonly type = 'home.category-added';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id; categoryId: Id }) {}
}
