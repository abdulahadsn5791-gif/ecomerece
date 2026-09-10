import { Id, Title, UrlVO } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';

export type PromoVOProps = {
    id?: Id;
    title: Title;
    subtitle: Title;
    image: UrlVO;
    accent: ColorVO;
    link?: UrlVO;
};

export class PromoVO {
    private constructor(
        private readonly _id: Id,
        private readonly _title: Title,
        private readonly _subtitle: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO,
        private readonly _link: UrlVO,
    ) {}

    get id(): Id {
        return this._id;
    }
    get title(): Title {
        return this._title;
    }
    get subtitle(): Title {
        return this._subtitle;
    }
    get image(): UrlVO {
        return this._image;
    }
    get accent(): ColorVO {
        return this._accent;
    }
    get link(): UrlVO {
        return this._link;
    }

    static create(props: PromoVOProps): PromoVO {
        return new PromoVO(
            props.id ?? Id.create(),
            props.title,
            props.subtitle,
            props.image,
            props.accent,
            props.link ?? UrlVO.create('https://example.com/client/home'),
        );
    }

    static rehydrate(
        id: Id,
        title: Title,
        subtitle: Title,
        image: UrlVO,
        accent: ColorVO,
        link: UrlVO,
    ): PromoVO {
        return new PromoVO(id, title, subtitle, image, accent, link);
    }
}

