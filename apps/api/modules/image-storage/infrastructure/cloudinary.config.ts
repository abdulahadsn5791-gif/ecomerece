export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  secure?: boolean;
  folder?: string;
}

export function loadCloudinaryConfig(): CloudinaryConfig {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must all be set.',
    );
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    secure: process.env.CLOUDINARY_SECURE !== 'false',
    folder: process.env.CLOUDINARY_FOLDER || undefined,
  };
}
