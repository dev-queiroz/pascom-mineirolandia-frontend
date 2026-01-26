import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'pascom-backend.onrender.com',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;