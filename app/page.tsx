import type { Metadata } from "next";
import HomePage from "@/components/home-page";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Satyam Jewellers in Adhartal, Jabalpur | Gold & Bridal Jewellery",
  description:
    "Discover gold, diamond and bridal jewellery at Satyam Jewellers in Adhartal, Jabalpur. Explore collections, craftsmanship and occasion-led designs.",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["JewelryStore", "LocalBusiness"],
  name: "Satyam Jewellers",
  description:
    "Jewellery showroom in Adhartal, Jabalpur offering gold, diamond and bridal jewellery.",
  ...(siteUrl ? { url: siteUrl } : {}),
  areaServed: [
    { "@type": "City", name: "Jabalpur" },
    { "@type": "AdministrativeArea", name: "Madhya Pradesh" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adhartal, Jabalpur",
    addressRegion: "Madhya Pradesh",
    postalCode: "482004",
    addressCountry: "IN",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Satyam Jewellers Jabalpur",
  ...(siteUrl ? { url: siteUrl } : {}),
  description: "Official website of Satyam Jewellers in Adhartal, Jabalpur.",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusiness, websiteSchema]) }}
      />
      <HomePage />
    </>
  );
}
