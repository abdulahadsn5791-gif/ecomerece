import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, type Id } from '../../../value-objects';

export interface VendorRecoveredPayload {
  vendorId: Id;
  performedBy: Id;
}

export class VendorRecoverEvent implements IEvent<VendorRecoveredPayload> {
  readonly type = 'vendor.recovered';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: VendorRecoveredPayload) {}
}
