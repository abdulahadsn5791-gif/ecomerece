import { Hono } from "hono";
import { createOrderItemsModule } from "../order-items.module";


export const orderItemsRoutes = new Hono()


createOrderItemsModule()