import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/satyam-jewellers" : "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app"],
  ...(githubPages ? { output: "export" as const, basePath, trailingSlash: true } : {}),
  images: {
    qualities: [75, 88],
    ...(githubPages ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
