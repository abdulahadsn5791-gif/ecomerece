import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductVariantDeactivatedEvent
    implements IEvent<{ variantId: Id; productId: Id; actorId: Id }>
{
    readonly type = 'product-variant.deactivated';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { variantId: Id; productId: Id; actorId: Id }) {}
}