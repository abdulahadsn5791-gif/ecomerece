import type { IEvent } from '../../../events/event-bus.interface';
import { EffectiveDate } from '../../../value-objects';

export class ProductStatsDenormalizationRequestedEvent
  implements
    IEvent<{
      force: boolean;
    }>
{
  readonly type = 'stats.product-denormalization-requested';
  readonly occurredOn = EffectiveDate.today();

  constructor(public readonly payload: { force: boolean }) {}
}
