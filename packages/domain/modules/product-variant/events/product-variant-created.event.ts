import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductVariantCreatedEvent implements IEvent<{ variantId: Id; productId: Id }> {
    readonly type = 'product-variant.created';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { variantId: Id; productId: Id }) {}
}