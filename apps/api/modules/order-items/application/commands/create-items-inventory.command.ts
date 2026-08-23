import { ICommand } from "@ecomerece/domain/command/i-command-bus";
import { ExpirationDate } from "@ecomerece/domain/value-objects/expiration-date.vo";
import { Id } from "@ecomerece/domain/value-objects/id.vo";
import { Money } from "@ecomerece/domain/value-objects/money.vo";
import { Quantity } from "@ecomerece/domain/value-objects/quantity.vo";

export class CreateItemsCommand implements ICommand<{}> {
    constructor(
        public readonly items: {
            id: Id,
            orderId: Id,
            vendorId: Id,
            variantId: Id,
            quantity: Quantity,
            waitingTime: ExpirationDate,
            price: Money
        }[],

    ) { }
}