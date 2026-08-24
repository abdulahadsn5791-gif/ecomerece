import { IEvent } from "../../../events/event-bus.interface";
import { EffectiveDate, Id, Slug, Title } from "../../../value-objects";


export interface VendorCreatedPayload {
    vendorId: Id;
    ownerId: Id;
    title: Title;
    slug: Slug;
}

export class VendorCreatedEvent implements IEvent<VendorCreatedPayload> {
    readonly type = 'vendor.created';
    readonly occurredOn = EffectiveDate.today();

    constructor(public readonly payload: VendorCreatedPayload) { }
}
