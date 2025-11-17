import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: ["s4.anilist.co", "cdn.myanimelist.net", "img1.ak.crunchyroll.com", "lh3.googleusercontent.com"],
  },
  webpack: (config) => {
    // Ensure '@' alias resolves to 'src' in all environments (including Vercel)
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
