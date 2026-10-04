import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const paths = [
  "",
  "/collections",
  "/bridal",
  "/gold-jewellery",
  "/diamond-jewellery",
  "/about",
  "/craftsmanship",
  "/contact",
  "/journal",
  "/journal/choosing-a-bridal-necklace",
  "/journal/questions-about-gold",
  "/journal/caring-for-jewellery",
  "/journal/finding-your-diamond-style",
  "/journal/jewellery-for-festive-moments",
  "/journal/when-minimal-feels-like-enough",
  "/products/heritage-necklace",
  "/products/light-in-gold",
  "/products/modern-heirloom",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Set NEXT_PUBLIC_SITE_URL to the verified production domain before launch.
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!base) return [];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/products") ? 0.6 : 0.8,
  }));
}
