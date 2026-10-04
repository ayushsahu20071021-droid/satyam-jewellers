import type { Metadata } from "next";
import HomePage from "@/components/home-page";

export const metadata: Metadata = {
  title: "Satyam Jewellers in Adhartal, Jabalpur | Jewellery That Becomes Your Story",
  description:
    "Discover bridal, gold and diamond jewellery at Satyam Jewellers in Adhartal, Jabalpur. Explore the editorial collections, then visit for a personal conversation.",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "Satyam Jewellers",
  description: "A jewellery destination in Adhartal, Jabalpur, Madhya Pradesh.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adhartal, Jabalpur",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
};

export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} /><HomePage /></>;
}
