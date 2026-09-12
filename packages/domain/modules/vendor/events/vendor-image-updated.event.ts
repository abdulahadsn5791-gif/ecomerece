import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, type Id } from '../../../value-objects';

export class VendorImageUpdatedEvent implements IEvent<{ vendorId: Id; ownerId: Id }> {
  readonly type = 'vendor.image-updated';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: { vendorId: Id; ownerId: Id }) {}
}
