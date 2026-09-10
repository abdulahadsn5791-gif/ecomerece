import { AggregateRoot } from '../../aggregate-root';
import { EffectiveDate, Id, Quantity } from '../../value-objects';
import { CategoryVO } from './value-objects/category.vo';
import { FeatureVO } from './value-objects/feature.vo';
import { ProductContainerVO } from './value-objects/product-container.vo';
import { PromoVO } from './value-objects/promo.vo';
import { SlideVO } from './value-objects/slide.vo';

export class HomeAggregate extends AggregateRoot {
    public static readonly MAX_CATEGORIES = 24;
    public static readonly MAX_SLIDES = 10;
    public static readonly MAX_PROMOS = 6;
    public static readonly MAX_FEATURES = 8;
    public static readonly MAX_PRODUCT_CONTAINERS = 15;

    private constructor(
        private readonly _id: Id,
        private _categories: CategoryVO[],
        private _features: FeatureVO[],
        private _slides: SlideVO[],
        private _promos: PromoVO[],
        private _productContainers: ProductContainerVO[],
        private _version: Quantity = Quantity.create(0),
        private _updatedAt: EffectiveDate = EffectiveDate.today(),
    ) {
        super();
    }

    get id(): Id {
        return this._id;
    }
    get categories(): ReadonlyArray<CategoryVO> {
        return this._categories;
    }
    get features(): ReadonlyArray<FeatureVO> {
        return this._features;
    }
    get slides(): ReadonlyArray<SlideVO> {
        return [...this._slides].sort((a, b) => a.displayOrder.value - b.displayOrder.value);
    }
    get promos(): ReadonlyArray<PromoVO> {
        return this._promos;
    }
    get productContainers(): ReadonlyArray<ProductContainerVO> {
        return [...this._productContainers].sort(
            (a, b) => a.displayOrder.value - b.displayOrder.value,
        );
    }
    get version(): Quantity {
        return this._version;
    }
    get updatedAt(): EffectiveDate {
        return this._updatedAt;
    }

    private touch(): void {
        this._updatedAt = EffectiveDate.today();
    }

    incrementVersion(): void {
        this._version = Quantity.create(this._version.value + 1);
        this.touch();
    }

    static create(id: Id): HomeAggregate {
        return new HomeAggregate(id, [], [], [], [], [], Quantity.create(0), EffectiveDate.today());
    }

    static rehydrate(
        id: Id,
        categories: CategoryVO[],
        features: FeatureVO[],
        slides: SlideVO[],
        promos: PromoVO[],
        productContainers: ProductContainerVO[],
        version: Quantity = Quantity.create(0),
        updatedAt: EffectiveDate = EffectiveDate.today(),
    ): HomeAggregate {
        return new HomeAggregate(id, categories, features, slides, promos, productContainers, version, updatedAt);
    }

    // --- Categories ---
    addCategory(category: CategoryVO): void {
        if (this._categories.length >= HomeAggregate.MAX_CATEGORIES) {
            throw new Error(`Cannot exceed maximum of ${HomeAggregate.MAX_CATEGORIES} categories.`);
        }
        if (this._categories.some((c) => c.id.equals(category.id))) {
            throw new Error(`Category with ID '${category.id.value}' already exists.`);
        }
        if (
            this._categories.some(
                (c) => c.name.value.toLowerCase() === category.name.value.toLowerCase(),
            )
        ) {
            throw new Error(`Category name '${category.name.value}' must be unique.`);
        }
        this._categories.push(category);
        this.touch();
    }

    updateCategory(id: Id, category: CategoryVO): void {
        const index = this._categories.findIndex((c) => c.id.equals(id));
        if (index === -1) {
            throw new Error(`Category with ID '${id.value}' not found.`);
        }
        const duplicate = this._categories.some(
            (c, idx) =>
                idx !== index && c.name.value.toLowerCase() === category.name.value.toLowerCase(),
        );
        if (duplicate) {
            throw new Error(`Category with name '${category.name.value}' already exists.`);
        }
        this._categories[index] = category;
        this.touch();
    }

    removeCategory(id: Id): void {
        const index = this._categories.findIndex((c) => c.id.equals(id));
        if (index === -1) {
            throw new Error(`Category with ID '${id.value}' not found.`);
        }
        this._categories.splice(index, 1);
        this.touch();
    }

    reorderCategories(orderedIds: Id[]): void {
        if (orderedIds.length !== this._categories.length) {
            throw new Error(
                `Reorder categories length (${orderedIds.length}) must match current total (${this._categories.length}).`,
            );
        }
        const uniqueIds = new Set(orderedIds.map((id) => id.value));
        if (uniqueIds.size !== orderedIds.length) {
            throw new Error('Reorder categories list cannot contain duplicate IDs.');
        }
        const reordered: CategoryVO[] = [];
        for (const targetId of orderedIds) {
            const cat = this._categories.find((c) => c.id.equals(targetId));
            if (!cat) {
                throw new Error(`Category '${targetId.value}' not found in current collection.`);
            }
            reordered.push(cat);
        }
        this._categories = reordered;
        this.touch();
    }

    // --- Features ---
    setFeatures(features: FeatureVO[]): void {
        if (features.length > HomeAggregate.MAX_FEATURES) {
            throw new Error(`Cannot exceed maximum of ${HomeAggregate.MAX_FEATURES} features.`);
        }
        const uniqueIds = new Set(features.map((f) => f.id.value));
        if (uniqueIds.size !== features.length) {
            throw new Error('Features list contains duplicate IDs.');
        }
        this._features = features;
        this.touch();
    }

    addFeature(feature: FeatureVO): void {
        if (this._features.length >= HomeAggregate.MAX_FEATURES) {
            throw new Error(`Cannot exceed maximum of ${HomeAggregate.MAX_FEATURES} features.`);
        }
        if (this._features.some((f) => f.id.equals(feature.id))) {
            throw new Error(`Feature with ID '${feature.id.value}' already exists.`);
        }
        this._features.push(feature);
        this.touch();
    }

    updateFeature(id: Id, feature: FeatureVO): void {
        const index = this._features.findIndex((f) => f.id.equals(id));
        if (index === -1) {
            throw new Error(`Feature with ID '${id.value}' not found.`);
        }
        this._features[index] = feature;
        this.touch();
    }

    removeFeature(id: Id): void {
        const index = this._features.findIndex((f) => f.id.equals(id));
        if (index === -1) {
            throw new Error(`Feature with ID '${id.value}' not found.`);
        }
        this._features.splice(index, 1);
        this.touch();
    }

    // --- Slides ---
    addSlide(slide: SlideVO): void {
        if (this._slides.length >= HomeAggregate.MAX_SLIDES) {
            throw new Error(`Cannot exceed maximum of ${HomeAggregate.MAX_SLIDES} slides.`);
        }
        if (this._slides.some((s) => s.id.equals(slide.id))) {
            throw new Error(`Slide with ID '${slide.id.value}' already exists.`);
        }
        slide.updateDisplayOrder(Quantity.create(this._slides.length));
        this._slides.push(slide);
        this.touch();
    }

    updateSlide(id: Id, slide: SlideVO): void {
        const index = this._slides.findIndex((s) => s.id.equals(id));
        if (index === -1) {
            throw new Error(`Slide with ID '${id.value}' not found.`);
        }
        const existingOrder = this._slides[index].displayOrder;
        slide.updateDisplayOrder(existingOrder);
        this._slides[index] = slide;
        this.touch();
    }

    removeSlide(id: Id): void {
        const index = this._slides.findIndex((s) => s.id.equals(id));
        if (index === -1) {
            throw new Error(`Slide with ID '${id.value}' not found.`);
        }
        this._slides.splice(index, 1);
        // Normalize display orders after removal
        this._slides.forEach((s, idx) => s.updateDisplayOrder(Quantity.create(idx)));
        this.touch();
    }

    reorderSlides(orderedIds: Id[]): void {
        if (orderedIds.length !== this._slides.length) {
            throw new Error(
                `Reorder slides count (${orderedIds.length}) must match current total (${this._slides.length}).`,
            );
        }
        const uniqueIds = new Set(orderedIds.map((id) => id.value));
        if (uniqueIds.size !== orderedIds.length) {
            throw new Error('Reorder slides list cannot contain duplicate IDs.');
        }
        const reordered: SlideVO[] = [];
        orderedIds.forEach((targetId, index) => {
            const slide = this._slides.find((s) => s.id.equals(targetId));
            if (!slide) {
                throw new Error(`Slide '${targetId.value}' not found in current collection.`);
            }
            slide.updateDisplayOrder(Quantity.create(index));
            reordered.push(slide);
        });
        this._slides = reordered;
        this.touch();
    }

    // --- Promos ---
    addPromo(promo: PromoVO): void {
        if (this._promos.length >= HomeAggregate.MAX_PROMOS) {
            throw new Error(`Cannot exceed maximum of ${HomeAggregate.MAX_PROMOS} promos.`);
        }
        if (this._promos.some((p) => p.id.equals(promo.id))) {
            throw new Error(`Promo with ID '${promo.id.value}' already exists.`);
        }
        this._promos.push(promo);
        this.touch();
    }

    updatePromo(id: Id, promo: PromoVO): void {
        const index = this._promos.findIndex((p) => p.id.equals(id));
        if (index === -1) {
            throw new Error(`Promo with ID '${id.value}' not found.`);
        }
        this._promos[index] = promo;
        this.touch();
    }

    removePromo(id: Id): void {
        const index = this._promos.findIndex((p) => p.id.equals(id));
        if (index === -1) {
            throw new Error(`Promo with ID '${id.value}' not found.`);
        }
        this._promos.splice(index, 1);
        this.touch();
    }

    // --- Product Containers ---
    addProductContainer(container: ProductContainerVO): void {
        if (this._productContainers.length >= HomeAggregate.MAX_PRODUCT_CONTAINERS) {
            throw new Error(
                `Cannot exceed maximum of ${HomeAggregate.MAX_PRODUCT_CONTAINERS} product containers.`,
            );
        }
        if (this._productContainers.some((c) => c.id.equals(container.id))) {
            throw new Error(`Container '${container.id.value}' already exists.`);
        }
        container.updateDisplayOrder(Quantity.create(this._productContainers.length));
        this._productContainers.push(container);
        this.touch();
    }

    updateProductContainer(container: ProductContainerVO): void {
        const index = this._productContainers.findIndex((c) => c.id.equals(container.id));
        if (index === -1) {
            throw new Error(`Container '${container.id.value}' not found.`);
        }
        const existingOrder = this._productContainers[index].displayOrder;
        container.updateDisplayOrder(existingOrder);
        this._productContainers[index] = container;
        this.touch();
    }

    removeProductContainer(id: Id): void {
        const index = this._productContainers.findIndex((c) => c.id.equals(id));
        if (index === -1) {
            throw new Error(`Container '${id.value}' not found.`);
        }
        this._productContainers.splice(index, 1);
        this._productContainers.forEach((c, idx) => c.updateDisplayOrder(Quantity.create(idx)));
        this.touch();
    }

    reorderProductContainers(orderedIds: Id[]): void {
        if (orderedIds.length !== this._productContainers.length) {
            throw new Error(
                `Reorder containers count (${orderedIds.length}) must match current total (${this._productContainers.length}).`,
            );
        }
        const uniqueIds = new Set(orderedIds.map((id) => id.value));
        if (uniqueIds.size !== orderedIds.length) {
            throw new Error('Reorder containers list cannot contain duplicate IDs.');
        }
        const reordered: ProductContainerVO[] = [];
        orderedIds.forEach((targetId, index) => {
            const container = this._productContainers.find((c) => c.id.equals(targetId));
            if (!container) {
                throw new Error(`Container '${targetId.value}' not found in current collection.`);
            }
            container.updateDisplayOrder(Quantity.create(index));
            reordered.push(container);
        });
        this._productContainers = reordered;
        this.touch();
    }
}
