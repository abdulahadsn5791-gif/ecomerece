import { eventBus } from '../../core/infrastructure/buses/in-memory-event-bus';
import { CategoryStatsDenormalizationHandler } from './application/event-handlers/category-stats-denormalization.handler';
import { OrderItemCreatedStatsHandler } from './application/event-handlers/order-item-created.stats-handler';
import { ProductStatsDenormalizationHandler } from './application/event-handlers/product-stats-denormalization.handler';
import { VendorStatsDenormalizationHandler } from './application/event-handlers/vendor-stats-denormalization.handler';
import { VendorStatsForceRefreshHandler } from './application/event-handlers/vendor-stats-force-refresh.handler';
import { StatsController } from './presentation/StatsController';

export function CreateStatsModule() {
  eventBus.register('order-item.created', new OrderItemCreatedStatsHandler());
  eventBus.register(
    'stats.product-denormalization-requested',
    new ProductStatsDenormalizationHandler(),
  );
  eventBus.register(
    'stats.product-denormalization-requested',
    new CategoryStatsDenormalizationHandler(),
  );
  eventBus.register(
    'stats.product-denormalization-requested',
    new VendorStatsDenormalizationHandler(),
  );
  eventBus.register('stats.vendor-force-refresh-requested', new VendorStatsForceRefreshHandler());

  const statsController = new StatsController();

  return { statsController };
}
