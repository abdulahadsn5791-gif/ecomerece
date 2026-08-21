import { Hono } from 'hono';
import { authMiddleware } from '../../../middleware/auth';
import { createOrder } from '../order.module';

export const OrderRoutes = new Hono();

const { orderController } = createOrder();

OrderRoutes.post('/create/my', authMiddleware, orderController.createMyOrder);
