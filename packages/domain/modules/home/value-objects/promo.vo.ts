import { Title, UrlVO } from "../../../value-objects";
import { ColorVO } from "../../../value-objects/color.vo";

export type PromoVOProps = {
    title: Title;
    subtitle: Title;
    image: UrlVO;
    accent: ColorVO;
};

export class PromoVO {
    private constructor(
        private readonly _title: Title,
        private readonly _subtitle: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO
    ) { }

    get title(): Title { return this._title; }
    get subtitle(): Title { return this._subtitle; }
    get image(): UrlVO { return this._image; }
    get accent(): ColorVO { return this._accent; }

    static create(props: PromoVOProps): PromoVO {
        return new PromoVO(props.title, props.subtitle, props.image, props.accent);
    }

    static rehydrate(title: Title, subtitle: Title, image: UrlVO, accent: ColorVO): PromoVO {
        return new PromoVO(title, subtitle, image, accent);
    }
}
