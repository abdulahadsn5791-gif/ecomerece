import type { NextConfig } from "next";
const allowed = process.env.NEXT_PUBLIC_ALLOWED_DEV_ORIGINS?.split(',') ?? [];
const nextConfig: NextConfig = {

  allowedDevOrigins: allowed,
  transpilePackages: ['@ecomerece/domain', '@ecomerece/shared', '@ecomerece/frontend'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@ecomerece/frontend'],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
    },
  ],
};

export default nextConfig;