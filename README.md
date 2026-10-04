# Satyam Jewellers — digital showroom proposal

A premium, responsive showroom experience for Satyam Jewellers, Adhartal, Jabalpur. Built with Next.js App Router, React, TypeScript, CSS design tokens, Lucide icons and a code-split Three.js study.

## Run locally

```bash
npm install
npm run dev
```

The site runs on `http://localhost:3000`. Production build and type check:

```bash
npm run build
npm run lint
```

## Public demo deployment

GitHub Pages deployment is configured by `.github/workflows/deploy-pages.yml` and publishes the session branch to `https://ayushsahu20071021-droid.github.io/satyam-jewellers/`. The workflow uses a static Next export with a repository base path; verify the first GitHub Actions run completes before sharing the URL.

## Before a public launch

This is a client demonstration. It deliberately avoids unverified business claims and uses generated editorial imagery/design references in place of actual showroom assets or inventory. Please replace/confirm the following with Satyam Jewellers before launch:

- Approved product photographs, names, material/purity, weights, gemstone details, prices and availability.
- The exact street address/map pin, verified phone and WhatsApp contact, opening hours and service policies.
- Approved certifications, reviews, brand history, after-sales details and social accounts, if applicable.
- A verified production domain and any privacy/consent copy required for real appointment enquiries.

Product detail pages and collection imagery are explicitly labelled as editorial references. No customer details from the demo appointment form are transmitted or stored. The Concierge uses pre-written mock responses and is not a live AI service. No reviews or certifications are fabricated.

## Environment configuration

Copy `.env.example` to `.env.local` and set only verified details:

- `NEXT_PUBLIC_SITE_URL` — verified canonical website origin. Enables canonical URLs, absolute Open Graph imagery and the sitemap entries.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — verified WhatsApp number as digits including country code.
- `NEXT_PUBLIC_PHONE` — verified showroom phone, including country code.

Without a configured site URL, canonical links are omitted and `sitemap.xml` returns no entries rather than inventing a domain. The Adhartal directions action searches for the locality and Jabalpur; confirm the exact map pin before travelling.

## Structure

- `/` — cinematic digital showroom, collections, 3D concept view, editorial product references, craftsmanship, occasion finder, Concierge demo and showroom location.
- `/collections`, `/bridal`, `/gold-jewellery`, `/diamond-jewellery` — collection/editorial routes.
- `/products/[slug]` — future-ready product detail experience with clearly unverified product attributes.
- `/about`, `/craftsmanship`, `/contact`, `/journal`, `/journal/[slug]` — brand, visit and editorial routes.

Wishlist entries and recent searches are stored locally in the visitor's browser only. The typed `Product` contract includes an id, slug, category/subcategory, INR price, metal, purity, gram weight, gemstones, image gallery, optional video, description, availability, featured flag and occasions. Unknown concept data remains `null` rather than implying a real specification.
