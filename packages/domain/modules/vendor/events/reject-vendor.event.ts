import { IEvent } from "../../../events/event-bus.interface";
import { EffectiveDate, Id, } from "../../../value-objects";
import type { VerificationInfoVO } from '../value-objects/verification-info.vo';

export interface VendorRejectionPayload {
    vendorId: Id;
    rejectionInfo: VerificationInfoVO;
}

export class VendorVerificationRejectedEvent implements IEvent<VendorRejectionPayload> {
    readonly type = 'vendor.rejected';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: VendorRejectionPayload) { }
}
