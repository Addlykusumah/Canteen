import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/public/**",
      },
      {
        protocol: "https",
        hostname: "canteen-ekama.up.railway.app",
        pathname: "/public/**",
      },
    ],
  },
};

export default nextConfig;