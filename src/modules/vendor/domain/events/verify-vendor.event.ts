import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { VerificationInfoVO } from '../value-objects/verification-info.vo';

export interface VendorVerificationPayload {
    vendorId: Id;
    verificationInfo: VerificationInfoVO;
}

export class VendorVerifiedEvent implements IEvent<VendorVerificationPayload> {
    readonly type = 'vendor.verified';
    readonly occurredOn = new Date();

    constructor(public readonly payload: VendorVerificationPayload) {}
}
