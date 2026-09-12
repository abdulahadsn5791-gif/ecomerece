import type { ICommand, Id, Money } from '@ecomerece/domain';

export class UpdatePriceCommand implements ICommand<{ ok: boolean }> {
  constructor(
    public readonly productId: Id,
    public readonly price: {
      minPrice: Money;
      maxPrice: Money;
      minDiscountedPrice: Money;
      maxDiscountedPrice: Money;
    },
    public readonly actorId: Id,
  ) {}
}
