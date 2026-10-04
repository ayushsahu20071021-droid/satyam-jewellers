import type { Metadata, Viewport } from "next";
import SiteExperience from "@/components/site-experience";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const heroOgImage = siteUrl ? `${siteUrl}/images/hero/hero-cinematic.jpg` : undefined;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: siteUrl } } : {}),
  title: {
    default: "Satyam Jewellers | Jewellery That Becomes Your Story",
    template: "%s | Satyam Jewellers",
  },
  description:
    "Discover timeless jewellery at Satyam Jewellers in Adhartal, Jabalpur. Explore bridal, gold and diamond design references, then visit the showroom for a personal conversation.",
  applicationName: "Satyam Jewellers",
  keywords: [
    "jewellery in Jabalpur",
    "jewellers in Jabalpur",
    "jewellery shop in Jabalpur",
    "jewellery shop Adhartal",
    "jewellers Adhartal",
    "gold jewellery Jabalpur",
    "gold jewellery Adhartal",
    "bridal jewellery Jabalpur",
    "diamond jewellery Jabalpur",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Satyam Jewellers",
    title: "Satyam Jewellers | Jewellery That Becomes Your Story",
    description:
      "A more personal way to discover jewellery in Adhartal, Jabalpur.",
    ...(heroOgImage ? { images: [{ url: heroOgImage, width: 1536, height: 1024, alt: "Satyam Jewellers editorial campaign" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Satyam Jewellers | Jewellery That Becomes Your Story",
    description: "A more personal way to discover jewellery in Adhartal, Jabalpur.",
    ...(heroOgImage ? { images: [heroOgImage] } : {}),
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090807",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteExperience>{children}</SiteExperience>
      </body>
    </html>
  );
}
