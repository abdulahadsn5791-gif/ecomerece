import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, type Id } from '../../../value-objects';
import type { VerificationInfoVO } from '../value-objects/verification-info.vo';

export interface VendorVerificationPayload {
  vendorId: Id;
  verificationInfo: VerificationInfoVO;
}

export class VendorVerifiedEvent implements IEvent<VendorVerificationPayload> {
  readonly type = 'vendor.verified';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: VendorVerificationPayload) {}
}
