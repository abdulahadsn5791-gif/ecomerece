import { Description, Title } from "../../../value-objects";
import { ColorVO } from "../../../value-objects/color.vo";
import { IconVO } from "../../../value-objects/icon.vo";

export type FeatureVOProps = {
    title: Title;
    detail: Description;
    icon: IconVO;
    accent: ColorVO;
};

export class FeatureVO {
    private constructor(
        private readonly _title: Title,
        private readonly _detail: Description,
        private readonly _icon: IconVO,
        private readonly _accent: ColorVO
    ) { }

    get title(): Title { return this._title; }
    get detail(): Description { return this._detail; }
    get icon(): IconVO { return this._icon; }
    get accent(): ColorVO { return this._accent; }

    static create(props: FeatureVOProps): FeatureVO {
        return new FeatureVO(props.title, props.detail, props.icon, props.accent);
    }

    static rehydrate(title: Title, detail: Description, icon: IconVO, accent: ColorVO): FeatureVO {
        return new FeatureVO(title, detail, icon, accent);
    }
}
