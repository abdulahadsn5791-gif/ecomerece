import { AggregateRoot } from "../../aggregate-root";
import { Id, Quantity } from "../../value-objects";
import { CategoryVO } from "./value-objects/category.vo";
import { FeatureVO } from "./value-objects/feature.vo";
import { ProductContainerVO } from "./value-objects/product-container.vo";
import { PromoVO } from "./value-objects/promo.vo";
import { SlideVO } from "./value-objects/slide.vo";

export class HomeAggregate extends AggregateRoot {
    private constructor(
        private readonly _id: Id,
        private _categories: CategoryVO[],
        private _features: FeatureVO[],
        private _slides: SlideVO[],
        private _promos: PromoVO[],
        private _productContainers: ProductContainerVO[]
    ) { super(); }

    get id(): Id { return this._id; }
    get categories(): ReadonlyArray<CategoryVO> { return this._categories; }
    get features(): ReadonlyArray<FeatureVO> { return this._features; }
    get slides(): ReadonlyArray<SlideVO> { return this._slides; }
    get promos(): ReadonlyArray<PromoVO> { return this._promos; }
    get productContainers(): ReadonlyArray<ProductContainerVO> {
        return [...this._productContainers].sort((a, b) => a.displayOrder.value - b.displayOrder.value);
    }

    static create(id: Id): HomeAggregate {
        return new HomeAggregate(id, [], [], [], [], []);
    }

    static rehydrate(id: Id, categories: CategoryVO[], features: FeatureVO[], slides: SlideVO[], promos: PromoVO[], productContainers: ProductContainerVO[]): HomeAggregate {
        return new HomeAggregate(id, categories, features, slides, promos, productContainers);
    }

    // --- Categories ---
    addCategory(category: CategoryVO): void {
        if (this._categories.some(c => c.name.value === category.name.value)) throw new Error('Category name must be unique');
        this._categories.push(category);
    }
    updateCategory(id: Id, category: CategoryVO): void {
        const index = this._categories.findIndex(c => c.name.value === id.value); // Assuming name is unique ID for simplicity, or add explicit ID to CategoryVO
        if (index === -1) throw new Error('Category not found');
        this._categories[index] = category;
    }
    removeCategory(name: string): void {
        this._categories = this._categories.filter(c => c.name.value !== name);
    }

    // --- Features ---
    setFeatures(features: FeatureVO[]): void { this._features = features; }

    // --- Slides ---
    addSlide(slide: SlideVO): void { this._slides.push(slide); }
    updateSlide(id: Id, slide: SlideVO): void {
        const index = this._slides.findIndex(s => s.title.value === id.value);
        if (index === -1) throw new Error('Slide not found');
        this._slides[index] = slide;
    }
    removeSlide(id: Id): void {
        this._slides = this._slides.filter(s => !s.title.value.includes(id.value)); // Adjust based on your VO ID strategy
    }
    reorderSlides(orderedTitles: string[]): void {
        const reordered: SlideVO[] = [];
        orderedTitles.forEach(title => {
            const slide = this._slides.find(s => s.title.value === title);
            if (slide) reordered.push(slide);
        });
        this._slides = reordered;
    }

    // --- Promos ---
    addPromo(promo: PromoVO): void { this._promos.push(promo); }
    removePromo(title: string): void {
        this._promos = this._promos.filter(p => p.title.value !== title);
    }

    // --- Product Containers ---
    addProductContainer(container: ProductContainerVO): void {
        if (this._productContainers.some(c => c.id.equals(container.id))) throw new Error(`Container ${container.id.value} already exists.`);
        this._productContainers.push(container);
    }
    updateProductContainer(container: ProductContainerVO): void {
        const index = this._productContainers.findIndex(c => c.id.equals(container.id));
        if (index === -1) throw new Error('Container not found');
        this._productContainers[index] = container;
    }
    removeProductContainer(id: Id): void {
        this._productContainers = this._productContainers.filter(c => !c.id.equals(id));
    }
    reorderProductContainers(orderedIds: Id[]): void {
        orderedIds.forEach((id, index) => {
            const container = this._productContainers.find(c => c.id.equals(id));
            if (container) container.updateDisplayOrder(Quantity.create(index));
        });
    }
}