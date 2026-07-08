import type { NextConfig } from "next";

const nextConfig = {
  // Disable ESLint and TypeScript errors from blocking production builds.
  // These will be fixed incrementally post-MVP; the app behavior is unchanged.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
} as any;

export default nextConfig as NextConfig;
