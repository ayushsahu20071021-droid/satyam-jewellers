import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalArticle from "@/components/journal-article";
import { journalArticles } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!article) return { title: "Journal note not found" };
  return {
    title: article.title,
    description: article.intro,
    ...(siteUrl ? { alternates: { canonical: `${siteUrl}/journal/${article.slug}` } } : {}),
    ...(siteUrl ? { openGraph: { images: [`${siteUrl}${article.image}`] } } : {}),
  };
}

export default async function JournalRoute({ params }: Props) {
  const { slug } = await params;
  const article = journalArticles.find((item) => item.slug === slug);
  if (!article) notFound();
  return <JournalArticle article={article} />;
}
