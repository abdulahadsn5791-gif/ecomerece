import type { IEvent, IEventHandler } from '@ecomerece/domain/events/event-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { UserInternalService } from '../user.internal.service';

interface VendorVerifiedPayload {
  ownerId: Id;
}

export class VendorVerifiedHandler implements IEventHandler<VendorVerifiedPayload> {
  constructor(private readonly internalSvc: UserInternalService) {}

  async handle(event: IEvent<VendorVerifiedPayload>): Promise<void> {
    await this.internalSvc.promoteToVendor(event.payload.ownerId);
  }
}
