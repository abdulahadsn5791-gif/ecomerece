import { eventBus } from "../../core/domain/infrastructure/in-memory-event-bus";
import { queryBus } from "../../core/domain/infrastructure/in-memory-query-bus";
import { OrderApplicationService } from "./application/order.app.service";
import { OrderRepository } from "./infrastructure/order.repository";
import { OrderController } from "./presentation/order.controller";

export function createOrder() {

    const orderRepo = new OrderRepository();
    const orderApplicationService = new OrderApplicationService(orderRepo, queryBus, eventBus);
    const orderController = new OrderController(orderApplicationService);
    return { orderController };
}