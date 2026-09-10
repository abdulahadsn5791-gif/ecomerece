import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id, Quantity } from '../../../value-objects';

export class ReviewCreatedEvent
    implements IEvent<{ reviewId: Id; productId: Id; authorId: Id; rating: Quantity }>
{
    readonly type = 'review.created';
    readonly occurredOn = EffectiveDate.today();

    constructor(
        public readonly payload: { reviewId: Id; productId: Id; authorId: Id; rating: Quantity },
    ) {}
}