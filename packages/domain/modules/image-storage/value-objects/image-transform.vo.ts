import { ImageInvalidKeyError } from '../errors/image-storage-errors';

export type ImageFormat = 'auto' | 'webp' | 'avif' | 'jpeg' | 'png' | 'gif' | 'original';
export type ImageResizeFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

export interface ImageTransformProps {
  /** Target width in pixels. */
  width?: number;
  /** Target height in pixels. */
  height?: number;
  /** Resize fit strategy. */
  fit?: ImageResizeFit;
  /** Output format; `auto`/`original` delegate to the provider. */
  format?: ImageFormat;
  /** Output quality, 1-100 (image encoders). */
  quality?: number;
  /** Rotation in degrees (clockwise). */
  rotate?: number;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Mirror vertically. */
  flop?: boolean;
  /** Background color used for padded fits, e.g. `#ffffff`. */
  background?: string;
  /** Gaussian blur radius (0-100). */
  blur?: number;
  /** Sharpen amount (0-100). */
  sharpen?: number;
  /** Absolute-crop region before other transforms are applied. */
  crop?: { x: number; y: number; width: number; height: number };
  /** Escape hatch for a provider-specific named transformation preset. */
  preset?: string;
}

/**
 * Provider-neutral image transformation. Adapt to the equivalent native
 * transformation of Cloudinary / S3 + ImageMagick / R2 / ImageKit / Sharp /
 * local pipeline inside the adapter. `preset` lets you skip the neutral
 * subset when you need a provider-only effect without leaking it upward.
 */
export class ImageTransform {
  private constructor(private readonly _props: ImageTransformProps) {}

  static create(props: ImageTransformProps): ImageTransform {
    ImageTransform.validate(props);
    return new ImageTransform(props);
  }

  static rehydrate(props: ImageTransformProps): ImageTransform {
    return new ImageTransform(props);
  }

  private static validate(props: ImageTransformProps): void {
    if (props.width !== undefined && props.width <= 0) {
      throw new ImageInvalidKeyError('Transform width must be a positive number.');
    }
    if (props.height !== undefined && props.height <= 0) {
      throw new ImageInvalidKeyError('Transform height must be a positive number.');
    }
    if (props.quality !== undefined && (props.quality < 1 || props.quality > 100)) {
      throw new ImageInvalidKeyError('Transform quality must be between 1 and 100.');
    }
    if (props.blur !== undefined && (props.blur < 0 || props.blur > 100)) {
      throw new ImageInvalidKeyError('Transform blur must be between 0 and 100.');
    }
    if (props.sharpen !== undefined && (props.sharpen < 0 || props.sharpen > 100)) {
      throw new ImageInvalidKeyError('Transform sharpen must be between 0 and 100.');
    }
    if (props.crop && (props.crop.width <= 0 || props.crop.height <= 0)) {
      throw new ImageInvalidKeyError('Crop dimensions must be positive.');
    }
  }

  get width(): number | undefined {
    return this._props.width;
  }

  get height(): number | undefined {
    return this._props.height;
  }

  get fit(): ImageResizeFit | undefined {
    return this._props.fit;
  }

  get format(): ImageFormat | undefined {
    return this._props.format;
  }

  get quality(): number | undefined {
    return this._props.quality;
  }

  get rotate(): number | undefined {
    return this._props.rotate;
  }

  get flip(): boolean | undefined {
    return this._props.flip;
  }

  get flop(): boolean | undefined {
    return this._props.flop;
  }

  get background(): string | undefined {
    return this._props.background;
  }

  get blur(): number | undefined {
    return this._props.blur;
  }

  get sharpen(): number | undefined {
    return this._props.sharpen;
  }

  get crop(): { x: number; y: number; width: number; height: number } | undefined {
    return this._props.crop;
  }

  get preset(): string | undefined {
    return this._props.preset;
  }

  equals(other: ImageTransform): boolean {
    return JSON.stringify(this._props) === JSON.stringify(other._props);
  }

  toObject(): ImageTransformProps {
    return { ...this._props };
  }
}
