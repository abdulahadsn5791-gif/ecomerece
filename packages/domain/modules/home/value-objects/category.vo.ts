import { Id, Title, UrlVO } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';
import { IconVO } from '../../../value-objects/icon.vo';

export type CategoryVOProps = {
    id?: Id;
    name: Title;
    icon: IconVO;
    image: UrlVO;
    accent: ColorVO;
};

export class CategoryVO {
    private constructor(
        private readonly _id: Id,
        private readonly _name: Title,
        private readonly _icon: IconVO,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO,
    ) {}

    get id(): Id {
        return this._id;
    }
    get name(): Title {
        return this._name;
    }
    get icon(): IconVO {
        return this._icon;
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
            props.icon,
            props.image,
            props.accent,
        );
    }

    static rehydrate(
        id: Id,
        name: Title,
        icon: IconVO,
        image: UrlVO,
        accent: ColorVO,
    ): CategoryVO {
        return new CategoryVO(id, name, icon, image, accent);
    }
}