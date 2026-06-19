import type { NextConfig } from "next";
import { redirects } from "./src/data/redirects";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "commscloud.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.commscloud.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [...redirects];
  },
};

export default nextConfig;
