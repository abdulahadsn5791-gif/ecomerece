import { IEvent } from '../../../events/event-bus.interface';
import { Description, EffectiveDate, Id } from '../../../value-objects';

export class ReviewVendorReplyAddedEvent
    implements IEvent<{ reviewId: Id; productId: Id; reply: Description }>
{
    readonly type = 'review.vendor-reply-added';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { reviewId: Id; productId: Id; reply: Description }) {}
}