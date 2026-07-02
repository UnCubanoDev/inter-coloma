import type { NextConfig } from "next";

const repoName = "/inter-coloma";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.PAGES_BASE_URL ? new URL(process.env.PAGES_BASE_URL).pathname : repoName,
  assetPrefix: process.env.PAGES_BASE_URL ? new URL(process.env.PAGES_BASE_URL).pathname : repoName,
};

export default nextConfig;
