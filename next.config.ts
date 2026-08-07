import type { NextConfig } from "next";

// When building for GitHub Pages we set NEXT_PUBLIC_BASE_PATH=/lumiere-beauty
// so all assets are served from https://<user>.github.io/lumiere-beauty/
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Static HTML export — required for GitHub Pages hosting
  output: "export",
  // GitHub Pages serves assets under /<repo>/, so we need a matching basePath
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // GitHub Pages has no Next.js image optimizer
  images: {
    unoptimized: true,
  },
  // Emit trailing slashes so folders resolve to index.html on static hosts
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Keep dev-only allowed origins; harmless in production builds
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
