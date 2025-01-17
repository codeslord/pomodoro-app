import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export if you're using `next export`
  output: "export", // Uncomment this if you're generating a static site

  // Clean the output directory before building
  cleanDistDir: true,

  // Optimize the build output
  compress: true, // Enable compression for smaller output files

  // Disable source maps in production to reduce file size
  productionBrowserSourceMaps: false,

  // Enable React Strict Mode (optional)
  reactStrictMode: true,

  // Configure images optimization (if using `next/image`)
  images: {
    unoptimized: true, // Disable image optimization if using `next export`
  },

  // Configure Webpack to reduce bundle size
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce the size of client-side bundles
      config.optimization.splitChunks = {
        chunks: "all",
        maxSize: 200000, // Split chunks into smaller files (200 KB)
      };
    }
    return config;
  },
};

export default nextConfig;
