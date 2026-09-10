import { CategoryVO, FeatureVO, HomeAggregate, ProductContainerVO, PromoVO, SlideVO, type HomeReadModel } from '@ecomerece/domain';
import { ColorVO, Description, IconVO, Id, Quantity, Title, UrlVO } from '@ecomerece/domain/value-objects';
import { BaseQueryVO } from '@ecomerece/domain/value-objects/query.vo';
import type { HomePersistence } from './home.models';

export const HomeMapper = {
    persistenceToAggregate(doc: HomePersistence): HomeAggregate {
        const categories = doc.categories.map(c => CategoryVO.rehydrate(Title.create(c.name), UrlVO.create(c.image), ColorVO.create(c.accent)));
        const features = doc.features.map(f => FeatureVO.rehydrate(Title.create(f.title), Description.create(f.detail), IconVO.create(f.icon), ColorVO.create(f.accent)));
        const slides = doc.slides.map(s => SlideVO.rehydrate(Title.create(s.tag), Title.create(s.title), Title.create(s.subhead), Title.create(s.subtitle), Title.create(s.cta), UrlVO.create(s.image), ColorVO.create(s.accent)));
        const promos = doc.promos.map(p => PromoVO.rehydrate(Title.create(p.title), Title.create(p.subtitle), UrlVO.create(p.image), ColorVO.create(p.accent)));
        const containers = doc.productContainers.map(pc => ProductContainerVO.rehydrate(
            Id.create(pc.id), Title.create(pc.heading), Title.create(pc.subTitle),
            new BaseQueryVO(pc.query.filter, pc.query.cursor, pc.query.limit, pc.query.direction, pc.query.sort),
            Quantity.create(pc.displayOrder)
        ));
        return HomeAggregate.rehydrate(Id.create(doc._id), categories, features, slides, promos, containers);
    },

    aggregateToPersistence(home: HomeAggregate): Partial<HomePersistence> {
        return {
            _id: home.id.value,
            categories: home.categories.map(c => ({ name: c.name.value, image: c.image.value, accent: c.accent.value })),
            features: home.features.map(f => ({ title: f.title.value, detail: f.detail.value, icon: f.icon.value, accent: f.accent.value })),
            slides: home.slides.map(s => ({ tag: s.tag.value, title: s.title.value, subhead: s.subhead.value, subtitle: s.subtitle.value, cta: s.cta.value, image: s.image.value, accent: s.accent.value })),
            promos: home.promos.map(p => ({ title: p.title.value, subtitle: p.subtitle.value, image: p.image.value, accent: p.accent.value })),
            productContainers: home.productContainers.map(pc => ({
                id: pc.id.value, heading: pc.heading.value, subTitle: pc.subTitle.value,
                query: { filter: pc.query.filter, cursor: pc.query.cursor, limit: pc.query.limit, direction: pc.query.direction, sort: pc.query.sort },
                displayOrder: pc.displayOrder.value
            })),
        };
    },

    aggregateToReadModel(home: HomeAggregate): HomeReadModel {
        return {
            id: home.id.value,
            categories: home.categories.map(c => ({ name: c.name.value, image: c.image.value, accent: c.accent.value })),
            features: home.features.map(f => ({ title: f.title.value, detail: f.detail.value, icon: f.icon.value, accent: f.accent.value })),
            slides: home.slides.map(s => ({ tag: s.tag.value, title: s.title.value, subhead: s.subhead.value, subtitle: s.subtitle.value, cta: s.cta.value, image: s.image.value, accent: s.accent.value })),
            promos: home.promos.map(p => ({ title: p.title.value, subtitle: p.subtitle.value, image: p.image.value, accent: p.accent.value })),
            productContainers: home.productContainers.map(pc => ({ id: pc.id.value, heading: pc.heading.value, subTitle: pc.subTitle.value, displayOrder: pc.displayOrder.value })),
            version: 0, updatedAt: new Date()
        };
    }
};