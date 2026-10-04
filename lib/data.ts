export type ProductImage = { src: string; alt: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  /** INR amount; null until an approved price is connected. */
  price: number | null;
  metal: string | null;
  purity: string | null;
  /** Weight in grams; null until verified for the specific piece. */
  weight: number | null;
  gemstones: string[] | null;
  images: ProductImage[];
  video: string | null;
  description: string;
  availability: "reference" | "available" | "enquire" | "made-to-order" | "unavailable";
  featured: boolean;
  occasion: string[];
  note: string;
};

// Editorial concept entries for this client demonstration. Replace with the
// showroom's approved catalogue and verified specifications before launch.
export const products: Product[] = [
  {
    id: "concept-01",
    slug: "heritage-necklace",
    name: "The Heirloom Necklace",
    category: "Bridal",
    subcategory: "Necklace reference",
    price: null,
    metal: null,
    purity: null,
    weight: null,
    gemstones: null,
    images: [{ src: "/images/collections/bridal.jpg", alt: "Ornate gold necklace presented on a dark velvet form" }],
    video: null,
    description:
      "An editorial design reference inspired by the enduring beauty of Indian bridal adornment. Visit the showroom to discover available designs and confirm every detail.",
    availability: "reference",
    featured: true,
    occasion: ["Bridal", "Celebration"],
    note: "A study in intricate detail",
  },
  {
    id: "concept-02",
    slug: "light-in-gold",
    name: "Light, Held in Gold",
    category: "Gold",
    subcategory: "Bangle reference",
    price: null,
    metal: null,
    purity: null,
    weight: null,
    gemstones: null,
    images: [{ src: "/images/collections/gold.jpg", alt: "Gold bangles arranged on a dark stone plinth" }],
    video: null,
    description:
      "A considered study of line and surface, created to inspire a conversation about gold jewellery. Specifications, pricing and availability are confirmed in person.",
    availability: "reference",
    featured: true,
    occasion: ["Everyday", "Festive"],
    note: "Form, texture, and quiet radiance",
  },
  {
    id: "concept-03",
    slug: "modern-heirloom",
    name: "A Modern Heirloom",
    category: "Diamonds",
    subcategory: "Pendant reference",
    price: null,
    metal: null,
    purity: null,
    weight: null,
    gemstones: null,
    images: [{ src: "/images/collections/diamonds.jpg", alt: "Diamond pendant necklace in warm gold against obsidian" }],
    video: null,
    description:
      "A contemporary jewellery reference where light takes the lead. Visit Satyam Jewellers in Adhartal to explore real pieces and their verified specifications.",
    availability: "reference",
    featured: true,
    occasion: ["Celebration", "Special occasion"],
    note: "A little brilliance, beautifully considered",
  },
];

export const collections = [
  {
    number: "01",
    title: "Bridal",
    subtitle: "For the beginning of forever",
    image: "/images/collections/bridal.jpg",
    alt: "Intricate gold bridal necklace on a black velvet form",
    href: "/bridal",
    className: "collection-tall",
  },
  {
    number: "02",
    title: "Gold",
    subtitle: "A lasting kind of light",
    image: "/images/collections/gold.jpg",
    alt: "Handcrafted gold bangles arranged on dark stone",
    href: "/gold-jewellery",
    className: "collection-wide",
  },
  {
    number: "03",
    title: "Diamonds",
    subtitle: "A study in brilliance",
    image: "/images/collections/diamonds.jpg",
    alt: "Diamond necklace against black stone",
    href: "/diamond-jewellery",
    className: "collection-standard",
  },
  {
    number: "04",
    title: "Daily elegance",
    subtitle: "Made for the in-between moments",
    image: "/images/collections/daily-elegance.jpg",
    alt: "Minimal gold jewellery on dark stone",
    href: "/collections",
    className: "collection-standard",
  },
  {
    number: "05",
    title: "Festive",
    subtitle: "A reason to gather",
    image: "/images/collections/festive.jpg",
    alt: "Traditional gold earrings in warm light",
    href: "/collections",
    className: "collection-standard",
  },
  {
    number: "06",
    title: "Statement",
    subtitle: "The piece that says enough",
    image: "/images/hero/hero-main.jpg",
    alt: "Model wearing a richly detailed gold necklace",
    href: "/collections",
    className: "collection-wide",
  },
];

export const journalArticles = [
  {
    slug: "choosing-a-bridal-necklace",
    tag: "THE BRIDAL EDIT",
    title: "Choosing a bridal necklace that feels like you",
    image: "/images/collections/bridal.jpg",
    intro: "A wedding look should feel like an expression of the person wearing it. Start with how you want to feel, then make room for the piece to become part of your story.",
    paragraphs: [
      "A bridal piece becomes part of a day you will remember in your own way. Before you begin comparing designs, take a moment to picture how you want to feel: quietly yourself, unmistakably celebratory, or somewhere in between.",
      "Think about the clothes and colours you expect to wear, the scale of jewellery that feels comfortable to you, and whether you would like one expressive piece or a more considered combination. Trying a design alongside your outfit can help the whole picture come into focus.",
      "When you visit, ask to see pieces from different angles and to understand their individual materials, measurements and care. The details can vary from one design to another, so the showroom team is best placed to confirm them.",
    ],
  },
  {
    slug: "questions-about-gold",
    tag: "A LITTLE KNOWLEDGE",
    title: "The questions to ask when exploring gold",
    image: "/images/collections/gold.jpg",
    intro: "A jewellery conversation can begin with a simple question. Here are a few ways to make space for clarity when you explore a gold piece.",
    paragraphs: [
      "A thoughtful jewellery purchase starts with understanding the piece in front of you. Ask the team to explain its stated purity and the documentation or marking that applies to that specific design.",
      "You may also want to ask about the design’s weight, the way its price is calculated, and what is included in the quoted amount. The answers can differ by piece, so request a clear breakdown before making a decision.",
      "If you are comparing designs, take notes and give yourself time. Ask about care, exchange or after-sales policies only after they have been confirmed for the specific purchase. A good conversation should leave you feeling informed, not rushed.",
    ],
  },
  {
    slug: "caring-for-jewellery",
    tag: "CARE & KEEPING",
    title: "A thoughtful guide to caring for jewellery",
    image: "/images/collections/daily-elegance.jpg",
    intro: "The pieces we love deserve a little attention. A few thoughtful habits can help you keep jewellery ready for its next moment.",
    paragraphs: [
      "Care depends on the materials and construction of a piece. Start with the guidance supplied for your jewellery, and ask the showroom team if you are unsure about a particular finish, setting or stone.",
      "As a general habit, handle pieces gently, keep them in a clean and dry place, and avoid letting them rub against one another. Take jewellery off before activities that could knock, bend or snag it.",
      "For cleaning or repair, seek advice that is specific to the piece. A method that is suitable for one design may not be right for another, especially when different materials or settings are involved.",
    ],
  },
  {
    slug: "finding-your-diamond-style",
    tag: "THE DIAMOND EDIT",
    title: "Finding a diamond style that feels personal",
    image: "/images/collections/diamonds.jpg",
    intro: "A diamond piece can feel quietly classic or unmistakably expressive. Start with the shapes and forms you are naturally drawn to.",
    paragraphs: [
      "Before comparing individual pieces, think about how you like jewellery to sit in your everyday life. Do you prefer a clean silhouette, a detail that catches the eye, or something with a little more presence? There is no single right answer.",
      "When you explore a design, ask the showroom team to explain its individual materials, stone details and any documentation available for that specific piece. The answer belongs to the piece, not to a general guide.",
      "Give yourself time to view a design from more than one angle and to compare it with other styles. The piece that feels right is the one you will be happy to make your own.",
    ],
  },
  {
    slug: "jewellery-for-festive-moments",
    tag: "FESTIVE & OCCASION",
    title: "A little thought for a festive moment",
    image: "/images/collections/festive.jpg",
    intro: "Festive dressing is an invitation to bring a little more feeling to the way you gather. Let the occasion guide you, then make the choice your own.",
    paragraphs: [
      "Begin with the moment you are dressing for and the feeling you want to carry into it. A single piece can become the focus, while a more layered look can feel expressive in its own way.",
      "Consider what you already plan to wear, how you want the jewellery to move with you, and what feels comfortable throughout the occasion. Trying a design alongside your outfit can help you picture the whole look.",
      "If you are choosing a gift, ask about the individual piece and the details that matter to you. The showroom team can confirm current designs and their specifications in person.",
    ],
  },
  {
    slug: "when-minimal-feels-like-enough",
    tag: "PERSONAL STYLE",
    title: "When minimal feels like enough",
    image: "/images/collections/daily-elegance.jpg",
    intro: "Sometimes a single considered detail says everything. A note on finding jewellery that feels at home in your own style.",
    paragraphs: [
      "Personal style does not need to announce itself. Think about the small pieces you already reach for, the shapes that feel familiar and the way you want jewellery to sit against your day.",
      "A simple design can be meaningful because of how it makes you feel, who gave it to you or the moment you chose it. Let your own reasons lead the conversation.",
      "When you visit the showroom, ask to compare available designs and to confirm their individual details. A slow look can make a quiet choice feel clear.",
    ],
  },
];

export const pageCopy: Record<
  string,
  { title: string; overline: string; description: string; image: string; label?: string }
> = {
  collections: {
    title: "A world of\nmeaningful detail.",
    overline: "THE COLLECTIONS",
    description:
      "Discover jewellery for the days you plan for, and the moments that simply find you. Explore by occasion, by feeling, or by the pieces you return to time and again.",
    image: "/images/collections/bridal.jpg",
  },
  bridal: {
    title: "For the beginning\nof forever.",
    overline: "THE BRIDAL EDIT",
    description:
      "Every celebration has its own rhythm. Find the pieces that feel unmistakably yours, with thoughtful guidance at every step.",
    image: "/images/campaign/campaign-bridal.jpg",
  },
  "gold-jewellery": {
    title: "A lasting kind\nof light.",
    overline: "GOLD, RECONSIDERED",
    description:
      "From quiet everyday forms to pieces made for a gathering, explore gold jewellery at your own pace. Visit our Adhartal showroom to ask about designs, purity and availability.",
    image: "/images/collections/gold.jpg",
  },
  "diamond-jewellery": {
    title: "A little brilliance.\nA lot of feeling.",
    overline: "THE DIAMOND EDIT",
    description:
      "Discover diamond jewellery in a more personal way. Our team can help you explore pieces and explain their individual details in the showroom.",
    image: "/images/collections/diamonds.jpg",
  },
  about: {
    title: "Jewellery that\nbecomes your story.",
    overline: "A NOTE FROM SATYAM",
    description:
      "Satyam Jewellers is a jewellery destination in Adhartal, Jabalpur. Here, discovering a piece is an invitation to slow down, look closely and find what feels like you.",
    image: "/images/story/craft-detail.jpg",
  },
  craftsmanship: {
    title: "The beauty is\nin the details.",
    overline: "CRAFT & CONSIDERATION",
    description:
      "A closer look changes everything. Discover the lines, textures and finishing details that make each piece worth seeing in person.",
    image: "/images/story/craft-detail.jpg",
  },
  contact: {
    title: "A more personal\nway to discover.",
    overline: "VISIT SATYAM",
    description:
      "Make time to find the piece that feels right. Visit Satyam Jewellers in Adhartal, Jabalpur, or request a private consultation.",
    image: "/images/campaign/campaign-bridal.jpg",
  },
  journal: {
    title: "A little more\nto know.",
    overline: "THE JOURNAL",
    description:
      "Notes on choosing, wearing and caring for jewellery—with a little inspiration for the moments that matter.",
    image: "/images/collections/daily-elegance.jpg",
  },
};
