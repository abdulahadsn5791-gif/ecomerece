import type { IEvent, IEventHandler } from '@ecomerece/domain/events/event-bus.interface';
import type { Id, Money, Quantity } from '@ecomerece/domain/value-objects';
import { statsBufferService } from '../StatsBufferService';

interface OrderItemCreatedPayload {
  orderItemId: Id;
  orderId: Id;
  vendorId: Id;
  productId: Id;
  variantId: Id;
  quantity: Quantity;
  price: Money;
  totalPrice: Money;
}

export class OrderItemCreatedStatsHandler implements IEventHandler<OrderItemCreatedPayload> {
  async handle(event: IEvent<OrderItemCreatedPayload>): Promise<void> {
    const { vendorId, productId, orderId, quantity, totalPrice } = event.payload;

    statsBufferService.track({
      entity: { type: 'vendor', id: vendorId.value },
      metrics: { purchases: 1, revenue: totalPrice.value, quantity: quantity.value },
    });

    statsBufferService.track({
      entity: { type: 'product', id: productId.value },
      metrics: { purchases: 1, revenue: totalPrice.value, quantity: quantity.value },
    });

    statsBufferService.track({
      entity: { type: 'order', id: orderId.value },
      metrics: { revenue: totalPrice.value, quantity: quantity.value },
    });
  }
}
