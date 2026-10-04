"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { useSiteUI } from "@/components/site-experience";
import { collections, journalArticles, products } from "@/lib/data";
import { assetPath } from "@/lib/site";

type EditorialData = { title: string; overline: string; description: string; image: string; label?: string };

function Eyebrow({ children }: { children: React.ReactNode }) { return <div className="section-eyebrow"><span className="eyebrow-rule"/><span>{children}</span></div>; }

export default function EditorialPage({ slug, page }: { slug: string; page: EditorialData }) {
  const isJournal = slug === "journal";
  const isContact = slug === "contact";
  const isCraft = slug === "craftsmanship";
  const isAbout = slug === "about";
  const shownCollections = slug === "bridal" ? collections.filter((item) => item.title === "Bridal" || item.title === "Gold" || item.title === "Diamonds")
    : slug === "gold-jewellery" ? collections.filter((item) => item.title === "Gold" || item.title === "Daily elegance" || item.title === "Festive")
      : slug === "diamond-jewellery" ? collections.filter((item) => item.title === "Diamonds" || item.title === "Statement" || item.title === "Bridal") : collections;

  return (
    <div className={`editorial-page editorial-${slug}`}>
      <section className="editorial-hero">
        <div className="editorial-hero-image"><Image src={assetPath(page.image)} alt={slug === "contact" ? "Bridal editorial campaign photograph" : "Jewellery editorial photograph"} fill priority sizes="(max-width: 760px) 100vw, 58vw" className="editorial-hero-photo" /></div>
        <div className="editorial-hero-shade" />
        <div className="editorial-hero-copy">
          <div className="editorial-breadcrumb"><Link href="/">HOME</Link><span>/</span><span>{page.overline}</span></div>
          <p className="editorial-overline">{page.overline}</p>
          <h1>{page.title.split("\n").map((line, index) => <span key={line}>{index === 1 ? <em>{line}</em> : line}<br /></span>)}</h1>
          <p className="editorial-description">{page.description}</p>
          <div className="editorial-hero-actions"><Link href={isContact ? "#showroom-contact" : slug === "bridal" ? "/contact" : "/collections"} className="button-outline">{isContact ? "Find the showroom" : slug === "bridal" ? "Request a bridal consultation" : "Explore the collections"}<ArrowUpRight size={15}/></Link><a className="editorial-scroll" href="#editorial-body"><ArrowDown size={14}/> SCROLL TO EXPLORE</a></div>
        </div>
        <div className="editorial-hero-side">SATYAM JEWELLERS · JABALPUR</div>
        <div className="editorial-hero-foot"><span>{slug.toUpperCase()} / 01</span><span>JEWELLERY THAT BECOMES YOUR STORY</span></div>
      </section>

      {isJournal ? <JournalBody /> : isContact ? <ContactBody /> : isAbout ? <AboutBody /> : isCraft ? <CraftBody /> : <CollectionBody slug={slug} items={shownCollections} />}
    </div>
  );
}

function CollectionBody({ slug, items }: { slug: string; items: typeof collections }) {
  const { openPanel } = useSiteUI();
  const related = slug === "bridal" ? products.slice(0, 1) : slug === "gold-jewellery" ? products.slice(1, 2) : slug === "diamond-jewellery" ? products.slice(2) : products;
  return <div id="editorial-body">
    <section className="editorial-note-block section-pad">
      <Eyebrow>DISCOVER AT YOUR OWN PACE</Eyebrow>
      <div className="editorial-note-layout"><h2>Start with what<br /><em>speaks to you.</em></h2><div><p>Explore this edit as a starting point. The imagery is here to set a mood; our showroom is where you can see current designs, compare details and find the piece that feels right.</p><button className="text-link" onClick={() => openPanel("appointment")}>Plan a showroom visit <ArrowUpRight size={15}/></button></div></div>
    </section>
    <section className="editorial-collection-grid section-pad"><div className="editorial-section-head"><Eyebrow>THE COLLECTIONS</Eyebrow><span>01 — {String(items.length).padStart(2, "0")}</span></div><div className="editorial-tiles">{items.map((item) => <Link className="editorial-tile" href={item.href} key={item.number}><div><Image src={assetPath(item.image)} alt={item.alt} fill sizes="(max-width: 760px) 82vw, 40vw"/><span className="editorial-tile-number">{item.number}</span><span className="editorial-tile-arrow"><ArrowUpRight size={17}/></span></div><span className="editorial-tile-subtitle">{item.subtitle}</span><h3>{item.title}</h3></Link>)}</div></section>
    <section className="editorial-feature-row section-pad"><div className="editorial-feature-copy"><Eyebrow>A CLOSER LOOK</Eyebrow><h2>Pieces with<br /><em>a point of view.</em></h2><p>These visual references are a way to begin a conversation—not a catalogue of live inventory. Speak with the showroom team about the designs currently available.</p><Link href="/contact" className="button-outline">Visit Satyam <ArrowUpRight size={15}/></Link></div><div className="editorial-product-strip">{related.map((product) => <Link href={`/products/${product.slug}`} className="editorial-product" key={product.slug}><div><Image src={assetPath(product.images[0].src)} alt={product.images[0].alt} fill sizes="(max-width: 760px) 75vw, 35vw"/><span>DESIGN REFERENCE</span><ArrowUpRight size={17}/></div><small>{product.category} · design reference</small><h3>{product.name}</h3><span>Enquire for current designs <ArrowRight size={13}/></span></Link>)}</div></section>
    <div className="editorial-bottom-cta section-pad"><div><span>THE NEXT STEP</span><h2>See what feels <em>like you.</em></h2></div><button className="button-gold" onClick={() => openPanel("appointment")}>Request a private consultation <ArrowUpRight size={15}/></button></div>
  </div>;
}

function AboutBody() {
  const { openPanel } = useSiteUI();
  return <div id="editorial-body"><section className="about-values section-pad"><div><Eyebrow>OUR STORY</Eyebrow><h2>A jewellery destination<br />in <em>Jabalpur.</em></h2></div><div className="about-values-copy"><p>Satyam Jewellers welcomes you to discover jewellery in Adhartal, with a considered approach to the pieces, questions and moments that bring people through the showroom door.</p><p>We believe a meaningful choice deserves time: the chance to look closely, ask about details and find something that feels personal. The story begins with you.</p><span className="about-signoff">SATYAM JEWELLERS <i>·</i> ADHARTAL</span><button className="text-link" onClick={() => openPanel("appointment")}>Come and discover <ArrowUpRight size={15}/></button></div></section><section className="about-image-break"><Image src={assetPath("/images/campaign/campaign-bridal.jpg")} alt="A jewellery campaign moment captured in shadow and warm light" fill sizes="100vw"/><div className="about-image-vignette"/><span>CRAFTED FOR MOMENTS.<br/><em>DESIGNED TO LAST.</em></span></section><section className="about-values about-values-reverse section-pad"><div><Eyebrow>OUR PROMISE TO YOU</Eyebrow><h2>Discover.<br /><em>Enquire. Visit.</em></h2></div><div className="about-values-copy"><p>A beautiful online experience can open the door. The showroom is where you can explore current pieces in person and receive details confirmed by the team.</p><p>Whether you are planning for a celebration or simply following a feeling, you are welcome to take your time.</p><Link href="/contact" className="button-outline">Find us in Adhartal <ArrowUpRight size={15}/></Link></div></section></div>;
}

function CraftBody() {
  return <div id="editorial-body"><section className="craft-editorial section-pad"><div className="craft-editorial-intro"><Eyebrow>CRAFT & CONSIDERATION</Eyebrow><h2>Look closely.<br /><em>There’s more to see.</em></h2><p>Jewellery rewards a slower look. Follow the form, notice the small details and ask the questions that help you understand each piece.</p></div><div className="craft-editorial-image"><Image src={assetPath("/images/story/craft-detail.jpg")} alt="Hands concentrating on a small jewellery detail" fill sizes="(max-width: 760px) 100vw, 50vw"/><span>THE BEAUTY IS IN THE DETAILS</span></div><div className="craft-editorial-steps">{[{ n: "01", t: "Look at the form", d: "Notice how a piece sits, moves and catches the light." }, { n: "02", t: "Ask about its details", d: "The team can confirm materials, purity and other specifications for each available design." }, { n: "03", t: "Find the feeling", d: "Take the time to understand what you love about it and how it fits your moment." }].map((item) => <div key={item.n}><span>{item.n}</span><h3>{item.t}</h3><p>{item.d}</p><ArrowUpRight size={16}/></div>)}</div></section><section className="editorial-bottom-cta section-pad"><div><span>A CLOSER LOOK, IN PERSON</span><h2>Come see for <em>yourself.</em></h2></div><Link href="/contact" className="button-gold">Visit the showroom <ArrowUpRight size={15}/></Link></section></div>;
}

function ContactBody() {
  const { openPanel } = useSiteUI();
  const mapSearch = encodeURIComponent("Adhartal, Jabalpur, Madhya Pradesh, India");
  return <div id="editorial-body"><section id="showroom-contact" className="contact-editorial section-pad"><div className="contact-editorial-copy"><Eyebrow>THE SHOWROOM</Eyebrow><h2>Make time<br /><em>for a visit.</em></h2><p>Find Satyam Jewellers in Adhartal, Jabalpur. Come to explore, ask questions and find the piece that feels right.</p><div className="contact-address"><MapPin size={16}/><span><strong>Satyam Jewellers</strong><br/>Adhartal<br/>Jabalpur, Madhya Pradesh<br/>India</span></div><a href={`https://www.google.com/maps/search/?api=1&query=${mapSearch}`} target="_blank" rel="noreferrer" className="button-outline">Get directions <ArrowUpRight size={15}/></a><span className="contact-address-note">The location link opens a search for Adhartal, Jabalpur. Please confirm the exact showroom pin before travelling.</span></div><div className="contact-editorial-map"><div className="map-grid-lines"/><div className="map-road road-one"/><div className="map-road road-two"/><div className="map-road road-three"/><div className="map-park park-one"/><div className="map-park park-two"/><div className="map-pin"><span>S</span><i/></div><div className="map-label map-label-one">ADHARTAL</div><div className="map-label map-label-two">JABALPUR</div><span className="map-scale">LOCATION SEARCH · NOT A PINNED ADDRESS</span></div></section><section className="contact-appointment section-pad"><div><Eyebrow>A MOMENT, JUST FOR YOU</Eyebrow><h2>Request a private<br /><em>consultation.</em></h2><p>Share a little about your visit. This prototype form shows the intended booking experience; it does not send or store personal details.</p><button className="button-gold" onClick={() => openPanel("appointment")}>Request a visit <ArrowUpRight size={15}/></button></div><div className="contact-info-grid"><div><span>01</span><h3>Come as you are.</h3><p>Whether you know exactly what you want or are just beginning, there’s room to explore.</p></div><div><span>02</span><h3>Ask the details.</h3><p>Confirm product information and availability with the showroom team directly.</p></div></div></section></div>;
}

function JournalBody() {
  return <section id="editorial-body" className="journal-page section-pad"><div className="journal-page-intro"><Eyebrow>THE SATYAM JOURNAL</Eyebrow><h2>For the moments<br /><em>in between.</em></h2><p>Thoughtful guides and notes on choosing, wearing and caring for jewellery. Advice is intended as a starting point; ask the showroom team about specific pieces.</p></div><div className="journal-page-grid">{journalArticles.map((article, index) => <Link className="journal-page-card" href={`/journal/${article.slug}`} key={article.slug}><div><Image src={assetPath(article.image)} alt="" fill sizes="(max-width: 760px) 85vw, 40vw"/><span>0{index + 1} <ArrowUpRight size={15}/></span></div><small>{article.tag}</small><h3>{article.title}</h3><p>{article.intro}</p><span className="journal-page-read">READ THE NOTE <ArrowRight size={13}/></span></Link>)}</div><div className="journal-disclaimer"><Sparkles size={15}/> Made for inspiration, not as a substitute for piece-specific advice. Confirm details with the showroom team.</div></section>;
}

