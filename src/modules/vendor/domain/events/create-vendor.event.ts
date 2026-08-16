import type { IEvent } from '../../../../core/domain/events/event-bus.interface';
import type { Id } from '../../../../core/domain/value-objects/id.vo';
import type { Slug } from '../../../../core/domain/value-objects/slug.vo';
import type { Title } from '../../../../core/domain/value-objects/title.vo';

export interface VendorCreatedPayload {
    vendorId: Id;
    ownerId: Id;
    title: Title;
    slug: Slug;
}

export class VendorCreatedEvent implements IEvent<VendorCreatedPayload> {
    readonly type = 'vendor.created';
    readonly occurredOn = new Date();

    constructor(public readonly payload: VendorCreatedPayload) {}
}
