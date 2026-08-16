import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { DeleteInfoVO } from '../value-objects/delete-info.vo';

export interface VendorDeletedPayload {
    vendorId: Id;
    deletionInfo: DeleteInfoVO;
}

export class VendorDeletedEvent implements IEvent<VendorDeletedPayload> {
    readonly type = 'vendor.deleted';
    readonly occurredOn = EffectiveDate.today()

    constructor(public readonly payload: VendorDeletedPayload) { }
}
