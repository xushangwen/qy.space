import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    // 开发环境禁用优化，避免本地代理（如 Surge）造成的 "resolved to private ip" 错误
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eiviaoelmjlkabnwrhcz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
    // 启用图片优化
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // 实验性优化
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
