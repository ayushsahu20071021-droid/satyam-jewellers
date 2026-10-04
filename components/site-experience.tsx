"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  Menu,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { collections, products } from "@/lib/data";
import { assetPath } from "@/lib/site";

type Panel = "menu" | "search" | "wishlist" | "appointment" | "concierge" | "contact" | null;
type SiteUI = {
  openPanel: (panel: Exclude<Panel, null>) => void;
  closePanel: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  wishlist: string[];
};

const UIContext = createContext<SiteUI | null>(null);

export function useSiteUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useSiteUI must be used inside SiteExperience");
  return context;
}

const navLinks = [
  { label: "Collections", href: "/collections" },
  { label: "Heritage", href: "/about" },
  { label: "Bridal", href: "/bridal" },
  { label: "Craftsmanship", href: "/craftsmanship" },
  { label: "Journal", href: "/journal" },
];

export default function SiteExperience({ children }: { children: ReactNode }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("satyam-wishlist");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlist(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {
      setWishlist([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      try { window.localStorage.setItem("satyam-wishlist", JSON.stringify(wishlist)); } catch { /* Wishlist remains available for this session. */ }
    }
  }, [wishlist, ready]);

  useEffect(() => {
    if (!panel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.classList.add("panel-open");
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("panel-open");
    };
  }, [panel]);

  const value = useMemo<SiteUI>(
    () => ({
      openPanel: setPanel,
      closePanel: () => setPanel(null),
      toggleWishlist: (slug) =>
        setWishlist((current) =>
          current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
        ),
      isWishlisted: (slug) => wishlist.includes(slug),
      wishlist,
    }),
    [wishlist],
  );

  return (
    <UIContext.Provider value={value}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <ScrollProgress />
      <CustomCursor />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingContact />
      <MobileBottomBar />
      <GlobalPanels panel={panel} onClose={() => setPanel(null)} />
    </UIContext.Provider>
  );
}

function BrandMark({ light = true }: { light?: boolean }) {
  return (
    <Link className={`brand-mark${light ? "" : " brand-mark-dark"}`} href="/" aria-label="Satyam Jewellers home">
      <span className="brand-word">SATYAM</span>
      <span className="brand-sub">JEWELLERS</span>
    </Link>
  );
}

function Header() {
  const { openPanel, wishlist } = useSiteUI();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${pathname !== "/" ? " inner-header" : ""}`}>
      <div className="header-inner">
        <button className="icon-button mobile-menu-trigger" aria-label="Open navigation" onClick={() => openPanel("menu")}>
          <Menu size={19} strokeWidth={1.4} />
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.label}>{link.label}</Link>
          ))}
        </nav>
        <BrandMark />
        <div className="header-actions">
          <button className="icon-button header-search" aria-label="Open search" onClick={() => openPanel("search")}>
            <Search size={18} strokeWidth={1.35} />
            <span className="header-action-label">Search</span>
          </button>
          <button className="icon-button wishlist-trigger" aria-label={`Open wishlist${wishlist.length ? `, ${wishlist.length} saved` : ""}`} onClick={() => openPanel("wishlist")}>
            <Heart size={18} strokeWidth={1.35} />
            <span className="header-action-label">Saved</span>
            {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
          </button>
          <button className="header-enquire" onClick={() => openPanel("appointment")}>
            <span>Enquire</span><ArrowUpRight size={15} strokeWidth={1.4} />
          </button>
          <button className="icon-button desktop-menu-trigger" aria-label="Open menu" onClick={() => openPanel("menu")}>
            <Menu size={18} strokeWidth={1.4} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ScrollProgress() {
  const progress = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        const amount = maximum > 0 ? (window.scrollY / maximum) * 100 : 0;
        if (progress.current) progress.current.style.width = `${amount}%`;
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); cancelAnimationFrame(frame); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>;
}

function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const node = cursor.current;
    if (!node) return;
    document.documentElement.classList.add("custom-cursor-enabled");
    const label = node.querySelector("span");
    const move = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      node.dataset.visible = "true";
    };
    const over = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a, button, [data-cursor]") : null;
      if (!target) { node.dataset.active = "false"; return; }
      const customLabel = target.getAttribute("data-cursor") || (target.tagName === "BUTTON" ? "OPEN" : "VIEW");
      node.dataset.active = "true";
      if (label) label.textContent = customLabel;
    };
    const leave = () => { node.dataset.visible = "false"; node.dataset.active = "false"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("custom-cursor-enabled");
    };
  }, []);
  return <div className="custom-cursor" ref={cursor} aria-hidden="true"><i /><span /></div>;
}

function Footer() {
  const { openPanel } = useSiteUI();
  return (
    <footer className="site-footer">
      <div className="footer-topline"><span className="tiny-mark" /> A JEWELLERY HOUSE IN ADHARTAL, JABALPUR</div>
      <div className="footer-main">
        <div className="footer-statement">
          <BrandMark />
          <h2>Some moments<br /><em>deserve to last.</em></h2>
          <button className="text-link light-link" onClick={() => openPanel("appointment")}>
            Begin a conversation <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="footer-links-group">
          <div className="footer-link-column">
            <p className="footer-label">DISCOVER</p>
            <Link href="/collections">Collections</Link>
            <Link href="/bridal">Bridal</Link>
            <Link href="/gold-jewellery">Gold</Link>
            <Link href="/diamond-jewellery">Diamonds</Link>
          </div>
          <div className="footer-link-column">
            <p className="footer-label">THE HOUSE</p>
            <Link href="/about">Our story</Link>
            <Link href="/craftsmanship">Craftsmanship</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/contact">Visit & contact</Link>
          </div>
          <div className="footer-link-column">
            <p className="footer-label">A PERSONAL VISIT</p>
            <span>Adhartal, Jabalpur</span>
            <span>Madhya Pradesh, India</span>
            <button className="footer-contact-button" onClick={() => openPanel("appointment")}>Request a consultation <ArrowUpRight size={13} /></button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Satyam Jewellers</span>
        <span className="footer-note">Discover. Enquire. Visit.</span>
        <Link href="/contact">Adhartal · Jabalpur <ArrowUpRight size={12} /></Link>
      </div>
    </footer>
  );
}

function FloatingContact() {
  const { openPanel } = useSiteUI();
  const [expanded, setExpanded] = useState(false);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const phone = process.env.NEXT_PUBLIC_PHONE;

  return (
    <div className={`floating-contact${expanded ? " floating-contact-open" : ""}`}>
      {expanded && (
        <div className="floating-contact-options">
          {number ? (
            <a href={`https://wa.me/${number}?text=${encodeURIComponent("Hello, I would like to enquire about jewellery at Satyam Jewellers.")}`} target="_blank" rel="noreferrer">
              WhatsApp <ArrowUpRight size={14} />
            </a>
          ) : (
            <button onClick={() => { setExpanded(false); openPanel("contact"); }}>WhatsApp <ArrowUpRight size={14} /></button>
          )}
          {phone ? <a href={`tel:${phone}`}>Call the showroom <ArrowUpRight size={14} /></a> : <button onClick={() => { setExpanded(false); openPanel("contact"); }}>Call the showroom <ArrowUpRight size={14} /></button>}
          <button onClick={() => { setExpanded(false); openPanel("appointment"); }}>Book a visit <ArrowUpRight size={14} /></button>
        </div>
      )}
      <button className="floating-contact-button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        <span className="floating-contact-icon"><MessageCircle size={16} strokeWidth={1.5} /></span>
        <span>Enquire with a jewellery expert</span>
        <ArrowUpRight size={15} />
      </button>
    </div>
  );
}

function MobileBottomBar() {
  const { openPanel } = useSiteUI();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return (
    <div className="mobile-bottom-bar" aria-label="Quick contact options">
      <button onClick={() => openPanel("appointment")}><span>ENQUIRE</span><ArrowUpRight size={14} /></button>
      {number ? <a href={`https://wa.me/${number}`} target="_blank" rel="noreferrer"><span>WHATSAPP</span><MessageCircle size={14} /></a> : <button onClick={() => openPanel("contact")}><span>WHATSAPP</span><MessageCircle size={14} /></button>}
      <Link href="/contact"><span>VISIT</span><ArrowRight size={14} /></Link>
    </div>
  );
}

function GlobalPanels({ panel, onClose }: { panel: Panel; onClose: () => void }) {
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!panel) return;
    const shell = shellRef.current;
    if (!shell) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => Array.from(shell.querySelectorAll<HTMLElement>(selector)).filter((item) => item.offsetParent !== null);
    (shell.querySelector<HTMLElement>("[autofocus]") || getFocusable()[0])?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.removeEventListener("keydown", trapFocus);
      previous?.focus();
    };
  }, [panel]);
  if (!panel) return null;
  return (
    <div className={`panel-backdrop panel-${panel}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={shellRef} className="panel-shell" role="dialog" aria-modal="true" aria-label={panel === "menu" ? "Site navigation" : panel === "appointment" ? "Request a showroom visit" : `${panel} panel`}>
        <div className="panel-topline">
          <BrandMark />
          <button className="panel-close" aria-label="Close panel" onClick={onClose}><X size={20} strokeWidth={1.4} /></button>
        </div>
        {panel === "menu" && <MenuPanel onClose={onClose} />}
        {panel === "search" && <SearchPanel onClose={onClose} />}
        {panel === "wishlist" && <WishlistPanel onClose={onClose} />}
        {panel === "appointment" && <AppointmentPanel onClose={onClose} />}
        {panel === "concierge" && <ConciergePanel />}
        {panel === "contact" && <ContactPanel />}
      </div>
    </div>
  );
}

function MenuPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="menu-panel-content">
      <div className="menu-eyebrow">A MORE PERSONAL WAY TO DISCOVER</div>
      <div className="menu-main-links">
        {navLinks.map((link, index) => (
          <Link href={link.href} key={link.href} onClick={onClose}>
            <span className="menu-index">0{index + 1}</span><span>{link.label}</span><ArrowUpRight size={22} strokeWidth={1.1} />
          </Link>
        ))}
        <Link href="/contact" onClick={onClose}><span className="menu-index">06</span><span>Visit us</span><ArrowUpRight size={22} strokeWidth={1.1} /></Link>
      </div>
      <div className="menu-bottom">
        <span>Adhartal, Jabalpur · Madhya Pradesh</span>
        <span>Discover. Enquire. Visit.</span>
      </div>
    </div>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const cleanQuery = query.trim().toLowerCase();

  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem("satyam-searches") || "[]");
      if (Array.isArray(parsed)) setRecent(parsed.filter((item): item is string => typeof item === "string"));
    } catch { setRecent([]); }
  }, []);

  const matches = useMemo(() => {
    if (!cleanQuery) return [];
    return products.filter((product) => `${product.name} ${product.category} ${product.subcategory} ${product.description}`.toLowerCase().includes(cleanQuery));
  }, [cleanQuery]);
  const collectionMatches = useMemo(() => {
    if (!cleanQuery) return [];
    return collections.filter((collection) => `${collection.title} ${collection.subtitle}`.toLowerCase().includes(cleanQuery));
  }, [cleanQuery]);

  const saveSearch = (value: string) => {
    const next = [value, ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 4);
    setRecent(next);
    try { localStorage.setItem("satyam-searches", JSON.stringify(next)); } catch { /* Recent searches remain available for this session. */ }
  };

  const quickLinks = [
    { label: "Bridal jewellery", href: "/bridal" },
    { label: "Gold jewellery", href: "/gold-jewellery" },
    { label: "Diamond jewellery", href: "/diamond-jewellery" },
  ];

  return (
    <div className="search-panel-content">
      <p className="panel-kicker">FIND SOMETHING MEANINGFUL</p>
      <label className="search-field">
        <Search size={23} strokeWidth={1.3} />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" aria-label="Search jewellery and collections" />
        {query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={17} /></button>}
      </label>
      {cleanQuery ? (
        <div className="search-results" aria-live="polite">
          {matches.length > 0 && <>
            <p className="search-section-label">DESIGN REFERENCES ({matches.length})</p>
            {matches.map((product) => (
              <Link href={`/products/${product.slug}`} className="search-result" key={product.slug} onClick={() => { saveSearch(query); onClose(); }}>
                <img src={assetPath(product.images[0].src)} alt="" /><span><strong>{product.name}</strong><small>{product.category} · design reference</small></span><ArrowUpRight size={16} />
              </Link>
            ))}
          </>}
          {collectionMatches.length > 0 && <div className="search-collection-results"><p className="search-section-label">COLLECTIONS ({collectionMatches.length})</p>{collectionMatches.map((collection) => <Link href={collection.href} className="search-collection-result" key={collection.number} onClick={() => { saveSearch(query); onClose(); }}><span>{collection.number}</span><span><strong>{collection.title}</strong><small>{collection.subtitle}</small></span><ArrowUpRight size={15}/></Link>)}</div>}
          {matches.length === 0 && collectionMatches.length === 0 && <div className="search-empty"><p>We couldn’t find that piece.</p><span>Try bridal, gold or diamonds—or explore a collection.</span></div>}
          <div className="search-quick-links">{quickLinks.map((item) => <Link href={item.href} onClick={onClose} key={item.href}>{item.label}<ArrowRight size={13} /></Link>)}</div>
        </div>
      ) : (
        <div className="search-start">
          <div>
            <p className="search-section-label">POPULAR SEARCHES</p>
            <div className="search-chips">{["Bridal", "Gold", "Everyday", "A meaningful gift"].map((item) => <button key={item} onClick={() => setQuery(item)}>{item}<ArrowUpRight size={12} /></button>)}</div>
          </div>
          {recent.length > 0 && <div className="recent-searches"><p className="search-section-label">RECENT</p>{recent.map((item) => <button key={item} onClick={() => setQuery(item)}><ArrowLeft size={13} />{item}</button>)}</div>}
          <div className="search-quick-links">{quickLinks.map((item) => <Link href={item.href} onClick={onClose} key={item.href}>{item.label}<ArrowRight size={13} /></Link>)}</div>
        </div>
      )}
      <p className="panel-footnote">Search includes editorial design references. Confirm current designs and availability in the showroom.</p>
    </div>
  );
}

function WishlistPanel({ onClose }: { onClose: () => void }) {
  const { wishlist, toggleWishlist } = useSiteUI();
  const saved = products.filter((product) => wishlist.includes(product.slug));
  return (
    <div className="wishlist-panel-content">
      <p className="panel-kicker">YOUR PRIVATE EDIT</p>
      <h2>Pieces to<br /><em>come back to.</em></h2>
      {saved.length ? <div className="wishlist-list">{saved.map((product) => (
        <div className="wishlist-item" key={product.slug}>
          <Link href={`/products/${product.slug}`} onClick={onClose}><img src={assetPath(product.images[0].src)} alt="" /><span><strong>{product.name}</strong><small>{product.category} · design reference</small></span></Link>
          <button aria-label={`Remove ${product.name} from wishlist`} onClick={() => toggleWishlist(product.slug)}><X size={16} /></button>
        </div>
      ))}</div> : <div className="wishlist-empty"><Heart size={22} strokeWidth={1.2} /><p>Keep the pieces that speak to you.</p><span>Tap the heart on a design reference to save it here.</span><Link href="/collections" onClick={onClose} className="button-outline">Explore collections <ArrowRight size={14} /></Link></div>}
      <p className="panel-footnote">Saved on this device only. These are editorial references, not live inventory.</p>
    </div>
  );
}

function AppointmentPanel({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState("Bridal");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="appointment-panel-content">
      {submitted ? (
        <div className="appointment-success">
          <span className="success-symbol"><Check size={22} strokeWidth={1.3} /></span>
          <p className="panel-kicker">A NOTE FOR SATYAM</p>
          <h2>Your visit<br /><em>is requested.</em></h2>
          <p className="success-copy">Thank you for making time to visit. This demonstration form does not send your details yet—please contact the showroom directly until a booking channel is connected.</p>
          <button className="text-link" onClick={onClose}>Return to the collection <ArrowRight size={15} /></button>
        </div>
      ) : (
        <>
          <p className="panel-kicker">A MOMENT, JUST FOR YOU</p>
          <h2>Make time<br /><em>to discover.</em></h2>
          <p className="panel-intro">Tell us a little about your visit. We’ll shape this moment around what matters to you.</p>
          <form className="appointment-form" onSubmit={submit}>
            <div className="form-row">
              <label>Your name<input name="name" autoComplete="name" placeholder="How should we address you?" required /></label>
              <label>Phone number<input name="phone" autoComplete="tel" inputMode="tel" minLength={8} placeholder="For a call back" required /></label>
            </div>
            <div className="form-row">
              <label>Preferred date<input name="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} min={new Date().toISOString().slice(0, 10)} required /></label>
              <label>Preferred time<select name="time" value={time} onChange={(event) => setTime(event.target.value)} required><option value="" disabled>Select a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Flexible</option></select></label>
            </div>
            <label>What would you like to explore?<select value={interest} onChange={(event) => setInterest(event.target.value)}><option>Bridal</option><option>Gold</option><option>Diamonds</option><option>A gift</option><option>Something else</option></select></label>
            <label>Budget range <span className="optional-label">OPTIONAL</span><select name="budget" defaultValue="Prefer to discuss in person"><option>Prefer to discuss in person</option><option>Under ₹25K</option><option>₹25K–₹50K</option><option>₹50K–₹1L</option><option>₹1L+</option></select></label>
            <label>A note for us <span className="optional-label">OPTIONAL</span><textarea name="message" rows={2} placeholder="Anything you would like us to know?" /></label>
            <button className="button-gold" type="submit">Request a private consultation <ArrowRight size={16} /></button>
            <p className="form-privacy-note">Prototype request only. Details are not stored or sent.</p>
          </form>
        </>
      )}
    </div>
  );
}

function ConciergePanel() {
  const { openPanel } = useSiteUI();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ from: "you" | "concierge"; text: string }[]>([]);
  const prompts = ["Help me find a bridal necklace", "I’m looking for a meaningful gift", "Show me elegant everyday jewellery"];

  const replyTo = (text: string) => {
    if (!text.trim() || busy) return;
    const message = text.trim();
    setMessages((current) => [...current, { from: "you", text: message }]);
    setInput("");
    setBusy(true);
    window.setTimeout(() => {
      const lower = message.toLowerCase();
      const reply = lower.includes("bridal")
        ? "For a bridal piece, it can help to begin with the feeling you want to carry—classic, contemporary or statement. The bridal edit is a thoughtful place to start, then the showroom team can show you available designs and details in person."
        : lower.includes("gift")
          ? "A meaningful gift often begins with the person, not the price tag. Think about what they wear every day, or a moment you want to mark. We can help you explore ideas during a showroom visit."
          : lower.includes("under") || lower.includes("50k") || lower.includes("50,000")
            ? "A budget can be a useful place to begin. Current prices depend on the individual design and its confirmed details, so the showroom team can help you explore suitable options and explain them clearly."
            : lower.includes("everyday") || lower.includes("daily")
              ? "For everyday jewellery, consider the pieces you already reach for and how you like them to feel. Explore the Daily Elegance edit, then visit to compare real designs in person."
              : "I’d be happy to help you begin. Tell me a little more about the occasion, the style you have in mind, or what you would like to explore at the showroom.";
      setMessages((current) => [...current, { from: "concierge", text: reply }]);
      setBusy(false);
    }, 750);
  };

  return (
    <div className="concierge-panel-content">
      <p className="panel-kicker">A THOUGHTFUL PLACE TO BEGIN</p>
      <h2>Satyam<br /><em>Concierge.</em></h2>
      <p className="concierge-disclaimer">A guided demo experience. Responses are pre-written suggestions, not a live AI service.</p>
      <div className="concierge-chat" aria-live="polite">
        {messages.length === 0 ? <div className="concierge-greeting"><span className="concierge-orb">S</span><p>Tell us what you’re looking for. We’ll help you find a place to begin.</p></div> : messages.map((message, index) => <div className={`chat-message chat-${message.from}`} key={`${message.from}-${index}`}>{message.text}</div>)}
        {busy && <div className="chat-message chat-concierge typing-dots"><i /><i /><i /></div>}
      </div>
      {messages.length === 0 && <div className="concierge-prompts">{prompts.map((prompt) => <button key={prompt} onClick={() => replyTo(prompt)}>{prompt}<ArrowUpRight size={13} /></button>)}</div>}
      <form className="concierge-input" onSubmit={(event) => { event.preventDefault(); replyTo(input); }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell us what you’re looking for…" aria-label="Message the Satyam Concierge demo" />
        <button aria-label="Send message" disabled={!input.trim() || busy}><ArrowUpRight size={18} /></button>
      </form>
      <button className="concierge-appointment" onClick={() => openPanel("appointment")}>Prefer to visit? Request a consultation <ArrowRight size={14} /></button>
    </div>
  );
}

function ContactPanel() {
  const { openPanel } = useSiteUI();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const phone = process.env.NEXT_PUBLIC_PHONE;
  return (
    <div className="contact-panel-content">
      <p className="panel-kicker">LET’S MAKE IT PERSONAL</p>
      <h2>Here, when<br /><em>you’re ready.</em></h2>
      <p className="panel-intro">Find Satyam Jewellers in Adhartal, Jabalpur. This proposal does not yet include a verified phone or WhatsApp number.</p>
      <div className="contact-panel-actions">
        {number && <a className="contact-method" href={`https://wa.me/${number}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /><span><b>WhatsApp</b><small>Start a conversation</small></span><ArrowUpRight size={15} /></a>}
        {phone && <a className="contact-method" href={`tel:${phone}`}><MessageCircle size={18} /><span><b>Call the showroom</b><small>Speak with the team</small></span><ArrowUpRight size={15} /></a>}
        <div className="contact-method contact-method-muted"><span className="contact-method-pin">SJ</span><span><b>Visit the showroom</b><small>Adhartal, Jabalpur, Madhya Pradesh</small></span><ArrowUpRight size={15} /></div>
      </div>
      <button className="button-gold" onClick={() => openPanel("appointment")}>Request a showroom visit <ArrowRight size={15} /></button>
      <p className="panel-footnote">Phone and messaging links can be enabled once the verified showroom contact details are supplied.</p>
    </div>
  );
}
