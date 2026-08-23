import { ExpirationDate } from "@ecomerece/domain/value-objects/expiration-date.vo";
import { Id } from "@ecomerece/domain/value-objects/id.vo";
import { Money } from "@ecomerece/domain/value-objects/money.vo";
import { Quantity } from "@ecomerece/domain/value-objects/quantity.vo";
import { BaseService } from "../../../core/services/base.services";


import { OrderItemsRepository } from "../infrastructure/order-item.repository";
import { OrderItemsAggregate } from "@ecomerece/domain";

export class OrderItemsInternalService extends BaseService {
    constructor(private readonly itemsRepo: OrderItemsRepository
    ) { super(); }


    async createOrderItems(items: {
        id: Id,
        orderId: Id,
        vendorId: Id,
        variantId: Id,
        quantity: Quantity,
        waitingTime: ExpirationDate,
        price: Money
    }[]): Promise<void> {
        const item = items.map((value) => (OrderItemsAggregate.create({
            id: value.id,
            orderId: value.orderId,
            vendorId: value.vendorId,
            variantId: value.variantId,
            quantity: value.quantity,
            waitingTime: value.waitingTime,
            price: value.price
        })));

        await this.itemsRepo.createMany(item);
    }

}