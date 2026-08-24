import { BadRequestError } from "../../../../apps/api/errors/app-error";
import { AggregateRoot } from "../../aggregate-root";
import { DeleteInfoVO, EffectiveDate, Id, Money, Quantity, Reason, Title } from "../../value-objects";


export type createVarientProps = {
    id: Id;
    productId: Id;
    discountedPrice: Money;
    price: Money;
    title: Title;
    active: boolean;
};

export class ProductVariantAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _productId: Id,

        private _discountedPrice: Money,
        private _price: Money,
        private _active: boolean,
        private _title: Title,
        private _delete: DeleteInfoVO,
        private _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }
    get id() {
        return this._id;
    }
    get productId() {
        return this._productId;
    }

    get price() {
        return this._price;
    }
    get discountedPrice() {
        return this._discountedPrice;
    }
    get active() {
        return this._active;
    }
    get delete() {
        return this._delete;
    }
    get title() {
        return this._title;
    }
    get version() {
        return this._version;
    }
    get createdAt() {
        return this._createdAt;
    }

    static create(data: createVarientProps): ProductVariantAggregate {
        if (data.price.value < data.discountedPrice.value)
            throw new BadRequestError('Discount must be smaller than actual price');
        return new ProductVariantAggregate(
            data.id,
            data.productId,

            data.discountedPrice,
            data.price,
            data.active,
            data.title,
            DeleteInfoVO.none(),
            Quantity.none(),
            EffectiveDate.today(),
        );
    }

    static rehydrate(
        _id: Id,
        _productId: Id,

        _discountedPrice: Money,
        _price: Money,
        _active: boolean,
        _title: Title,
        _delete: DeleteInfoVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ) {
        return new ProductVariantAggregate(
            _id,
            _productId,

            _discountedPrice,
            _price,
            _active,
            _title,
            _delete,
            _version,
            _createdAt,
        );
    }

    updateMeta(title: Title, actorId: Id) {
        this._title = title;
    }

    activate(actorId: Id) {
        if (this._active === true) throw new BadRequestError('Variant was already active');
        this._active = true;
    }
    deActivate(actorId: Id) {
        if (this._active === false) throw new BadRequestError('Variant was already deActive');
        this._active = false;
    }

    updatePrice(price: Money, discountedPrice: Money, actorId: Id) {
        if (price < discountedPrice)
            throw new BadRequestError('Discount must be smaller than actual price');
        this._price = price;
        this._discountedPrice = discountedPrice;
    }

    deleteProduct(actorId: Id, reason: Reason) {
        if (this._delete.deleted) throw new BadRequestError('Product Variant was already removed');
        this._delete = DeleteInfoVO.create(actorId, reason);
        this._active = false;
    }

    recoverProduct(actorId: Id) {
        if (!this._delete.deleted)
            throw new BadRequestError('Product Variant was already recovered');
        this._delete = DeleteInfoVO.none();
    }
}
