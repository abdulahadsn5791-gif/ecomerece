import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductDisclaimerDisabledEvent implements IEvent<{ productId: Id; actorId: Id }> {
    readonly type = 'product.disclaimer-disabled';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { productId: Id; actorId: Id }) {}
}