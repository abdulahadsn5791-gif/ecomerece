import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class ReviewDislikedEvent implements IEvent<{ reviewId: Id }> {
    readonly type = 'review.disliked';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { reviewId: Id }) {}
}