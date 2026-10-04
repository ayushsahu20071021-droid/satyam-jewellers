import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import { products } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!product) return { title: "Piece not found" };
  return {
    title: `${product.name} · Design Reference`,
    description: product.description,
    ...(siteUrl ? { alternates: { canonical: `${siteUrl}/products/${product.slug}` } } : {}),
    ...(siteUrl ? { openGraph: { images: [`${siteUrl}${product.images[0].src}`] } } : {}),
  };
}

export default async function ProductRoute({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
