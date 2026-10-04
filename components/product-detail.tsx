"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Heart, Info, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { assetPath } from "@/lib/site";
import { products } from "@/lib/data";
import { useSiteUI } from "@/components/site-experience";

const ThreeViewer = dynamic(() => import("@/components/three-viewer"), { ssr: false, loading: () => <div className="viewer-preparing">Preparing the view…</div> });

export default function ProductDetail({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, openPanel } = useSiteUI();
  const [showView, setShowView] = useState(false);
  const saved = isWishlisted(product.slug);
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 2);
  const priceLabel = product.price === null
    ? "Enquire for details"
    : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price);
  const materialAndPurity = [product.metal, product.purity].filter(Boolean).join(" · ") || "To be confirmed";
  const weightLabel = product.weight === null ? "To be confirmed" : `${product.weight} g`;
  const gemstoneLabel = product.gemstones?.length ? product.gemstones.join(", ") : "To be confirmed";
  const availabilityLabel = product.availability === "available" ? "Available in showroom" : product.availability === "made-to-order" ? "Ask about ordering" : product.availability === "unavailable" ? "Currently unavailable" : "Ask in showroom";
  return (
    <div className="product-detail-page">
      <div className="product-breadcrumb"><Link href="/">HOME</Link><span>/</span><Link href="/collections">COLLECTIONS</Link><span>/</span><span>{product.name.toUpperCase()}</span></div>
      <section className="product-detail-layout">
        <div className="product-detail-visual">
          {showView ? <ThreeViewer image={assetPath(product.images[0].src)} alt={product.images[0].alt} /> : <div className="product-detail-image"><Image src={assetPath(product.images[0].src)} alt={product.images[0].alt} fill priority sizes="(max-width: 850px) 100vw, 58vw" className="product-detail-photo"/><span className="product-detail-image-label">EDITORIAL DESIGN REFERENCE</span><span className="product-detail-image-index">SJ / 0{products.findIndex((item) => item.slug === product.slug) + 1}</span></div>}
          <div className="product-visual-actions"><button onClick={() => setShowView((current) => !current)}><Maximize2 size={14}/>{showView ? "VIEW IMAGE" : "360° STUDY"}</button><span>IMAGE FOR PRESENTATION</span></div>
        </div>
        <div className="product-detail-copy">
          <div className="product-detail-topline"><Link href="/collections"><ArrowLeft size={14}/> BACK TO COLLECTIONS</Link><button className={`product-detail-heart${saved ? " is-saved" : ""}`} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={saved} onClick={() => toggleWishlist(product.slug)}><Heart size={19} fill={saved ? "currentColor" : "none"}/></button></div>
          <span className="product-detail-category">{product.category.toUpperCase()} · {product.subcategory.toUpperCase()}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-note">{product.note}</p>
          <div className="product-detail-description"><p>{product.description}</p></div>
          <div className="product-enquire-price"><span>PRICE & AVAILABILITY</span><strong>{priceLabel}</strong><small>{product.price === null ? "Confirmed in person for current designs." : "Listed price for this design."}</small></div>
          <div className="product-detail-table"><div><span>Material & purity</span><strong>{materialAndPurity}</strong></div><div><span>Weight</span><strong>{weightLabel}</strong></div><div><span>Gemstones</span><strong>{gemstoneLabel}</strong></div><div><span>Availability</span><strong>{availabilityLabel}</strong></div></div>
          <div className="product-detail-ctas"><button className="button-gold" onClick={() => openPanel("appointment")}>Enquire about this style <ArrowUpRight size={15}/></button><Link className="button-outline" href="/contact">Book a showroom visit <ArrowRight size={15}/></Link></div>
          <div className="product-disclaimer"><Info size={15}/><p>This is an editorial design reference, not a live product listing. Imagery is illustrative. Materials, purity, weight, gemstone details, pricing and availability must be verified with Satyam Jewellers.</p></div>
        </div>
      </section>
      <section className="product-story-note"><span>THE PIECE, IN CONTEXT</span><h2>A closer look.<br /><em>A personal conversation.</em></h2><p>Explore the shape and feeling of this design reference, then visit the showroom to discover available pieces and their confirmed details.</p><button className="text-link" onClick={() => openPanel("appointment")}>Plan a visit <ArrowUpRight size={15}/></button></section>
      <section className="related-products section-pad"><div className="related-head"><span>YOU MAY ALSO EXPLORE</span><Link href="/collections">VIEW ALL <ArrowUpRight size={14}/></Link></div><div className="related-grid">{related.map((item) => <Link href={`/products/${item.slug}`} className="related-card" key={item.slug}><div><Image src={assetPath(item.images[0].src)} alt={item.images[0].alt} fill sizes="40vw"/><ArrowUpRight size={17}/></div><small>{item.category}</small><h3>{item.name}</h3></Link>)}</div></section>
    </div>
  );
}
