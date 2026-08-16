import { Hono } from "hono";
import { createInventoryModule } from "../inventory.module";
import { authMiddleware } from "../../../middleware/auth";

export const inventoryRoutes = new Hono()

const { inventoryController } = createInventoryModule()

inventoryRoutes.get('/:id', inventoryController.getInventoryByVarientId);
inventoryRoutes.post('/create', authMiddleware, inventoryController.createMyInventory);
inventoryRoutes.patch('/:id/purchase', authMiddleware, inventoryController.buyMyInventory);
inventoryRoutes.patch('/:id/low-stock-threshold', authMiddleware, inventoryController.updateMylowStockThreshold);
inventoryRoutes.patch('/:id/remove', authMiddleware, inventoryController.removeMyInventoryStock);
