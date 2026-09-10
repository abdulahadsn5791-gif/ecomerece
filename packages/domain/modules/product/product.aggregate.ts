import { BadRequestError } from '../../../../apps/api/errors/app-error';
import { desclaimerItem } from '../../../shared';
import { AggregateRoot } from '../../aggregate-root';
import {
    AppearanceVO,
    BlockInfoVO,
    DeleteInfoVO,
    Description,
    EffectiveDate,
    Id,
    ImageVO,
    Money,
    Name,
    Quantity,
    Reason,
    Title,
    UrlVO,
} from '../../value-objects';
import type { DisclaimerVO } from './value-objects/disclaimer.vo';
import type { IngredientsVO } from './value-objects/ingredients.vo';
import type { ImagesVO } from './value-objects/product-images.vo';

type CreateVendorProps = {
    id: Id;
    vendorId: Id;
    vendorTitle: Title,
    categoryId: Id;
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
        private readonly _categoryId: Id,
        private readonly _vendorTitle: Title,
        private _inStock: boolean = false,
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
        private _minPrice: Money,
        private _maxPrice: Money,
        private _minDiscountedPrice: Money,
        private _maxDiscountedPrice: Money,
        private _averageRating: Quantity,
        private _totalReviews: Quantity,
    ) {
        super();
    }

    get categoryId(): Id {
        return this._categoryId;
    }
    get vendorTitle(): Title {
        return this._vendorTitle;
    }

    get id(): Id {
        return this._id;
    }
    get inStock(): boolean {
        return this._inStock;
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

    get minPrice(): Money {
        return this._minPrice;
    }

    get maxPrice(): Money {
        return this._maxPrice;
    }

    get minDiscountedPrice(): Money {
        return this._minDiscountedPrice;
    }

    get maxDiscountedPrice(): Money {
        return this._maxDiscountedPrice;
    }

    get averageRating(): Quantity {
        return this._averageRating;
    }

    get totalReviews(): Quantity {
        return this._totalReviews;
    }

    get hasMultipleVariants(): boolean {
        return !this._minPrice.equals(this._maxPrice);
    }

    static create(data: CreateVendorProps): ProductAggregate {
        return new ProductAggregate(
            data.id,
            data.vendorId,
            data.categoryId,
            data.vendorTitle,
            false,
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
            Money.zero(),
            Money.zero(),
            Money.zero(),
            Money.zero(),
            Quantity.none(),
            Quantity.zero(),
        );
    }

    static rehydrate(
        _id: Id,
        _vendorId: Id,
        _categoryId: Id,
        _vendorTitle: Title,
        _title: Title,
        _inStock: boolean,
        _description: Description,
        _ingredients: IngredientsVO,
        _disclaimer: DisclaimerVO,
        _images: ImagesVO,
        _delete: DeleteInfoVO,
        _block: BlockInfoVO,
        _appearance: AppearanceVO,
        _version: Quantity,
        _createdAt: EffectiveDate,
        _minPrice: Money,
        _maxPrice: Money,
        _minDiscountedPrice: Money,
        _maxDiscountedPrice: Money,
        _averageRating: Quantity,
        _totalReviews: Quantity,
    ): ProductAggregate {
        return new ProductAggregate(
            _id,
            _vendorId,
            _categoryId,
            _vendorTitle,
            _inStock,
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
            _minPrice,
            _maxPrice,
            _minDiscountedPrice,
            _maxDiscountedPrice,
            _averageRating,
            _totalReviews,
        );
    }

    updatePricingSummary(
        minPrice: Money,
        maxPrice: Money,
        minDiscountedPrice: Money,
        maxDiscountedPrice: Money,
        actorId?: Id,
    ): void {
        this._minPrice = minPrice;
        this._maxPrice = maxPrice;
        this._minDiscountedPrice = minDiscountedPrice;
        this._maxDiscountedPrice = maxDiscountedPrice;
    }

    updateRatingSummary(averageRating: number, totalReviews: number): void {
        if (averageRating < 0 || averageRating > 5) {
            throw new BadRequestError('Rating must be between 0 and 5');
        }
        if (totalReviews < 0) {
            throw new BadRequestError('Total reviews cannot be negative');
        }
        this._averageRating = Quantity.create(Math.round(averageRating * 10) / 10);
        this._totalReviews = Quantity.create(totalReviews);
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

    setInStock(inStock: boolean, actorId: Id) {
        this._inStock = inStock;
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