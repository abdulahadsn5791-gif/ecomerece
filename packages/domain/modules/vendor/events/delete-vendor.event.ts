import type { IEvent } from '../../../events/event-bus.interface';
import { type DeleteInfoVO, EffectiveDate, type Id } from '../../../value-objects';
export interface VendorDeletedPayload {
  vendorId: Id;
  deletionInfo: DeleteInfoVO;
}

export class VendorDeletedEvent implements IEvent<VendorDeletedPayload> {
  readonly type = 'vendor.deleted';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: VendorDeletedPayload) {}
}
