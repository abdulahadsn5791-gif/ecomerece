import type { NextConfig } from 'next';

const allowed =
  process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
const apiBase = process.env.NEXT_PUBLIC_API_URL?.trim()
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:8000';
const nextConfig: NextConfig = {
  allowedDevOrigins: allowed,
  transpilePackages: ['@ecomerece/domain', '@ecomerece/shared', '@ecomerece/frontend'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@ecomerece/frontend'],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${apiBase}/:path*`,
    },
  ],
};

export default nextConfig;
