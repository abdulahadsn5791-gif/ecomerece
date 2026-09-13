import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.110', '108.165.233.182'],
  transpilePackages: ['@ecomerece/domain', '@ecomerece/shared', '@ecomerece/frontend'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@ecomerece/frontend'],
  },
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8000/:path*',
    },
  ],
};

export default nextConfig;