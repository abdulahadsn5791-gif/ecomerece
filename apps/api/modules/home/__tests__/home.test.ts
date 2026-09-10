import { describe, expect, it } from 'bun:test';
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
import { HomeMapper } from '../infrastructure/home.mapper';
import { HomeAppService } from '../application/home.app.service';
import type { IHomeRepository } from '@ecomerece/domain';

class InMemoryHomeRepo implements IHomeRepository {
    private home: HomeAggregate | null = null;

    async findById(id: Id): Promise<HomeAggregate | null> {
        return this.home && this.home.id.equals(id) ? this.home : null;
    }

    async getHomeMain(): Promise<HomeAggregate> {
        if (!this.home) {
            this.home = HomeAggregate.create(Id.create('home-main'));
        }
        return this.home;
    }

    async save(home: HomeAggregate): Promise<void> {
        this.home = home;
    }

    async create(home: HomeAggregate): Promise<void> {
        this.home = home;
    }
}

describe('HomeAggregate Domain Invariants', () => {
    it('should initialize an empty home aggregate', () => {
        const home = HomeAggregate.create(Id.create('home-main'));
        expect(home.id.value).toBe('home-main');
        expect(home.categories.length).toBe(0);
        expect(home.slides.length).toBe(0);
        expect(home.promos.length).toBe(0);
        expect(home.features.length).toBe(0);
        expect(home.productContainers.length).toBe(0);
    });

    it('should add, update, and remove categories', () => {
        const home = HomeAggregate.create(Id.create('home-main'));
        const cat1 = CategoryVO.create({
            id: Id.create('cat-1'),
            name: Title.create('Laptops'),
            icon: IconVO.create('laptop'),
            image: UrlVO.create('https://example.com/laptops.jpg'),
            accent: ColorVO.create('#3B82F6'),
        });

        home.addCategory(cat1);
        expect(home.categories.length).toBe(1);
        expect(home.categories[0].name.value).toBe('Laptops');

        // Disallow duplicate category ID
        expect(() => home.addCategory(cat1)).toThrow();

        // Update category
        const cat1Updated = CategoryVO.create({
            id: Id.create('cat-1'),
            name: Title.create('Gaming Laptops'),
            icon: IconVO.create('laptop'),
            image: UrlVO.create('https://example.com/laptops.jpg'),
            accent: ColorVO.create('#3B82F6'),
        });
        home.updateCategory(Id.create('cat-1'), cat1Updated);
        expect(home.categories[0].name.value).toBe('Gaming Laptops');

        // Remove category
        home.removeCategory(Id.create('cat-1'));
        expect(home.categories.length).toBe(0);
    });

    it('should reorder slides properly', () => {
        const home = HomeAggregate.create(Id.create('home-main'));
        const slide1 = SlideVO.create({
            id: Id.create('slide-1'),
            tag: Title.create('Featured'),
            title: Title.create('Audio'),
            subhead: Title.create('Sound'),
            subtitle: Title.create('Details'),
            cta: Title.create('Shop'),
            image: UrlVO.create('https://example.com/audio.jpg'),
            accent: ColorVO.create('#111111'),
        });
        const slide2 = SlideVO.create({
            id: Id.create('slide-2'),
            tag: Title.create('Monitors'),
            title: Title.create('Displays'),
            subhead: Title.create('4K UHD'),
            subtitle: Title.create('Crisp'),
            cta: Title.create('Explore'),
            image: UrlVO.create('https://example.com/monitor.jpg'),
            accent: ColorVO.create('#222222'),
        });

        home.addSlide(slide1);
        home.addSlide(slide2);
        expect(home.slides[0].id.value).toBe('slide-1');
        expect(home.slides[1].id.value).toBe('slide-2');

        home.reorderSlides([Id.create('slide-2'), Id.create('slide-1')]);
        expect(home.slides[0].id.value).toBe('slide-2');
        expect(home.slides[1].id.value).toBe('slide-1');
    });

    it('should enforce maximum collection limits', () => {
        const home = HomeAggregate.create(Id.create('home-main'));
        for (let i = 0; i < HomeAggregate.MAX_PROMOS; i++) {
            home.addPromo(
                PromoVO.create({
                    id: Id.create(`promo-${i}`),
                    title: Title.create(`Promo Title ${i}`),
                    subtitle: Title.create(`Promo Subtitle ${i}`),
                    image: UrlVO.create('https://example.com/promo.jpg'),
                    accent: ColorVO.create('#3B82F6'),
                }),
            );
        }
        expect(home.promos.length).toBe(HomeAggregate.MAX_PROMOS);

        // Exceeding MAX_PROMOS should throw invariant violation
        expect(() =>
            home.addPromo(
                PromoVO.create({
                    id: Id.create('promo-overflow'),
                    title: Title.create('Overflow Promo'),
                    subtitle: Title.create('Overflow Subtitle'),
                    image: UrlVO.create('https://example.com/overflow.jpg'),
                    accent: ColorVO.create('#3B82F6'),
                }),
            ),
        ).toThrow();
    });
});

describe('HomeAppService Full CRUD Operations', () => {
    it('should perform complete categories lifecycle', async () => {
        const repo = new InMemoryHomeRepo();
        const service = new HomeAppService(repo as any);

        // 1. Add Category
        await service.addCategory(
            {
                id: 'cat-phones',
                name: 'Smartphones',
                icon: 'smartphone',
                image: 'https://example.com/phone.jpg',
                accent: '#3B82F6',
            },
            'admin-1',
        );

        let layout = await service.getHome();
        expect(layout.categories.length).toBe(1);
        expect(layout.categories[0].id).toBe('cat-phones');

        // 2. Update Category
        await service.updateCategory(
            {
                id: 'cat-phones',
                name: 'Flagship Phones',
            },
            'admin-1',
        );

        layout = await service.getHome();
        expect(layout.categories[0].name).toBe('Flagship Phones');

        // 3. Remove Category
        await service.removeCategory({ id: 'cat-phones' }, 'admin-1');
        layout = await service.getHome();
        expect(layout.categories.length).toBe(0);
    });

    it('should perform complete slides lifecycle', async () => {
        const repo = new InMemoryHomeRepo();
        const service = new HomeAppService(repo as any);

        await service.addSlide(
            {
                id: 'slide-1',
                tag: 'Summer Sale',
                title: 'Audio Fest',
                subhead: 'Up to 40% Off',
                subtitle: 'Top brand headsets',
                cta: 'Shop Now',
                image: 'https://example.com/slide.jpg',
                accent: '#4A7FB5',
            },
            'admin-1',
        );

        let layout = await service.getHome();
        expect(layout.slides.length).toBe(1);
        expect(layout.slides[0].title).toBe('Audio Fest');

        await service.updateSlide(
            {
                id: 'slide-1',
                title: 'Winter Fest',
            },
            'admin-1',
        );

        layout = await service.getHome();
        expect(layout.slides[0].title).toBe('Winter Fest');

        await service.removeSlide({ id: 'slide-1' }, 'admin-1');
        layout = await service.getHome();
        expect(layout.slides.length).toBe(0);
    });

    it('should perform complete promos lifecycle', async () => {
        const repo = new InMemoryHomeRepo();
        const service = new HomeAppService(repo as any);

        await service.addPromo(
            {
                id: 'promo-1',
                title: 'Gaming Deals',
                subtitle: 'Desktops & GPUs',
                image: 'https://example.com/promo.jpg',
                accent: '#FB923C',
                link: 'https://example.com/client/gaming',
            },
            'admin-1',
        );

        let layout = await service.getHome();
        expect(layout.promos.length).toBe(1);
        expect(layout.promos[0].title).toBe('Gaming Deals');

        await service.updatePromo(
            {
                id: 'promo-1',
                title: 'Next-Gen Gaming Deals',
            },
            'admin-1',
        );

        layout = await service.getHome();
        expect(layout.promos[0].title).toBe('Next-Gen Gaming Deals');

        await service.removePromo({ id: 'promo-1' }, 'admin-1');
        layout = await service.getHome();
        expect(layout.promos.length).toBe(0);
    });

    it('should perform complete features lifecycle and setFeatures', async () => {
        const repo = new InMemoryHomeRepo();
        const service = new HomeAppService(repo as any);

        await service.setFeatures(
            {
                features: [
                    {
                        id: 'feat-1',
                        title: 'Free Shipping',
                        detail: 'On all orders nationwide over Rs. 2,500',
                        icon: 'truck',
                        accent: '#10B981',
                    },
                    {
                        id: 'feat-2',
                        title: 'Official Warranty',
                        detail: '100% genuine brand warranty covered',
                        icon: 'shield',
                        accent: '#3B82F6',
                    },
                ],
            },
            'admin-1',
        );

        let layout = await service.getHome();
        expect(layout.features.length).toBe(2);
        expect(layout.features[0].title).toBe('Free Shipping');

        await service.updateFeature(
            {
                id: 'feat-1',
                title: 'Express Shipping',
            },
            'admin-1',
        );

        layout = await service.getHome();
        expect(layout.features[0].title).toBe('Express Shipping');

        await service.removeFeature({ id: 'feat-2' }, 'admin-1');
        layout = await service.getHome();
        expect(layout.features.length).toBe(1);
    });

    it('should perform complete product containers lifecycle', async () => {
        const repo = new InMemoryHomeRepo();
        const service = new HomeAppService(repo as any);

        await service.addProductContainer(
            {
                id: 'shelf-new',
                heading: 'New Arrivals',
                subTitle: 'Check out the freshest arrivals',
                query: {
                    filter: { inStock: true },
                    limit: 12,
                    direction: 'next',
                },
            },
            'admin-1',
        );

        let layout = await service.getHome();
        expect(layout.productContainers.length).toBe(1);
        expect(layout.productContainers[0].heading).toBe('New Arrivals');

        await service.updateProductContainer(
            {
                id: 'shelf-new',
                heading: 'Featured Arrivals',
            },
            'admin-1',
        );

        layout = await service.getHome();
        expect(layout.productContainers[0].heading).toBe('Featured Arrivals');

        await service.removeProductContainer({ id: 'shelf-new' }, 'admin-1');
        layout = await service.getHome();
        expect(layout.productContainers.length).toBe(0);
    });
});
