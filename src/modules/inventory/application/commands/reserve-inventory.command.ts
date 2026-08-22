import type { ICommand } from '../../../../core/domain/command/i-command-bus';
import { Id } from '../../../../core/domain/value-objects/id.vo';
import { Quantity } from '../../../../core/domain/value-objects/quantity.vo';
import { OrderItem } from '../../../order/domain/value-objects/order-item.vo';
import { InventoryReadModel } from '../../domain/read-models/inventory.read-model';

export class ReserveInventoryCommand implements ICommand<{
    validIds: Id[],
    notFoundIds: Id[],
    deletedIds: Id[],
    availableStockIds: Id[],
    buyableIds: Id[],
    inventoriesReadModel: InventoryReadModel[],
}> {
    constructor(
        public readonly items: { variantId: Id; quantity: Quantity; }[],
        public readonly actorId: Id,
    ) { }
}
