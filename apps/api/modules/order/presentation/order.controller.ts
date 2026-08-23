import type { Context } from 'hono';
import { BaseController } from '../../../core/controller/base.controller';
import type { OrderApplicationService } from '../application/order.app.service';
import { createMyOrderDto } from '@ecomerece/shared';


export class OrderController extends BaseController<OrderApplicationService> {
    createMyOrder = async (c: Context) => {
        const data = await this.body(c, createMyOrderDto);

        const actor = c.get('user');
        return this.ok(c, await this.service.createMyOrder(data, actor));
    };
}
