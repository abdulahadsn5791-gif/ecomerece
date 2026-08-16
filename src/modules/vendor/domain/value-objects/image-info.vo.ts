import type { UrlVO } from '../../../../core/domain/value-objects/url.vo';

export class ImageInfoVO {
    private constructor(
        readonly logo: UrlVO,
        readonly banner: UrlVO,
    ) {}

    static create(logo: UrlVO, banner: UrlVO): ImageInfoVO {
        return new ImageInfoVO(logo, banner);
    }

    static rehydrate(logo: UrlVO, banner: UrlVO): ImageInfoVO {
        return new ImageInfoVO(logo, banner);
    }

    changeLogo(logo: UrlVO): ImageInfoVO {
        return new ImageInfoVO(logo, this.banner);
    }

    changeBanner(banner: UrlVO): ImageInfoVO {
        return new ImageInfoVO(this.logo, banner);
    }

    equals(other: ImageInfoVO): boolean {
        return this.logo.equals(other.logo) && this.banner.equals(other.banner);
    }
}
