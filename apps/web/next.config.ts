import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.110'],
  transpilePackages: ['@ecomerece/domain', '@ecomerece/shared', '@ecomerece/frontend'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@ecomerece/frontend'],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/api/:path*',
    },
  ],
};

export default nextConfig;