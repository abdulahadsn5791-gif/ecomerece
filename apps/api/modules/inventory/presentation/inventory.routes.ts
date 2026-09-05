import { Hono } from 'hono';
import { authMiddleware } from '../../../middleware/auth';
import { createInventoryModule } from '../inventory.module';

export const inventoryRoutes = new Hono();

const { inventoryController } = createInventoryModule();

inventoryRoutes.get('/:id', inventoryController.getInventoryByVarientId);
inventoryRoutes.post('/my/create', authMiddleware, inventoryController.createMyInventory);
inventoryRoutes.patch('/my/:id/purchase', authMiddleware, inventoryController.buyMyInventory);
inventoryRoutes.patch(
    '/my/:id/threshold',
    authMiddleware,
    inventoryController.updateMylowStockThreshold,
);
inventoryRoutes.patch('/:id/remove', authMiddleware, inventoryController.removeMyInventoryStock);
