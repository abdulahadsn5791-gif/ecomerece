import type { UrlVO } from '../../../value-objects';

export class ImageInfoVO {
  private constructor(
    readonly logo: UrlVO,
    readonly banner: UrlVO,
    readonly logoKey?: string,
    readonly bannerKey?: string,
  ) {}

  static create(logo: UrlVO, banner: UrlVO, logoKey?: string, bannerKey?: string): ImageInfoVO {
    return new ImageInfoVO(logo, banner, logoKey, bannerKey);
  }

  static rehydrate(logo: UrlVO, banner: UrlVO, logoKey?: string, bannerKey?: string): ImageInfoVO {
    return new ImageInfoVO(logo, banner, logoKey, bannerKey);
  }

  changeLogo(logo: UrlVO, logoKey?: string): ImageInfoVO {
    return new ImageInfoVO(logo, this.banner, logoKey, this.bannerKey);
  }

  changeBanner(banner: UrlVO, bannerKey?: string): ImageInfoVO {
    return new ImageInfoVO(this.logo, banner, this.logoKey, bannerKey);
  }

  equals(other: ImageInfoVO): boolean {
    return (
      this.logo.equals(other.logo) &&
      this.banner.equals(other.banner) &&
      this.logoKey === other.logoKey &&
      this.bannerKey === other.bannerKey
    );
  }
}
