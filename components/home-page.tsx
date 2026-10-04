"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { CSSProperties, MouseEvent, useEffect, useRef, useState } from "react";
import { collections, products } from "@/lib/data";
import { assetPath } from "@/lib/site";
import { useSiteUI } from "@/components/site-experience";

const ThreeViewer = dynamic(() => import("@/components/three-viewer"), {
  ssr: false,
  loading: () => <div className="viewer-preparing">Preparing the view…</div>,
});

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.13, rootMargin: "0px 0px -50px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

function SectionEyebrow({ children, number }: { children: React.ReactNode; number?: string }) {
  return <div className="section-eyebrow"><span className="eyebrow-rule" /><span>{children}</span>{number && <span className="eyebrow-number">{number}</span>}</div>;
}

function Hero() {
  const section = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const current = window.scrollY;
      setScrollProgress(Math.min(1, current / Math.max(1, window.innerHeight * 0.78)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    event.currentTarget.style.setProperty("--image-x", `${x * -12}px`);
    event.currentTarget.style.setProperty("--image-y", `${y * -12}px`);
    event.currentTarget.style.setProperty("--text-x", `${x * 3}px`);
    event.currentTarget.style.setProperty("--text-y", `${y * 3}px`);
  };

  return (
    <section ref={section} className="hero" onMouseMove={onMove} aria-labelledby="hero-heading">
      <div className="hero-image-wrap" style={{ transform: `scale(${1 + scrollProgress * 0.07}) translateY(${scrollProgress * 20}px) translate3d(var(--image-x, 0px), var(--image-y, 0px), 0)` }}>
        <Image src={assetPath("/images/hero/hero-cinematic.jpg")} alt="An Indian woman wearing gold jewellery in a dark editorial campaign portrait" fill priority sizes="100vw" className="hero-image" quality={88} />
      </div>
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-particles" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} className={`particle particle-${i + 1}`} />)}</div>
      <div className="hero-shade" />
      <div className="hero-side-note">ADHARTAL <span /> JABALPUR</div>
      <div className="hero-content" style={{ opacity: 1 - scrollProgress * 0.65, transform: `translate3d(var(--text-x, 0px), var(--text-y, 0px), 0)` }}>
        <p className="hero-kicker"><span className="kicker-star">✳</span> SATYAM JEWELLERS <span className="kicker-separator">·</span> JABALPUR</p>
        <h1 id="hero-heading">Where <em>gold</em><br />becomes<br /><em>memory.</em></h1>
        <p className="hero-description">Timeless jewellery, thoughtfully considered for life’s most unforgettable moments.</p>
        <div className="hero-actions">
          <Link href="/collections" className="button-outline button-hero">Explore collections <ArrowUpRight size={15} /></Link>
          <Link href="/contact" className="hero-secondary-link">Visit our showroom <ArrowDownRight size={15} /></Link>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="hero-bottom-label">A MORE PERSONAL WAY TO DISCOVER</span>
        <a href="#the-story" className="hero-scroll-link"><span>SCROLL TO EXPLORE</span><span className="hero-scroll-icon"><ArrowDown size={13} /></span></a>
        <span className="hero-index">01 <i /> 06</span>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="manifesto-section section-pad" id="the-story">
      <div className="manifesto-topline">
        <SectionEyebrow number="01">OUR POINT OF VIEW</SectionEyebrow>
        <span className="manifesto-location">A SHOWROOM, OPEN TO THE WORLD</span>
      </div>
      <Reveal className="manifesto-inner">
        <p className="manifesto-large">Jewellery is never <em>just</em> what you wear.</p>
        <div className="manifesto-copy">
          <span className="manifesto-mark">✳</span>
          <p>It is the promise you carry. The celebration you return to. The quiet piece that feels like it was always yours.</p>
          <Link href="/about" className="text-link">The Satyam story <ArrowUpRight size={15} /></Link>
        </div>
      </Reveal>
      <div className="manifesto-divider"><span>01 — A JEWELLERY HOUSE IN JABALPUR</span><span>CRAFTED FOR MOMENTS. DESIGNED TO LAST.</span></div>
    </section>
  );
}

function CollectionsSection() {
  return (
    <section className="collections-section section-pad" id="collections">
      <div className="section-header section-header-wide">
        <div><SectionEyebrow number="02">A WORLD OF POSSIBILITY</SectionEyebrow><h2 className="section-title">Find the feeling.<br /><em>Then find the piece.</em></h2></div>
        <div className="section-header-aside"><p>Different moments call for different things. Begin wherever feels right.</p><Link href="/collections" className="text-link">View all collections <ArrowUpRight size={15} /></Link></div>
      </div>
      <div className="collection-grid">
        {collections.map((item, index) => (
          <Link href={item.href} className={`collection-card ${item.className} collection-card-${index + 1}`} data-cursor="EXPLORE" key={item.number}>
            <Image src={assetPath(item.image)} alt={item.alt} fill sizes="(max-width: 760px) 78vw, (max-width: 1100px) 50vw, 36vw" className="collection-image" />
            <div className="collection-vignette" />
            <div className="collection-topline"><span>{item.number}</span><span>EXPLORE <ArrowUpRight size={13} /></span></div>
            <div className="collection-copy"><span>{item.subtitle}</span><h3>{item.title}</h3><span className="collection-arrow"><ArrowUpRight size={21} /></span></div>
            <span className="collection-border" />
          </Link>
        ))}
      </div>
      <div className="collection-footnote"><span>01—06</span><span>EDITORIAL COLLECTION GUIDE</span><span>DESIGNS AND AVAILABILITY TO BE CONFIRMED IN THE SHOWROOM</span></div>
    </section>
  );
}

function CraftObjectSection() {
  const { openPanel } = useSiteUI();
  const viewerWrap = useRef<HTMLDivElement>(null);
  const [viewerInView, setViewerInView] = useState(false);
  useEffect(() => {
    const node = viewerWrap.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setViewerInView(true);
        observer.disconnect();
      }
    }, { rootMargin: "160px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="object-section section-pad" id="the-object">
      <div className="object-heading">
        <SectionEyebrow number="03">A CLOSER LOOK</SectionEyebrow>
        <div className="object-heading-row"><h2 className="section-title">See the craft<br /><em>from every angle.</em></h2><p>A small digital study in gold, made to invite a closer look. Drag to turn it. Let the details meet the light.</p></div>
      </div>
      <div className="object-layout">
        <div className="object-view-wrap" ref={viewerWrap}>{viewerInView ? <ThreeViewer image={assetPath("/images/collections/bridal.jpg")} alt="A gold necklace design reference with intricate ornamentation" /> : <div className="viewer-placeholder"><Image src={assetPath("/images/collections/bridal.jpg")} alt="" fill sizes="(max-width: 760px) 100vw, 55vw" /><span>Preparing the view…</span></div>}<span className="viewer-annotation viewer-annotation-top">INTERACTIVE 3D STUDY</span><span className="viewer-annotation viewer-annotation-bottom">CONCEPT MODEL · NOT A PRODUCT SPECIFICATION</span></div>
        <div className="object-note">
          <span className="object-index">01 <i /> 03</span>
          <h3>Made to be<br /><em>looked at twice.</em></h3>
          <p>Some details reveal themselves slowly. Move through the form, notice the texture, and imagine how it might feel in person.</p>
          <div className="object-material"><span>01</span><span>FORM</span><i /><span>02</span><span>LIGHT</span><i /><span>03</span><span>DETAIL</span></div>
          <button className="text-link" onClick={() => openPanel("appointment")}>Discover at the showroom <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </section>
  );
}

function SignatureSection() {
  const { toggleWishlist, isWishlisted } = useSiteUI();
  return (
    <section className="signature-section section-pad" id="signature">
      <div className="section-header">
        <div><SectionEyebrow number="04">A FEW PLACES TO BEGIN</SectionEyebrow><h2 className="section-title">Pieces with a<br /><em>point of view.</em></h2></div>
        <div className="section-header-aside"><p>Editorial references for the pieces we love to look at closely. Ask us about current designs in the showroom.</p><Link href="/collections" className="text-link">Discover the collections <ArrowUpRight size={15} /></Link></div>
      </div>
      <div className="signature-grid">
        {products.map((product, index) => (
          <article className={`signature-card signature-card-${index + 1}`} key={product.slug}>
            <Link href={`/products/${product.slug}`} className="signature-image-link" data-cursor="VIEW" aria-label={`View ${product.name}`}>
              <Image src={assetPath(product.images[0].src)} alt={product.images[0].alt} fill sizes="(max-width: 760px) 84vw, 32vw" className="signature-image" />
              <span className="signature-image-overlay" />
              <span className="signature-card-number">0{index + 1}</span>
              <span className="signature-card-view">VIEW PIECE <ArrowUpRight size={14} /></span>
            </Link>
            <button className={`product-heart${isWishlisted(product.slug) ? " is-saved" : ""}`} aria-label={`${isWishlisted(product.slug) ? "Remove" : "Add"} ${product.name} ${isWishlisted(product.slug) ? "from" : "to"} wishlist`} aria-pressed={isWishlisted(product.slug)} onClick={() => toggleWishlist(product.slug)}><Heart size={17} fill={isWishlisted(product.slug) ? "currentColor" : "none"} strokeWidth={1.4} /></button>
            <div className="signature-card-info"><div><span className="signature-type">{product.category} · DESIGN REFERENCE</span><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3></div><ArrowUpRight size={17} strokeWidth={1.2} /></div>
            <p className="signature-card-note">{product.note} <span>·</span> Enquire for details</p>
          </article>
        ))}
      </div>
      <div className="signature-caption"><span>IMAGE REFERENCES FOR PRESENTATION</span><span>PRICING, MATERIAL AND AVAILABILITY ARE CONFIRMED IN PERSON</span></div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="story-section section-pad" id="our-story">
      <div className="story-image-wrap">
        <Image src={assetPath("/images/story/craft-detail.jpg")} alt="Close-up of hands carefully working on a jewellery detail" fill sizes="(max-width: 760px) 100vw, 50vw" className="story-image" />
        <span className="story-image-label">ILLUSTRATIVE EDITORIAL IMAGE · A CLOSER LOOK</span>
      </div>
      <div className="story-copy-wrap">
        <SectionEyebrow number="05">MORE THAN JEWELLERY</SectionEyebrow>
        <h2>Every piece carries<br />more than <em>gold.</em></h2>
        <div className="story-copy-lines"><span>A celebration.</span><span>A promise.</span><span>A beginning.</span><span>A memory.</span></div>
        <p>Satyam Jewellers brings together a thoughtful showroom experience and a love of considered design, helping you discover pieces worthy of life’s most meaningful moments.</p>
        <Link href="/about" className="text-link">A note from Satyam <ArrowUpRight size={15} /></Link>
        <span className="story-watermark">S</span>
      </div>
    </section>
  );
}

const craftSteps = [
  { number: "01", title: "Design", line: "A feeling takes shape.", body: "Every meaningful piece begins with an idea: a line, a memory, or a moment waiting to be marked.", image: "/images/collections/daily-elegance.jpg" },
  { number: "02", title: "Craft", line: "A closer kind of care.", body: "Look closely. Tiny decisions in proportion, texture and detail are what give a piece its character.", image: "/images/story/craft-detail.jpg" },
  { number: "03", title: "Detail", line: "Nothing is too small.", body: "From the outline to the finishing touch, detail is where a design begins to feel like your own.", image: "/images/collections/festive.jpg" },
  { number: "04", title: "Finish", line: "Ready for its moment.", body: "A final look, a final question, a moment to see how the piece catches the light in person.", image: "/images/collections/bridal.jpg" },
  { number: "05", title: "Forever", line: "The story is yours now.", body: "The most beautiful part begins after the first look: the moments, people and memories you make it part of.", image: "/images/campaign/campaign-bridal.jpg" },
];

function CraftSection() {
  const [active, setActive] = useState(0);
  const step = craftSteps[active];
  return (
    <section className="craft-section section-pad" id="craftsmanship">
      <div className="craft-section-head"><SectionEyebrow number="06">A QUIETER KIND OF BEAUTY</SectionEyebrow><h2 className="section-title">Crafted with<br /><em>intention.</em></h2><p>Step closer. Let the process reveal itself, one thoughtful detail at a time.</p></div>
      <div className="craft-experience">
        <div className="craft-image-panel" key={step.image}><Image src={assetPath(step.image)} alt={`Editorial view for the ${step.title.toLowerCase()} stage`} fill sizes="(max-width: 760px) 100vw, 54vw" className="craft-image" /><div className="craft-image-vignette" /><span className="craft-image-label">EDITORIAL IMAGE · DETAIL IN FOCUS <span>— 0{active + 1}</span></span><span className="craft-image-name">{step.title}</span></div>
        <div className="craft-story-panel">
          <div className="craft-progress-top"><span>THE PROCESS</span><span>0{active + 1} <i /> 05</span></div>
          <div className="craft-progress-track"><span style={{ width: `${((active + 1) / craftSteps.length) * 100}%` }} /></div>
          <div className="craft-copy" key={active}><span className="craft-number">{step.number}</span><h3>{step.line}</h3><p>{step.body}</p><Link href="/craftsmanship" className="text-link">Explore our approach <ArrowUpRight size={15} /></Link></div>
          <div className="craft-step-list" aria-label="Craft process steps">
            {craftSteps.map((item, index) => <button className={index === active ? "active" : ""} onClick={() => setActive(index)} aria-current={index === active ? "step" : undefined} key={item.number}><span>{item.number}</span><span>{item.title}</span></button>)}
          </div>
          <div className="craft-controls"><button aria-label="Previous craft step" onClick={() => setActive((active + craftSteps.length - 1) % craftSteps.length)}><ChevronLeft size={18} /></button><button aria-label="Next craft step" onClick={() => setActive((active + 1) % craftSteps.length)}><ChevronRight size={18} /></button></div>
        </div>
      </div>
    </section>
  );
}

function CampaignSection() {
  return (
    <section className="campaign-section">
      <Image src={assetPath("/images/campaign/campaign-bridal.jpg")} alt="Bridal editorial portrait in warm light" fill sizes="100vw" className="campaign-image" />
      <div className="campaign-overlay" />
      <div className="campaign-meta"><span>THE BRIDAL EDIT</span><span>FOR THE MOMENTS THAT STAY</span></div>
      <div className="campaign-copy"><span className="campaign-kicker">A NEW CHAPTER, IN YOUR OWN WAY</span><h2>Jewellery<br />for <em>your</em><br />moments.</h2><Link href="/bridal" className="button-outline">Explore bridal <ArrowUpRight size={15} /></Link></div>
      <div className="campaign-vertical">SATYAM JEWELLERS · JABALPUR</div>
      <div className="campaign-caption"><span>01 / BRIDAL</span><span>AN EDITORIAL STUDY IN LIGHT, FORM & FEELING</span></div>
    </section>
  );
}

const finderOptions = [
  { label: "What are you shopping for?", choices: ["Bridal", "Festive", "A gift", "Everyday", "A special occasion"] },
  { label: "What feels like you?", choices: ["Classic", "Modern", "Statement", "Minimal"] },
  { label: "How would you like to begin?", choices: ["Under ₹25K", "₹25K–₹50K", "₹50K–₹1L", "₹1L+", "Let’s explore together"] },
];

function OccasionFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [selected, setSelected] = useState("");
  const onChoose = (value: string) => {
    setSelected(value);
    const next = [...answers.slice(0, step), value];
    setAnswers(next);
    window.setTimeout(() => {
      setSelected("");
      if (step < finderOptions.length - 1) setStep(step + 1);
      else setComplete(true);
    }, 200);
  };
  const reset = () => { setStep(0); setAnswers([]); setSelected(""); setComplete(false); };
  const occasion = answers[0]?.toLowerCase() || "";
  const destination = occasion.includes("bridal") ? "/bridal" : occasion.includes("everyday") ? "/gold-jewellery" : occasion.includes("gift") ? "/collections" : occasion.includes("festive") ? "/collections" : "/collections";
  const title = occasion.includes("bridal") ? "Begin with the bridal edit." : occasion.includes("everyday") ? "Find your everyday light." : occasion.includes("gift") ? "Make it a moment to remember." : "Find a piece for your moment.";
  return (
    <section className="finder-section section-pad" id="find-your-piece">
      <div className="finder-intro"><SectionEyebrow number="07">A LITTLE GUIDANCE</SectionEyebrow><h2>Find the piece<br />that feels like <em>you.</em></h2><p>Think of this as the beginning of a conversation. A few gentle prompts, then a place to explore.</p><span className="finder-asterisk">✳</span></div>
      <div className="finder-card">
        {!complete ? <>
          <div className="finder-card-top"><span>YOUR PERSONAL EDIT</span><span>0{step + 1} <i /> 03</span></div>
          <div className="finder-progress"><span style={{ width: `${((step + 1) / 3) * 100}%` }} /></div>
          <div className="finder-question" key={step}><span className="finder-small-index">A QUESTION, OR TWO</span><h3>{finderOptions[step].label}</h3><div className="finder-options">{finderOptions[step].choices.map((option, index) => <button key={option} className={selected === option ? "selected" : ""} onClick={() => onChoose(option)}><span>0{index + 1}</span>{option}<ArrowUpRight size={15} /></button>)}</div></div>
          <div className="finder-bottom"><span>NO WRONG ANSWERS. JUST A PLACE TO BEGIN.</span>{step > 0 && <button onClick={() => { setStep(step - 1); setAnswers((current) => current.slice(0, -1)); }}>Back <ArrowLeft size={13} /></button>}</div>
        </> : <div className="finder-result"><span className="finder-small-index">A THOUGHTFUL PLACE TO START</span><h3>{title}</h3><p>{answers[1] ? `A ${answers[1].toLowerCase()} feeling,` : "A feeling all your own,"} and room to discover something meaningful. Explore the edit, then ask us about current designs in person.</p><Link href={destination} className="button-gold">Explore your edit <ArrowRight size={15} /></Link><button className="finder-reset" onClick={reset}>Start again <ArrowUpRight size={13} /></button><span className="finder-result-index">SJ / 01</span></div>}
      </div>
    </section>
  );
}

function ConciergeSection() {
  const { openPanel } = useSiteUI();
  return (
    <section className="concierge-section section-pad">
      <div className="concierge-mark"><Sparkles size={19} strokeWidth={1.2} /></div>
      <div className="concierge-section-content"><SectionEyebrow number="08">A LITTLE HELP, WHEN YOU NEED IT</SectionEyebrow><h2>Meet the Satyam<br /><em>Concierge.</em></h2><p>Tell us what you’re looking for. Begin with a thought, an occasion, or simply a feeling.</p><button className="button-outline" onClick={() => openPanel("concierge")}>Start a conversation <ArrowUpRight size={15} /></button></div>
      <div className="concierge-suggestions"><span>PERHAPS YOU’RE THINKING…</span><p>“Help me find a bridal necklace.”</p><p>“I need a gift for someone special.”</p><p>“Show me something quietly elegant.”</p><small>PROTOTYPE EXPERIENCE · RESPONSES ARE PRE-WRITTEN</small></div>
    </section>
  );
}

function CareSection() {
  return (
    <section className="care-section section-pad">
      <div className="care-heading"><SectionEyebrow number="09">A MORE PERSONAL WAY</SectionEyebrow><h2>Considered in every<br /><em>conversation.</em></h2><p>Jewellery is a personal choice. The right experience makes room for your questions, your pace and your point of view.</p></div>
      <div className="care-points">
        <div><span>01</span><h3>Take your time.</h3><p>Explore designs at your own pace, with room to ask and consider.</p></div>
        <div><span>02</span><h3>See it in person.</h3><p>Visit the showroom to view pieces closely and confirm their individual details.</p></div>
        <div><span>03</span><h3>Ask us anything.</h3><p>Start a conversation about design, materials, care or what feels right for you.</p></div>
      </div>
      <div className="care-note"><span>DETAILS MATTER.</span><span>Ask our team to explain verified specifications for each piece in person.</span><Link href="/contact" aria-label="Learn about visiting Satyam Jewellers"><ArrowUpRight size={16} /></Link></div>
    </section>
  );
}

function ShowroomSection() {
  const { openPanel } = useSiteUI();
  const query = encodeURIComponent("Adhartal, Jabalpur, Madhya Pradesh, India");
  return (
    <section className="showroom-section section-pad" id="visit">
      <div className="showroom-head"><SectionEyebrow number="10">A PLACE TO COME BACK TO</SectionEyebrow><h2>Visit <em>Satyam.</em></h2><p>Bring the showroom experience online. Then come by, take your time, and see what feels like you.</p></div>
      <div className="showroom-layout">
        <div className="showroom-map" aria-label="Illustrative map showing Adhartal in Jabalpur">
          <div className="map-grid-lines" /><div className="map-road road-one" /><div className="map-road road-two" /><div className="map-road road-three" /><div className="map-park park-one" /><div className="map-park park-two" />
          <div className="map-label map-label-one">ADHARTAL</div><div className="map-label map-label-two">JABALPUR</div><div className="map-pin"><span>S</span><i /></div><div className="map-card"><span>YOUR NEXT VISIT</span><strong>Satyam Jewellers</strong><small>Adhartal, Jabalpur</small></div>
          <span className="map-scale">LOCATION SEARCH · NOT A PINNED ADDRESS</span>
        </div>
        <div className="showroom-details"><span className="showroom-number">SJ / 01</span><div><h3>Satyam Jewellers</h3><p>Adhartal<br />Jabalpur, Madhya Pradesh<br />India</p></div><div className="showroom-actions"><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noreferrer" className="button-outline">Get directions <ArrowUpRight size={15} /></a><button className="text-link" onClick={() => openPanel("appointment")}>Request a visit <ArrowUpRight size={15} /></button></div><span className="showroom-note">Address shown as supplied. Please confirm the exact pin before travelling.</span></div>
      </div>
    </section>
  );
}

const journalArticles = [
  { tag: "THE BRIDAL EDIT", title: "Choosing a bridal necklace that feels like you", image: "/images/collections/bridal.jpg", href: "/journal" },
  { tag: "A LITTLE KNOWLEDGE", title: "The questions to ask when exploring gold", image: "/images/collections/gold.jpg", href: "/journal" },
  { tag: "CARE & KEEPING", title: "A thoughtful guide to caring for jewellery", image: "/images/collections/daily-elegance.jpg", href: "/journal" },
];

function JournalSection() {
  return (
    <section className="journal-section section-pad" id="journal">
      <div className="section-header"><div><SectionEyebrow number="11">NOTES TO TAKE WITH YOU</SectionEyebrow><h2 className="section-title">A little more<br /><em>to know.</em></h2></div><div className="section-header-aside"><p>Considered notes for choosing, wearing and caring for the pieces that matter.</p><Link href="/journal" className="text-link">Visit the journal <ArrowUpRight size={15} /></Link></div></div>
      <div className="journal-grid">{journalArticles.map((article, index) => <Link className="journal-card" href={article.href} key={article.title}><div className="journal-image-wrap"><Image src={assetPath(article.image)} alt="" fill sizes="(max-width: 760px) 80vw, 31vw" className="journal-image"/><span className="journal-index">0{index + 1}</span><span className="journal-arrow"><ArrowUpRight size={17}/></span></div><span className="journal-tag">{article.tag}</span><h3>{article.title}</h3><span className="journal-read">READ THE NOTE <ArrowRight size={13}/></span></Link>)}</div>
    </section>
  );
}

export default function HomePage() {
  const { openPanel } = useSiteUI();
  return (
    <div className="home-page">
      <Hero />
      <Manifesto />
      <CollectionsSection />
      <CraftObjectSection />
      <SignatureSection />
      <StorySection />
      <CraftSection />
      <CampaignSection />
      <OccasionFinder />
      <ConciergeSection />
      <CareSection />
      <ShowroomSection />
      <JournalSection />
      <section className="final-cta section-pad">
        <div className="final-cta-overline"><span className="eyebrow-rule"/>WHEN YOU’RE READY</div>
        <h2>Some moments<br /><em>deserve to last.</em></h2>
        <p>Discover. Enquire. Visit. We’ll be here when you’re ready.</p>
        <button className="button-gold" onClick={() => openPanel("appointment")}>Make time to visit <ArrowUpRight size={15}/></button>
      </section>
    </div>
  );
}
