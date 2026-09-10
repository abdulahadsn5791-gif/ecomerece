import { Title, UrlVO } from "../../../value-objects";
import { ColorVO } from "../../../value-objects/color.vo";

export type SlideVOProps = {
    tag: Title;
    title: Title;
    subhead: Title;
    subtitle: Title;
    cta: Title;
    image: UrlVO;
    accent: ColorVO;
};

export class SlideVO {
    private constructor(
        private readonly _tag: Title,
        private readonly _title: Title,
        private readonly _subhead: Title,
        private readonly _subtitle: Title,
        private readonly _cta: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO
    ) { }

    get tag(): Title { return this._tag; }
    get title(): Title { return this._title; }
    get subhead(): Title { return this._subhead; }
    get subtitle(): Title { return this._subtitle; }
    get cta(): Title { return this._cta; }
    get image(): UrlVO { return this._image; }
    get accent(): ColorVO { return this._accent; }

    static create(props: SlideVOProps): SlideVO {
        return new SlideVO(
            props.tag,
            props.title,
            props.subhead,
            props.subtitle,
            props.cta,
            props.image,
            props.accent
        );
    }

    static rehydrate(
        tag: Title,
        title: Title,
        subhead: Title,
        subtitle: Title,
        cta: Title,
        image: UrlVO,
        accent: ColorVO
    ): SlideVO {
        return new SlideVO(tag, title, subhead, subtitle, cta, image, accent);
    }
}
