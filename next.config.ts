import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan akses dari IP HP Anda saat mode development
  allowedDevOrigins: ["192.168.100.44"],
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;