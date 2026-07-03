import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(process.env.PAGES_BASE_URL ? {
    basePath: new URL(process.env.PAGES_BASE_URL).pathname,
    assetPrefix: new URL(process.env.PAGES_BASE_URL).pathname,
  } : {}),
};

export default nextConfig;
