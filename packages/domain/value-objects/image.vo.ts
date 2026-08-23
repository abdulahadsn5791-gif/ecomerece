import type { AltVO } from './alt.vo';
import type { UrlVO } from './url.vo';

export class ImageVO {
    private constructor(
        readonly url: UrlVO,
        readonly alt: AltVO,
        public isDefault: boolean,
    ) {}

    static create(url: UrlVO, alt: AltVO, isDefault: boolean): ImageVO {
        return new ImageVO(url, alt, isDefault ?? false);
    }

    static rehydrate(url: UrlVO, alt: AltVO, isDefault: boolean): ImageVO {
        return new ImageVO(url, alt, isDefault ?? false);
    }
    setDefault(val: boolean) {
        this.isDefault = val;
    }

    equals(other: ImageVO): boolean {
        return (
            this.url.equals(other.url) &&
            this.alt.equals(other.alt) &&
            this.isDefault === other.isDefault
        );
    }

    toObject() {
        return {
            url: this.url.value,
            alt: this.alt.value,
            default: this.isDefault,
        };
    }
}
