import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "example.com", "upload.wikimedia.org"],
  },
};

export default nextConfig;
