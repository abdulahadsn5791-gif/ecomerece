import { Hono } from "hono";
import { createOrder } from "../order.module";
import { authMiddleware } from "../../../middleware/auth";

export const OrderRoutes = new Hono();

const { orderController } = createOrder()

OrderRoutes.post('/create/my', authMiddleware, orderController.createMyOrder);