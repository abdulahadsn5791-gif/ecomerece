import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';

export interface VendorRecoveredPayload {
    vendorId: Id;
    performedBy: Id;
}

export class VendorRecoverEvent implements IEvent<VendorRecoveredPayload> {
    readonly type = 'vendor.recovered';
    readonly occurredOn = new Date();

    constructor(public readonly payload: VendorRecoveredPayload) {}
}
