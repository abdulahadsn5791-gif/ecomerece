import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductVariantActivatedEvent
    implements IEvent<{ variantId: Id; productId: Id; actorId: Id }>
{
    readonly type = 'product-variant.activated';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { variantId: Id; productId: Id; actorId: Id }) {}
}