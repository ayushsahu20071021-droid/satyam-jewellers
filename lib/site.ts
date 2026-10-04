const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

export function assetPath(src: string) {
  if (/^(https?:|data:)/i.test(src)) return src;
  return `${basePath}${src.startsWith("/") ? src : `/${src}`}`;
}
