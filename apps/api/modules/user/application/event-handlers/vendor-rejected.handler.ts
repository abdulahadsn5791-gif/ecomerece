import type { IEvent, IEventHandler } from '@ecomerece/domain/events/event-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { UserInternalService } from '../user.internal.service';

interface VendorRejectedPayload {
  ownerId: Id;
}

export class VendorRejectedHandler implements IEventHandler<VendorRejectedPayload> {
  constructor(private readonly internalSvc: UserInternalService) {}

  async handle(event: IEvent<VendorRejectedPayload>): Promise<void> {
    await this.internalSvc.demoteToCustomer(event.payload.ownerId);
  }
}
