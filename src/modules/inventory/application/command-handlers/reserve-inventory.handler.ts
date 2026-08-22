import { ICommandHandler } from "../../../../core/domain/command/i-command-bus";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { InventoryReadModel } from "../../domain/read-models/inventory.read-model";
import { ReserveInventoryCommand } from "../commands/reserve-inventory.command";
import { InventoryInternalServcie } from "../inventory.internal.service";

type ReserveInventoryResult = {
    validIds: Id[];
    notFoundIds: Id[];
    deletedIds: Id[];
    availableStockIds: Id[];
    buyableIds: Id[];
    inventoriesReadModel: InventoryReadModel[];
};
export class ReserveInventoryHandler
    implements ICommandHandler<ReserveInventoryResult, ReserveInventoryCommand> {
    constructor(private readonly inventorySvc: InventoryInternalServcie) { }

    async handle(cmd: ReserveInventoryCommand): Promise<ReserveInventoryResult> {
        return await this.inventorySvc.reserveInventories(cmd.items, cmd.actorId);
    }
}


