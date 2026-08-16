import { queryBus } from "../../core/domain/infrastructure/in-memory-query-bus";
import { InventoryApplicationService } from "./application/inventory.app.service";
import { InventoryReposityory } from "./infrastructure/inventory.repository";
import { InventoryController } from "./presentation/inventory.controller";

export function createInventoryModule() {

    const inventoryRepo = new InventoryReposityory();
    const inventoryApplicationService = new InventoryApplicationService(inventoryRepo, queryBus);
    const inventoryController = new InventoryController(inventoryApplicationService);

    return { inventoryController };


}