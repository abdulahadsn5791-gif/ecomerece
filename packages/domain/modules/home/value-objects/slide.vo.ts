import { Id, Quantity, Title, UrlVO } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';

export type SlideVOProps = {
    id?: Id;
    tag: Title;
    title: Title;
    subhead: Title;
    subtitle: Title;
    cta: Title;
    image: UrlVO;
    accent: ColorVO;
    displayOrder?: Quantity;
};

export class SlideVO {
    private constructor(
        private readonly _id: Id,
        private readonly _tag: Title,
        private readonly _title: Title,
        private readonly _subhead: Title,
        private readonly _subtitle: Title,
        private readonly _cta: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO,
        private _displayOrder: Quantity,
    ) {}

    get id(): Id {
        return this._id;
    }
    get tag(): Title {
        return this._tag;
    }
    get title(): Title {
        return this._title;
    }
    get subhead(): Title {
        return this._subhead;
    }
    get subtitle(): Title {
        return this._subtitle;
    }
    get cta(): Title {
        return this._cta;
    }
    get image(): UrlVO {
        return this._image;
    }
    get accent(): ColorVO {
        return this._accent;
    }
    get displayOrder(): Quantity {
        return this._displayOrder;
    }

    updateDisplayOrder(order: Quantity): void {
        this._displayOrder = order;
    }

    static create(props: SlideVOProps): SlideVO {
        return new SlideVO(
            props.id ?? Id.create(),
            props.tag,
            props.title,
            props.subhead,
            props.subtitle,
            props.cta,
            props.image,
            props.accent,
            props.displayOrder ?? Quantity.create(0),
        );
    }

    static rehydrate(
        id: Id,
        tag: Title,
        title: Title,
        subhead: Title,
        subtitle: Title,
        cta: Title,
        image: UrlVO,
        accent: ColorVO,
        displayOrder: Quantity,
    ): SlideVO {
        return new SlideVO(id, tag, title, subhead, subtitle, cta, image, accent, displayOrder);
    }
}

