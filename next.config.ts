import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    // skip ESLint during builds
    eslint: {
      ignoreDuringBuilds: true,
    },
    // skip TypeScript errors during builds
    typescript: {
      ignoreBuildErrors: true,
    },
};

export default nextConfig;
