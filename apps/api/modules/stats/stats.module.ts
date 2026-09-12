import { eventBus } from '../../core/infrastructure/buses/in-memory-event-bus';
import { redis } from '../../lib/redis';
import { CategoryRepository } from '../category/infrastructure/category.repository';
import { ProductRepository } from '../product/infrastructure/product.repository';
import { OrderItemCreatedStatsHandler } from './application/event-handlers/order-item-created.stats-handler';
import { StatsViewGuard } from './application/StatsViewGuard';
import { StatsController } from './presentation/StatsController';

export function CreateStatsModule() {
  eventBus.register('order-item.created', new OrderItemCreatedStatsHandler());

  const viewGuard = new StatsViewGuard({
    redis,
    productRepo: new ProductRepository(),
    categoryRepo: new CategoryRepository(),
  });
  const statsController = new StatsController(viewGuard);

  return { statsController };
}
