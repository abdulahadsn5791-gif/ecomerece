import type { IEvent, IEventHandler } from '@ecomerece/domain/events/event-bus.interface';
import type { Id } from '@ecomerece/domain/value-objects/id.vo';
import type { UserInternalService } from '../user.internal.service';

interface VendorDeletedPayload {
  ownerId: Id;
}

export class VendorDeletedHandler implements IEventHandler<VendorDeletedPayload> {
  constructor(private readonly internalSvc: UserInternalService) {}

  async handle(event: IEvent<VendorDeletedPayload>): Promise<void> {
    await this.internalSvc.demoteToCustomer(event.payload.ownerId);
  }
}
