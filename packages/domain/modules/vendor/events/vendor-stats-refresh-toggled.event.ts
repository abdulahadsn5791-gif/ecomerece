import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate, type Id } from '../../../value-objects';

export class VendorStatsRefreshToggledEvent
  implements
    IEvent<{
      vendorId: Id;
      ownerId: Id;
      enabled: boolean;
    }>
{
  readonly type = 'vendor.stats-refresh-toggled';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: { vendorId: Id; ownerId: Id; enabled: boolean }) {}
}
