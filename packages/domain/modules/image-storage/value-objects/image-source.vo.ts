import type { ReadableStream } from 'node:stream/web';

/** Binary payload accepted by the storage port. */
export type ImageSourceData = Uint8Array | ArrayBuffer | ReadableStream<Uint8Array>;

/**
 * The raw image payload to upload, together with the content type and
 * optional content length. Adapters read from `data` and stream or buffer it
 * as their provider expects.
 */
export class ImageSource {
  private constructor(
    readonly data: ImageSourceData,
    readonly contentType: string,
    readonly sizeBytes?: number,
    readonly fileName?: string,
  ) {}

  /** Creates a source from an in-memory byte buffer. */
  static fromBytes(
    data: Uint8Array | ArrayBuffer,
    contentType: string,
    fileName?: string,
  ): ImageSource {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    return new ImageSource(bytes, contentType, bytes.byteLength, fileName);
  }

  /** Creates a source from a readable stream (streaming uploads). */
  static fromStream(
    stream: ReadableStream<Uint8Array>,
    contentType: string,
    options?: { sizeBytes?: number; fileName?: string },
  ): ImageSource {
    return new ImageSource(stream, contentType, options?.sizeBytes, options?.fileName);
  }

  static rehydrate(
    data: ImageSourceData,
    contentType: string,
    sizeBytes?: number,
    fileName?: string,
  ): ImageSource {
    return new ImageSource(data, contentType, sizeBytes, fileName);
  }
}
