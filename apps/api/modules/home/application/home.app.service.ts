
import {
    CategoryVO,
    ColorVO,
    Description,
    FeatureVO,
    HomeAggregate,
    IconVO,
    Id,
    ProductContainerVO,
    PromoVO,
    Quantity,
    SlideVO,
    Title,
    UrlVO,
} from '@ecomerece/domain';
import { BaseQueryVO } from '@ecomerece/domain/value-objects/query.vo';
import type {
    CreateFeatureDtoType,
    CreateHomeCategoryDtoType,
    CreateProductContainerDtoType,
    CreatePromoDtoType,
    CreateSlideDtoType,
    DeleteFeatureDtoType,
    DeleteHomeCategoryDtoType,
    DeleteProductContainerDtoType,
    DeletePromoDtoType,
    DeleteSlideDtoType,
    HomeResponseReadModel,
    ReorderHomeCategoriesDtoType,
    ReorderProductContainersDtoType,
    ReorderSlidesDtoType,
    SetFeaturesDtoType,
    UpdateFeatureDtoType,
    UpdateHomeCategoryDtoType,
    UpdateProductContainerDtoType,
    UpdatePromoDtoType,
    UpdateSlideDtoType,
} from '@ecomerece/shared';
import { BaseService } from '../../../core/services/base.services';
import { NotFoundError } from '../../../errors/app-error';
import { HomeMapper } from '../infrastructure/home.mapper';
import type { HomeRepository } from '../infrastructure/home.repository';
import { HomeMessages, type HomeMessagesType } from '../presentation/home.messages';

export class HomeAppService extends BaseService {
    constructor(private readonly homeRepo: HomeRepository) {
        super();
    }

    private async getHomeAggregate(): Promise<HomeAggregate> {
        return this.homeRepo.getHomeMain();
    }

    // --- Read Storefront Layout ---
    async getHome(): Promise<HomeResponseReadModel> {
        const home = await this.getHomeAggregate();
        return HomeMapper.aggregateToResponseDto(home);
    }

    // --- Categories ---
    async addCategory(data: CreateHomeCategoryDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const categoryId = data.id ? Id.create(data.id) : Id.create();
        home.addCategory(
            CategoryVO.create({
                id: categoryId,
                name: Title.create(data.name),
                icon: IconVO.create(data.icon),
                image: UrlVO.create(data.image),
                accent: ColorVO.create(data.accent),
            }),
        );
        await this.homeRepo.save(home);
        return HomeMessages.categoryAdded(actorId);
    }

    async updateCategory(data: UpdateHomeCategoryDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const targetId = Id.create(data.id);
        const existing = home.categories.find((c) => c.id.equals(targetId));
        if (!existing) {
            throw new NotFoundError(`Category with ID '${data.id}' not found`);
        }
        const updated = CategoryVO.create({
            id: existing.id,
            name: data.name ? Title.create(data.name) : existing.name,
            icon: data.icon ? IconVO.create(data.icon) : existing.icon,
            image: data.image ? UrlVO.create(data.image) : existing.image,
            accent: data.accent ? ColorVO.create(data.accent) : existing.accent,
        });
        home.updateCategory(targetId, updated);
        await this.homeRepo.save(home);
        return HomeMessages.categoryUpdated(data.id, actorId);
    }

    async removeCategory(data: DeleteHomeCategoryDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.removeCategory(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.categoryRemoved(data.id, actorId);
    }

    async reorderCategories(data: ReorderHomeCategoriesDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.reorderCategories(data.orderedIds.map((id) => Id.create(id)));
        await this.homeRepo.save(home);
        return HomeMessages.categoriesReordered(actorId);
    }

    // --- Slides ---
    async addSlide(data: CreateSlideDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const slideId = data.id ? Id.create(data.id) : Id.create();
        home.addSlide(
            SlideVO.create({
                id: slideId,
                tag: Title.create(data.tag),
                title: Title.create(data.title),
                subhead: Title.create(data.subhead || ''),
                subtitle: Title.create(data.subtitle || ''),
                cta: Title.create(data.cta),
                image: UrlVO.create(data.image),
                accent: ColorVO.create(data.accent),
                displayOrder:
                    data.displayOrder !== undefined
                        ? Quantity.create(data.displayOrder)
                        : Quantity.create(home.slides.length),
            }),
        );
        await this.homeRepo.save(home);
        return HomeMessages.slideAdded(actorId);
    }

    async updateSlide(data: UpdateSlideDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const targetId = Id.create(data.id);
        const existing = home.slides.find((s) => s.id.equals(targetId));
        if (!existing) {
            throw new NotFoundError(`Slide with ID '${data.id}' not found`);
        }
        const updated = SlideVO.create({
            id: existing.id,
            tag: data.tag ? Title.create(data.tag) : existing.tag,
            title: data.title ? Title.create(data.title) : existing.title,
            subhead: data.subhead !== undefined ? Title.create(data.subhead) : existing.subhead,
            subtitle: data.subtitle !== undefined ? Title.create(data.subtitle) : existing.subtitle,
            cta: data.cta ? Title.create(data.cta) : existing.cta,
            image: data.image ? UrlVO.create(data.image) : existing.image,
            accent: data.accent ? ColorVO.create(data.accent) : existing.accent,
            displayOrder: existing.displayOrder,
        });
        home.updateSlide(targetId, updated);
        await this.homeRepo.save(home);
        return HomeMessages.slideUpdated(data.id, actorId);
    }

    async removeSlide(data: DeleteSlideDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.removeSlide(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.slideRemoved(data.id, actorId);
    }

    async reorderSlides(data: ReorderSlidesDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.reorderSlides(data.orderedIds.map((id) => Id.create(id)));
        await this.homeRepo.save(home);
        return HomeMessages.slidesReordered(actorId);
    }

    // --- Promos ---
    async addPromo(data: CreatePromoDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const promoId = data.id ? Id.create(data.id) : Id.create();
        home.addPromo(
            PromoVO.create({
                id: promoId,
                title: Title.create(data.title),
                subtitle: Title.create(data.subtitle),
                image: UrlVO.create(data.image),
                accent: ColorVO.create(data.accent),
                link: data.link ? UrlVO.create(data.link) : UrlVO.create('https://example.com/client/home'),
            }),
        );
        await this.homeRepo.save(home);
        return HomeMessages.promoAdded(actorId);
    }

    async updatePromo(data: UpdatePromoDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const targetId = Id.create(data.id);
        const existing = home.promos.find((p) => p.id.equals(targetId));
        if (!existing) {
            throw new NotFoundError(`Promo with ID '${data.id}' not found`);
        }
        const updated = PromoVO.create({
            id: existing.id,
            title: data.title ? Title.create(data.title) : existing.title,
            subtitle: data.subtitle ? Title.create(data.subtitle) : existing.subtitle,
            image: data.image ? UrlVO.create(data.image) : existing.image,
            accent: data.accent ? ColorVO.create(data.accent) : existing.accent,
            link: data.link ? UrlVO.create(data.link) : existing.link,
        });
        home.updatePromo(targetId, updated);
        await this.homeRepo.save(home);
        return HomeMessages.promoUpdated(data.id, actorId);
    }

    async removePromo(data: DeletePromoDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.removePromo(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.promoRemoved(data.id, actorId);
    }

    // --- Features ---
    async addFeature(data: CreateFeatureDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const featureId = data.id ? Id.create(data.id) : Id.create();
        home.addFeature(
            FeatureVO.create({
                id: featureId,
                title: Title.create(data.title),
                detail: Description.create(data.detail),
                icon: IconVO.create(data.icon),
                accent: ColorVO.create(data.accent),
            }),
        );
        await this.homeRepo.save(home);
        return HomeMessages.featureAdded(actorId);
    }

    async updateFeature(data: UpdateFeatureDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const targetId = Id.create(data.id);
        const existing = home.features.find((f) => f.id.equals(targetId));
        if (!existing) {
            throw new NotFoundError(`Feature with ID '${data.id}' not found`);
        }
        const updated = FeatureVO.create({
            id: existing.id,
            title: data.title ? Title.create(data.title) : existing.title,
            detail: data.detail ? Description.create(data.detail) : existing.detail,
            icon: data.icon ? IconVO.create(data.icon) : existing.icon,
            accent: data.accent ? ColorVO.create(data.accent) : existing.accent,
        });
        home.updateFeature(targetId, updated);
        await this.homeRepo.save(home);
        return HomeMessages.featureUpdated(data.id, actorId);
    }

    async removeFeature(data: DeleteFeatureDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.removeFeature(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.featureRemoved(data.id, actorId);
    }

    async setFeatures(data: SetFeaturesDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const features = data.features.map((f) =>
            FeatureVO.create({
                id: f.id ? Id.create(f.id) : Id.create(),
                title: Title.create(f.title),
                detail: Description.create(f.detail),
                icon: IconVO.create(f.icon),
                accent: ColorVO.create(f.accent),
            }),
        );
        home.setFeatures(features);
        await this.homeRepo.save(home);
        return HomeMessages.featuresSet(actorId);
    }

    // --- Product Containers ---
    async addProductContainer(data: CreateProductContainerDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const containerId = data.id ? Id.create(data.id) : Id.create();
        home.addProductContainer(
            ProductContainerVO.create({
                id: containerId,
                heading: Title.create(data.heading),
                subTitle: Title.create(data.subTitle || ''),
                query: BaseQueryVO.create({
                    filter: data.query?.filter as Record<string, unknown> | undefined,
                    cursor: data.query?.cursor,
                    limit: data.query?.limit !== undefined ? Quantity.create(data.query.limit) : undefined,
                    direction: data.query?.direction,
                    sort: data.query?.sort as Record<string, 1 | -1> | null | undefined,
                }),
                displayOrder:
                    data.displayOrder !== undefined
                        ? Quantity.create(data.displayOrder)
                        : Quantity.create(home.productContainers.length),
            }),
        );
        await this.homeRepo.save(home);
        return HomeMessages.containerAdded(containerId.value, actorId);
    }

    async updateProductContainer(data: UpdateProductContainerDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        const targetId = Id.create(data.id);
        const existing = home.productContainers.find((c) => c.id.equals(targetId));
        if (!existing) {
            throw new NotFoundError(`Product container with ID '${data.id}' not found`);
        }
        const updated = ProductContainerVO.create({
            id: existing.id,
            heading: data.heading ? Title.create(data.heading) : existing.heading,
            subTitle: data.subTitle !== undefined ? Title.create(data.subTitle) : existing.subTitle,
            query: data.query
                ? BaseQueryVO.create({
                      filter: data.query.filter as Record<string, unknown> | undefined,
                      cursor: data.query.cursor,
                      limit: data.query.limit !== undefined ? Quantity.create(data.query.limit) : undefined,
                      direction: data.query.direction,
                      sort: data.query.sort as Record<string, 1 | -1> | null | undefined,
                  })
                : existing.query,
            displayOrder:
                data.displayOrder !== undefined
                    ? Quantity.create(data.displayOrder)
                    : existing.displayOrder,
        });
        home.updateProductContainer(updated);
        await this.homeRepo.save(home);
        return HomeMessages.containerUpdated(data.id, actorId);
    }

    async removeProductContainer(data: DeleteProductContainerDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.removeProductContainer(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.containerRemoved(data.id, actorId);
    }

    async reorderContainers(data: ReorderProductContainersDtoType, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHomeAggregate();
        home.reorderProductContainers(data.orderedIds.map((id) => Id.create(id)));
        await this.homeRepo.save(home);
        return HomeMessages.containersReordered(actorId);
    }
}