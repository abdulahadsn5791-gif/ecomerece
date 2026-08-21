import type { desclaimerItem } from '../../../../shared/types/disclaimer-type';
import { AggregateRoot } from '../../../core/domain/aggregate-root';
import { AppearanceVO } from '../../../core/domain/value-objects/appearance.vo';

import { BlockInfoVO } from '../../../core/domain/value-objects/block-info.vo';
import { DeleteInfoVO } from '../../../core/domain/value-objects/delete-info.vo';
import type { Description } from '../../../core/domain/value-objects/description.vo';
import { EffectiveDate } from '../../../core/domain/value-objects/effective-date.vo';

import type { Id } from '../../../core/domain/value-objects/id.vo';
import type { ImageVO } from '../../../core/domain/value-objects/image.vo';
import { Name } from '../../../core/domain/value-objects/name.vo';
import { Quantity } from '../../../core/domain/value-objects/quantity.vo';
import type { Reason } from '../../../core/domain/value-objects/reason.vo';
import { Title } from '../../../core/domain/value-objects/title.vo';
import type { UrlVO } from '../../../core/domain/value-objects/url.vo';
import { BadRequestError } from '../../../errors/app-error';

import type { DisclaimerVO } from './value-objects/disclaimer.vo';
import type { IngredientsVO } from './value-objects/ingredients.vo';
import type { ImagesVO } from './value-objects/product-images.vo';

type CreateVendorProps = {
    id: Id;
    vendorId: Id;
    images: ImagesVO;

    title: Title;
    description: Description;
    ingredients: IngredientsVO;
    disclaimer: DisclaimerVO;
};

export class ProductAggregate extends AggregateRoot {
    constructor(
        private readonly _id: Id,
        private readonly _vendorId: Id,

        private _title: Title,
        private _description: Description,
        private _ingredients: IngredientsVO,
        private _disclaimer: DisclaimerVO,
        private _images: ImagesVO,
        private _delete: DeleteInfoVO,
        private _block: BlockInfoVO,
        private _appearance: AppearanceVO,
        private readonly _version: Quantity,
        private readonly _createdAt: EffectiveDate,
    ) {
        super();
    }

    get id(): Id {
        return this._id;
    }

    get vendorId(): Id {
        return this._vendorId;
    }

    get title(): Title {
        return this._title;
    }

    get description(): Description {
        return this._description;
    }

    get ingredients(): IngredientsVO {
        return this._ingredients;
    }

    get disclaimer(): DisclaimerVO {
        return this._disclaimer;
    }

    get images(): ImagesVO {
        return this._images;
    }

    get delete(): DeleteInfoVO {
        return this._delete;
    }
    get block(): BlockInfoVO {
        return this._block;
    }
    get appearance(): AppearanceVO {
        return this._appearance;
    }
    get version(): Quantity {
        return this._version;
    }
    get createdAt(): EffectiveDate {
        return this._createdAt;
    }

    static create(data: CreateVendorProps): ProductAggregate {
        return new ProductAggregate(
            data.id,
            data.vendorId,
            data.title,
            data.description,
            data.ingredients,
            data.disclaimer,
            data.images,
            DeleteInfoVO.none(),
            BlockInfoVO.none(),
            AppearanceVO.create('public'),
            Quantity.none(),
            EffectiveDate.today(),
        );
    }

    static rehydrate(
        _id: Id,
        _vendorId: Id,

        _title: Title,
        _description: Description,
        _ingredients: IngredientsVO,
        _disclaimer: DisclaimerVO,
        _images: ImagesVO,
        _delete: DeleteInfoVO,
        _block: BlockInfoVO,
        _appearance: AppearanceVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
    ): ProductAggregate {
        return new ProductAggregate(
            _id,
            _vendorId,

            _title,
            _description,
            _ingredients,
            _disclaimer,
            _images,
            _delete,
            _block,
            _appearance,
            _version,
            _createdAt,
        );
    }

    recoverProduct(): void {
        if (!this._delete.deleted) throw new BadRequestError('Product was already recovered');
        this._delete = DeleteInfoVO.none();
    }

    deleteProduct(actor: Id, reason: Reason): void {
        if (this._delete.deleted) throw new BadRequestError('Product was already removed');
        this._delete = DeleteInfoVO.create(actor, reason);
    }
    blockProduct(actor: Id, reason: Reason): void {
        if (this._block.isBlocked) throw new BadRequestError('Product was already blocked');
        this._block = this._block.block(actor, reason);
    }
    unBlockProduct(actor: Id): void {
        if (!this._block.isBlocked) throw new BadRequestError('Product was already active');
        this._block = this._block.unblock();
    }
    makeProductPublic(): void {
        if (this._appearance.isPublic) throw new BadRequestError('Product was already public');
        this._appearance = this._appearance.makePublic();
    }
    makeProductPrivate(): void {
        if (this._appearance.isPrivate) throw new BadRequestError('Product was already private');
        this._appearance = this._appearance.makePrivate();
    }
    updateMeta(title: Title, description: Description, actorId: Id): void {
        this._title = title;
        this._description = description;
    }

    enableDisclaimer(actorId: Id) {
        this._disclaimer = this._disclaimer.enable();
    }

    disableDisclaimer(actorId: Id) {
        this._disclaimer = this._disclaimer.disable();
    }

    addDisclaimers(data: desclaimerItem[], actorId: Id) {
        const items = data.map((value) => ({
            name: Name.create(value.name),
            title: Title.create(value.title),
        }));
        this._disclaimer = this._disclaimer.addMany(items);
    }

    removeDisclaimers(data: desclaimerItem[], actorId: Id) {
        const items = data.map((value) => ({
            name: Name.create(value.name),
            title: Title.create(value.title),
        }));
        this._disclaimer = this._disclaimer.removeMany(items);
    }

    updateDisclaimer(name: Name, title: Title, actorId: Id) {
        this._disclaimer = this._disclaimer.update(name.value, title.value);
    }

    addImages(images: ImageVO | ImageVO[], actorId: Id): void {
        this._images = this._images.add(images);
    }

    removeImages(urls: UrlVO | UrlVO[], actorId: Id): void {
        this._images = this._images.remove(urls);
    }
    setDefault(index: Quantity, actorId: Id) {
        this._images.setDefault(index);
    }

    hasImage(url: UrlVO): boolean {
        return this._images.has(url);
    }

    getDefaultImage(): ImageVO | undefined {
        return this._images.getDefault();
    }

    getImages(): ImagesVO {
        return this._images;
    }

    getFirstImage() {
        return this._images.first();
    }

    getLastImage() {
        return this._images.last();
    }

    getImagesCount(): number {
        return this._images.length;
    }

    hasImages(): boolean {
        return !this._images.isEmpty;
    }
    enableIngredients(actorId: Id): void {
        this._ingredients = this._ingredients.enable();
    }

    disableIngredients(actorId: Id): void {
        this._ingredients = this._ingredients.disable();
    }
    addIngredients(items: string | string[], actorId: Id): void {
        const ingredientList = Array.isArray(items) ? items : [items];

        ingredientList.forEach((ingredient) => {
            if (ingredient && ingredient.trim()) {
                this._ingredients.add(ingredient);
            }
        });
        console.log(this._ingredients.value);
    }
    removeIngredients(items: string | string[], actorId: Id): void {
        const ingredientList = Array.isArray(items) ? items : [items];
        ingredientList.forEach((ingredient) => {
            if (ingredient && ingredient.trim()) {
                this._ingredients.remove(ingredient);
            }
        });
    }

    clearIngredients(actorId: Id): void {
        this._ingredients = this._ingredients.clear();
    }

    hasIngredient(item: string): boolean {
        return this._ingredients.has(item);
    }
}
