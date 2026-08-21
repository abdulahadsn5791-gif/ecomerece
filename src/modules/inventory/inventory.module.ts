import { queryBus } from '../../core/domain/infrastructure/in-memory-query-bus';
import { InventoryApplicationService } from './application/inventory.app.service';
import { InventoryInternalServcie } from './application/inventory.internal.service';
import { VerifyInventoriesItemsGetQuery } from './application/queries/verify-inventories-items-get.query';
import { VerifyInventoriesItemsGetQueryHander } from './application/query-handlers/verify-inventories-items-get.query-handler';
import { InventoryReposityory } from './infrastructure/inventory.repository';
import { InventoryController } from './presentation/inventory.controller';

export function createInventoryModule() {
    const inventoryRepo = new InventoryReposityory();
    const inventoryInternalServcie = new InventoryInternalServcie(inventoryRepo);
    queryBus.register(
        VerifyInventoriesItemsGetQuery,
        new VerifyInventoriesItemsGetQueryHander(inventoryInternalServcie),
    );
    const inventoryApplicationService = new InventoryApplicationService(inventoryRepo, queryBus);
    const inventoryController = new InventoryController(inventoryApplicationService);

    return { inventoryController };
}
