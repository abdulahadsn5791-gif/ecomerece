// order.service.ts
import { http } from './../../lib';
import type {
    OrderResponseReadModel,
    createMyOrderDtoType,
} from '@ecomerece/shared';

export type OrderMutationResult = {
    message: string;
    updatedData?: OrderResponseReadModel;
};

export class OrderService {
    createMyOrder(data: createMyOrderDtoType): Promise<OrderMutationResult> {
        return http.post<OrderMutationResult>('/orders/me', data);
    }
}

export const orderService = new OrderService();