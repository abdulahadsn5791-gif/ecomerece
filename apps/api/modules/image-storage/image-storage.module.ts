import type { IImageStoragePort } from '@ecomerece/domain';
import { CloudinaryAdapter } from './infrastructure/cloudinary.adapter';
import { loadCloudinaryConfig } from './infrastructure/cloudinary.config';

let singleton: IImageStoragePort | null = null;

/**
 * Returns the image-storage adapter for the current environment.
 * Currently only Cloudinary is supported — add new providers here when
 * more adapters are wired.
 */
export function createImageStorageModule(): IImageStoragePort {
  if (singleton) return singleton;

  const provider = (process.env.IMAGE_STORAGE_PROVIDER ?? 'cloudinary').toLowerCase();

  if (provider !== 'cloudinary') {
    throw new Error(`Unknown IMAGE_STORAGE_PROVIDER "${provider}". Supported: cloudinary.`);
  }

  singleton = new CloudinaryAdapter(loadCloudinaryConfig());
  return singleton;
}
