
import { BaseQueryVO } from '@ecomerece/domain/value-objects/query.vo';
import { BaseService } from '../../../core/services/base.services';
import { HomeMapper } from '../infrastructure/home.mapper';
import type { HomeRepository } from '../infrastructure/home.repository';
import { HomeMessages, type HomeMessagesType } from '../presentation/home.messages';
import { HomeAggregate } from '@ecomerece/domain/modules/home/home.aggregate';
import { Id } from '@ecomerece/domain';


export class HomeAppService extends BaseService {
    constructor(private readonly homeRepo: HomeRepository) { super(); }

    private async getHome(): Promise<HomeAggregate> {
        const homeId = Id.create('home-main');
        let home = await this.homeRepo.findById(homeId);
        if (!home) {
            home = HomeAggregate.create(homeId);
            await this.homeRepo.create(home);
        }
        return home;
    }

    // --- Categories ---
    async addCategory(data: typeof CreateCategoryDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.addCategory(CategoryVO.create({ name: Title.create(data.name), image: UrlVO.create(data.image), accent: ColorVO.create(data.accent) }));
        await this.homeRepo.save(home);
        return HomeMessages.categoryAdded(actorId);
    }
    async removeCategory(data: typeof DeleteCategoryDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.removeCategory(data.id);
        await this.homeRepo.save(home);
        return HomeMessages.categoryRemoved(data.id, actorId);
    }

    // --- Slides ---
    async addSlide(data: typeof CreateSlideDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.addSlide(SlideVO.create({ tag: Title.create(data.tag), title: Title.create(data.title), subhead: Title.create(data.subhead || ''), subtitle: Title.create(data.subtitle || ''), cta: Title.create(data.cta), image: UrlVO.create(data.image), accent: ColorVO.create(data.accent) }));
        await this.homeRepo.save(home);
        return HomeMessages.slideAdded(actorId);
    }
    async reorderSlides(data: typeof ReorderSlidesDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.reorderSlides(data.orderedIds);
        await this.homeRepo.save(home);
        return HomeMessages.slidesReordered(actorId);
    }
    async removeSlide(data: typeof DeleteSlideDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.removeSlide(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.slideRemoved(data.id, actorId);
    }

    // --- Promos ---
    async addPromo(data: typeof CreatePromoDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.addPromo(PromoVO.create({ title: Title.create(data.title), subtitle: Title.create(data.subtitle), image: UrlVO.create(data.image), accent: ColorVO.create(data.accent) }));
        await this.homeRepo.save(home);
        return HomeMessages.promoAdded(actorId);
    }
    async removePromo(data: typeof DeletePromoDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.removePromo(data.id);
        await this.homeRepo.save(home);
        return HomeMessages.promoRemoved(data.id, actorId);
    }

    // --- Product Containers ---
    async addProductContainer(data: typeof CreateProductContainerDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.addProductContainer(ProductContainerVO.create({
            id: Id.create(data.id), heading: Title.create(data.heading), subTitle: Title.create(data.subTitle || ''),
            query: new BaseQueryVO(data.query.filter, data.query.cursor, data.query.limit, data.query.direction, data.query.sort),
            displayOrder: Quantity.create(data.displayOrder)
        }));
        await this.homeRepo.save(home);
        return HomeMessages.containerAdded(data.id, actorId);
    }
    async updateProductContainer(data: typeof UpdateProductContainerDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.updateProductContainer(ProductContainerVO.rehydrate(
            Id.create(data.id), Title.create(data.heading), Title.create(data.subTitle || ''),
            new BaseQueryVO(data.query.filter, data.query.cursor, data.query.limit, data.query.direction, data.query.sort),
            Quantity.create(data.displayOrder)
        ));
        await this.homeRepo.save(home);
        return HomeMessages.containerUpdated(data.id, actorId);
    }
    async removeProductContainer(data: typeof DeleteProductContainerDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.removeProductContainer(Id.create(data.id));
        await this.homeRepo.save(home);
        return HomeMessages.containerRemoved(data.id, actorId);
    }
    async reorderContainers(data: typeof ReorderContainersDTOSchema._type, actorId: string): Promise<HomeMessagesType> {
        const home = await this.getHome();
        home.reorderProductContainers(data.orderedIds.map(id => Id.create(id)));
        await this.homeRepo.save(home);
        return HomeMessages.containersReordered(actorId);
    }
}