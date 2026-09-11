import { Id, Title, UrlVO } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';
import { ImageKey } from '../../image-storage/value-objects/image-key.vo';

export type CategoryVOProps = {
    id?: Id;
    name: Title;
    image: UrlVO;
    accent: ColorVO;
    imageKey?: ImageKey;
};

export class CategoryVO {
    private constructor(
        private readonly _id: Id,
        private readonly _name: Title,
        private readonly _image: UrlVO,
        private readonly _accent: ColorVO,
        private readonly _imageKey?: ImageKey,
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
    get imageKey(): ImageKey | undefined {
        return this._imageKey;
    }

    static create(props: CategoryVOProps): CategoryVO {
        return new CategoryVO(
            props.id ?? Id.create(),
            props.name,
            props.image,
            props.accent,
            props.imageKey,
        );
    }

    static rehydrate(
        id: Id,
        name: Title,
        image: UrlVO,
        accent: ColorVO,
        imageKey?: ImageKey,
    ): CategoryVO {
        return new CategoryVO(id, name, image, accent, imageKey);
    }
}