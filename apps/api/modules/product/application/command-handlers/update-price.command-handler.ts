import { ICommandHandler } from "@ecomerece/domain";
import { UpdatePriceCommand } from "../commands/update-price.command";
import { ProductInternelService } from "../product.internel.service";

export class UpdatePriceHandler
    implements ICommandHandler<{ ok: boolean }, UpdatePriceCommand> {
    constructor(private readonly inventorySvc: ProductInternelService) { }

    async handle(cmd: UpdatePriceCommand): Promise<{ ok: boolean }> {

        return await this.inventorySvc.updatePrice(cmd.productId, cmd.price, cmd.actorId);
    }
}
