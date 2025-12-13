import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Add your config here */
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
