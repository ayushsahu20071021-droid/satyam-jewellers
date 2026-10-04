import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const netlify = process.env.NETLIFY === "true";
const staticExport = githubPages || netlify;
const basePath = githubPages ? "/satyam-jewellers" : "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.e2b.app"],
  ...(staticExport
    ? { output: "export" as const, ...(githubPages ? { basePath } : {}), trailingSlash: true }
    : {}),
  images: {
    qualities: [75, 88],
    ...(staticExport ? { unoptimized: true } : {}),
  },
};

export default nextConfig;
