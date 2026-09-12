import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, type Id } from '../../../value-objects';

export class VendorMetaUpdatedEvent implements IEvent<{ vendorId: Id; ownerId: Id }> {
  readonly type = 'vendor.meta-updated';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: { vendorId: Id; ownerId: Id }) {}
}
