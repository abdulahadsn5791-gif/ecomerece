import { ICommand } from "../../../../core/domain/command/i-command-bus";
import { ExpirationDate } from "../../../../core/domain/value-objects/expiration-date.vo";
import { Id } from "../../../../core/domain/value-objects/id.vo";
import { Money } from "../../../../core/domain/value-objects/money.vo";
import { Quantity } from "../../../../core/domain/value-objects/quantity.vo";

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