import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { VerificationInfoVO } from '../value-objects/verification-info.vo';

export interface VendorRejectionPayload {
    vendorId: Id;
    rejectionInfo: VerificationInfoVO;
}

export class VendorVerificationRejectedEvent implements IEvent<VendorRejectionPayload> {
    readonly type = 'vendor.rejected';
    readonly occurredOn = new Date();

    constructor(public readonly payload: VendorRejectionPayload) {}
}
