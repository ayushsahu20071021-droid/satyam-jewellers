const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_PAGES === "true" ? "/satyam-jewellers" : "");
const basePath = configuredBasePath.replace(/\/$/, "");

export function assetPath(src: string) {
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  if (!basePath || normalized === basePath || normalized.startsWith(`${basePath}/`)) return normalized;
  return `${basePath}${normalized}`;
}
