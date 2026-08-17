import { InMemoryEventBus } from "../../../core/domain/infrastructure/in-memory-event-bus";
import { InMemoryQueryBus } from "../../../core/domain/infrastructure/in-memory-query-bus";
import { Id } from "../../../core/domain/value-objects/id.vo";
import { Quantity } from "../../../core/domain/value-objects/quantity.vo";
import { FullAddressVO } from "../../../core/domain/value-objects/street-address.vo";
import { BaseService } from "../../../core/services/base.services";
import { BadRequestError } from "../../../errors/app-error";
import { EnsureActiveAddressGetByIdQuery } from "../../address/application/queries/ensure-active-address-get-by-it.query";
import { AddressPersistence } from "../../address/infrastructure/address.models";
import { EnsureActiveUserGetByIdQuery } from "../../user/application/queries/ensure-active-user-get-by-id.query";
import { UserPersistence } from "../../user/infrastructure/user.models";
import { OrderAggregate } from "../domain/order.aggregate";
import { OrderItem } from "../domain/value-objects/order-item.vo";
import { OrderMapper } from "../infrastructure/order.mapper";
import { OrderRepository } from "../infrastructure/order.repository";
import { createMyOrderDtoType } from "../presentation/dto/create-order.dto";
import { OrderMessages } from "../presentation/order.messages";

export class OrderApplicationService extends BaseService {

    constructor(private readonly orderRepo: OrderRepository,
        private readonly queryBus: InMemoryQueryBus,
        private readonly eventBus: InMemoryEventBus
    ) { super() }


    async canCreateOrder(userId: Id, addressId: Id, orderItems: OrderItem[]) {
        const [address, user] = await Promise.all([
            this.queryBus.execute(new EnsureActiveAddressGetByIdQuery({ addressId: addressId })),
            this.queryBus.execute(new EnsureActiveUserGetByIdQuery({ userId: userId })),
        ]);

        if (!address.active) throw new BadRequestError("Address is not active");
        if (!address.address || !address) throw new BadRequestError("Address not found");
        if (!user.active) throw new BadRequestError("User is not active");
        if (!user.user) throw new BadRequestError("User not found");
        if (!address.address.fullAddress) throw new BadRequestError("Address details are incomplete");
        const fullAddress = FullAddressVO.create(address.address.fullAddress);


        return { fullAddress, user }
    }

    async createMyOrder(data: createMyOrderDtoType, actor: UserPersistence) {
        const orderId = Id.create();
        const idempotentKey = Id.create(data.idempotentKey);
        const addressId = Id.create(data.addressId);
        const actorId = Id.create(actor._id);
        const orderItems = data.items.map((value) => OrderItem.create({
            variantId: Id.create(value.variantId),
            quantity: Quantity.create(value.quantity),
            unitPrice: Quantity.create(value.unitPrice)
        }));
        const { fullAddress, user } = await this.canCreateOrder(actorId, addressId, orderItems)

        const order = OrderAggregate.create({
            idempotentKey: idempotentKey,
            id: orderId,
            items: orderItems,
            buyerId: actorId,
            address: fullAddress,
        });
        order.createOrder();
        await this.orderRepo.Create(order);
        await this.eventBus.publish(order.pullEvents());
        const response = OrderMapper.aggregateToResponseReadModel(order);
        return OrderMessages.orderCreated(orderId, actorId, addressId, response);
    }


}

// createOrder()
// cancelOrder(actorId: Id, reason: Reason)
// confirmOrder(actorId: Id)
// returnOrder(actorId: Id, reason: Reason)
// refundOrder(actorId: Id, reason: Reason)
// completeOrder(actorId: Id)