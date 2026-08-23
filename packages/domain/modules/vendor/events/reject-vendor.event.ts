import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { VerificationInfoVO } from '../value-objects/verification-info.vo';

export interface VendorRejectionPayload {
    vendorId: Id;
    rejectionInfo: VerificationInfoVO;
}

export class VendorVerificationRejectedEvent implements IEvent<VendorRejectionPayload> {
    readonly type = 'vendor.rejected';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: VendorRejectionPayload) {}
}
