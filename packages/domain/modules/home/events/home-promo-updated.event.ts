import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class HomePromoUpdatedEvent implements IEvent<{ homeId: Id; promoId: Id }> {
    readonly type = 'home.promo-updated';
    readonly occurredOn = EffectiveDate.today();
    constructor(public readonly payload: { homeId: Id; promoId: Id }) {}
}
