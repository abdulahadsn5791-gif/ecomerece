import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductMadePrivateEvent implements IEvent<{ productId: Id }> {
    readonly type = 'product.made-private';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { productId: Id }) {}
}