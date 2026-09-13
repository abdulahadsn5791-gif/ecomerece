import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate } from '../../../value-objects';

export class VendorStatsForceRefreshRequestedEvent
  implements
    IEvent<{
      vendorId: string;
      force: boolean;
    }>
{
  readonly type = 'stats.vendor-force-refresh-requested';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: { vendorId: string; force: boolean }) {}
}
