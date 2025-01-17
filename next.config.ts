import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Clean the output directory before building
  cleanDistDir: true,

  // Optimize the build output
  compress: true, // Enable compression for smaller output files
};

export default nextConfig;
