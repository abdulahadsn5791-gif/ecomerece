import type { ICommand } from '@ecomerece/domain/command/i-command-bus';
import { Id } from '@ecomerece/domain/value-objects/id.vo';
import { Quantity } from '@ecomerece/domain/value-objects/quantity.vo';
import { InventoryReadModel } from '@ecomerece/domain';

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
