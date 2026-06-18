import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    experimental: {
        serverActions: {
          bodySizeLimit: "10mb",
        },
      },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "joblin.runasp.net",
        pathname: "/**",
        search: '',
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      }
      
    ],
  },
};

export default nextConfig;
