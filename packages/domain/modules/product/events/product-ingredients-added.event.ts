import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductIngredientsAddedEvent
    implements IEvent<{ productId: Id; actorId: Id; items: string[] }>
{
    readonly type = 'product.ingredients-added';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { productId: Id; actorId: Id; items: string[] }) {}
}