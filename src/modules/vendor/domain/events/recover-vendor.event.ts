import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import { EffectiveDate } from '../../../../core/domain/value-objects/effective-date.vo';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export interface VendorRecoveredPayload {
    vendorId: Id;
    performedBy: Id;
}

export class VendorRecoverEvent implements IEvent<VendorRecoveredPayload> {
    readonly type = 'vendor.recovered';
    readonly occurredOn = EffectiveDate.today()

    constructor(public readonly payload: VendorRecoveredPayload) { }
}
