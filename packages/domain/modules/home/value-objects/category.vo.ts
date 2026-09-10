import { Id, Title, UrlVO } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';

export type CategoryVOProps = {
    id?: Id;
    name: Title;
    image: UrlVO;
    accent: ColorVO;
};

export class CategoryVO {
    private constructor(
        private readonly _id: Id,
        private readonly _name: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO,
    ) {}

    get id(): Id {
        return this._id;
    }
    get name(): Title {
        return this._name;
    }
    get image(): UrlVO {
        return this._image;
    }
    get accent(): ColorVO {
        return this._accent;
    }

    static create(props: CategoryVOProps): CategoryVO {
        return new CategoryVO(
            props.id ?? Id.create(),
            props.name,
            props.image,
            props.accent,
        );
    }

    static rehydrate(
        id: Id,
        name: Title,
        image: UrlVO,
        accent: ColorVO,
    ): CategoryVO {
        return new CategoryVO(id, name, image, accent);
    }
}
