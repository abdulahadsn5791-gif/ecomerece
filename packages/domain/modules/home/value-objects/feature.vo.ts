import { Description, Id, Title } from '../../../value-objects';
import { ColorVO } from '../../../value-objects/color.vo';

export type FeatureVOProps = {
    id?: Id;
    title: Title;
    detail: Description;
    accent: ColorVO;
};

export class FeatureVO {
    private constructor(
        private readonly _id: Id,
        private readonly _title: Title,
        private readonly _detail: Description,
        private readonly _accent: ColorVO,
    ) {}

    get id(): Id {
        return this._id;
    }
    get title(): Title {
        return this._title;
    }
    get detail(): Description {
        return this._detail;
    }
    get accent(): ColorVO {
        return this._accent;
    }

    static create(props: FeatureVOProps): FeatureVO {
        return new FeatureVO(
            props.id ?? Id.create(),
            props.title,
            props.detail,
            props.accent,
        );
    }

    static rehydrate(
        id: Id,
        title: Title,
        detail: Description,
        accent: ColorVO,
    ): FeatureVO {
        return new FeatureVO(id, title, detail, accent);
    }
}
