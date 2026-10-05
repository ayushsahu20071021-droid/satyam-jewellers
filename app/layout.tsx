import type { Metadata, Viewport } from "next";
import SiteExperience from "@/components/site-experience";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const heroOgImage = siteUrl ? `${siteUrl}/images/hero/hero-cinematic.jpg` : undefined;

export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: siteUrl } }
    : {}),
  title: {
    default: "Satyam Jewellers Jabalpur | Gold, Diamond & Bridal Jewellery",
    template: "%s | Satyam Jewellers Jabalpur",
  },
  description:
    "Satyam Jewellers in Adhartal, Jabalpur — explore gold jewellery, diamond jewellery and bridal jewellery collections, craftsmanship and occasion-led designs.",
  applicationName: "Satyam Jewellers",
  category: "Jewellery",
  keywords: [
    "Satyam Jewellers Jabalpur",
    "Satyam Jewellers Adhartal",
    "jewellery shop in Jabalpur",
    "jewellers in Jabalpur",
    "best jewellers in Jabalpur",
    "gold jewellery Jabalpur",
    "diamond jewellery Jabalpur",
    "bridal jewellery Jabalpur",
    "wedding jewellery Jabalpur",
    "gold jewellery Adhartal",
    "diamond jewellery Adhartal",
    "bridal jewellery Adhartal",
    "jewellery showroom Jabalpur",
  ],
  authors: [{ name: "Satyam Jewellers" }],
  creator: "Satyam Jewellers",
  publisher: "Satyam Jewellers",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Satyam Jewellers Jabalpur",
    title: "Satyam Jewellers Jabalpur | Gold, Diamond & Bridal Jewellery",
    description:
      "Explore gold, diamond and bridal jewellery from Satyam Jewellers in Adhartal, Jabalpur.",
    ...(heroOgImage
      ? {
          images: [{
            url: heroOgImage,
            width: 1536,
            height: 1024,
            alt: "Satyam Jewellers jewellery editorial campaign",
          }],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Satyam Jewellers Jabalpur | Gold, Diamond & Bridal Jewellery",
    description:
      "Explore gold, diamond and bridal jewellery from Satyam Jewellers in Adhartal, Jabalpur.",
    ...(heroOgImage ? { images: [heroOgImage] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090807",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <SiteExperience>{children}</SiteExperience>
      </body>
    </html>
  );
}
