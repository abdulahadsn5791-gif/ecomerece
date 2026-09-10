import { Title, UrlVO } from "../../../value-objects";
import { ColorVO } from "../../../value-objects/color.vo";
import { IconVO } from "../../../value-objects/icon.vo";

export type CategoryVOProps = {
    name: Title;
    image: UrlVO;
    accent: ColorVO;
};

export class CategoryVO {
    private constructor(
        private readonly _name: Title,

        private readonly _image: UrlVO,
        private readonly _accent: ColorVO
    ) { }

    get name(): Title { return this._name; }

    get image(): UrlVO { return this._image; }
    get accent(): ColorVO { return this._accent; }

    static create(props: CategoryVOProps): CategoryVO {
        return new CategoryVO(props.name, props.image, props.accent);
    }

    static rehydrate(name: Title, image: UrlVO, accent: ColorVO): CategoryVO {
        return new CategoryVO(name, image, accent);
    }
}