import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomePromoRemovedEvent implements IEvent<{ homeId: Id; promoId: Id }> {
    readonly type = 'home.promo-removed';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id; promoId: Id }) {}
}
