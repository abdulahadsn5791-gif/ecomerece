import { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, Id } from '../../../value-objects';

export class CategoryCreatedEvent implements IEvent<{ categoryId: Id; createdBy: Id }> {
    readonly type = 'category.created';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: { categoryId: Id; createdBy: Id }) {}
}