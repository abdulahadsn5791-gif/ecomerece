import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductIngredientsDisabledEvent implements IEvent<{ productId: Id; actorId: Id }> {
    readonly type = 'product.ingredients-disabled';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { productId: Id; actorId: Id }) {}
}