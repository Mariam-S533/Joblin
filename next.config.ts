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
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
            {
        protocol: "https",
        hostname: "logos.hunter.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.companyenrich.com",
        pathname: "/**",
      },
      
    ],
  },
};

export default nextConfig;
