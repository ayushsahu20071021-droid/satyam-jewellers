import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorialPage from "@/components/editorial-page";
import { pageCopy } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(pageCopy).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pageCopy[slug];
  if (!page) return { title: "Page not found" };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return {
    title: `${page.overline.replaceAll("—", " ")} | Satyam Jewellers`,
    description: page.description,
    ...(siteUrl ? { alternates: { canonical: `${siteUrl}/${slug}` } } : {}),
    openGraph: {
      title: `${page.overline} | Satyam Jewellers`,
      description: page.description,
      ...(siteUrl ? { images: [`${siteUrl}${page.image}`] } : {}),
    },
  };
}

export default async function EditorialRoute({ params }: Props) {
  const { slug } = await params;
  const page = pageCopy[slug];
  if (!page) notFound();
  return <EditorialPage slug={slug} page={page} />;
}
