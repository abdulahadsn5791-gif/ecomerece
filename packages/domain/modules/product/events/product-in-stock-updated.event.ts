import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ProductInStockUpdatedEvent implements IEvent<{ productId: Id; actorId: Id; inStock: boolean }> {
    readonly type = 'product.in-stock-updated';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { productId: Id; actorId: Id; inStock: boolean }) {}
}