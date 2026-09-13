import { eventBus } from '../../core/infrastructure/buses/in-memory-event-bus';
import { OrderItemCreatedStatsHandler } from './application/event-handlers/order-item-created.stats-handler';
import { ProductStatsDenormalizationHandler } from './application/event-handlers/product-stats-denormalization.handler';
import { StatsController } from './presentation/StatsController';

export function CreateStatsModule() {
  eventBus.register('order-item.created', new OrderItemCreatedStatsHandler());
  eventBus.register(
    'stats.product-denormalization-requested',
    new ProductStatsDenormalizationHandler(),
  );

  const statsController = new StatsController();

  return { statsController };
}
