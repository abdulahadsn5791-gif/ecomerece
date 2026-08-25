import type { NextConfig } from "next";

const nextConfig = {
  transpilePackages: ['@ecomerece/domain', '@ecomerece/shared'],
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ],
};
export default nextConfig;
