import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dwrnng1he/**'
      }
    ],
  },
  env: {
    PYTHON_SERVICE_URL: process.env.PYTHON_SERVICE_URL || 'python-app:5000',
  },
};

export default nextConfig;
