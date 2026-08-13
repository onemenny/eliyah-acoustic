# Eliyah Acoustic — Unified Requirements for Coding Agent

## Executive Overview

This document merges and reconciles three previously-separate pieces of source material into a single requirements doc intended for a coding agent and reviewing humans:

1. **`speakers-ecommerce-scope.md`** (repo root, superseded by this doc) — a technical scope for an online catalog/configurator with Stripe/Tranzila checkout.
2. **`design_handoff_eliyah_homepage/`** — a high-fidelity design handoff for a marketing homepage, built directly from the brand doc below. Explicitly **not** e-commerce: the only CTAs are "Request a Consultation" / "Begin a System".
3. **`resources/Eliyah_Acoustic.docx`** — the brand doc (vision, positioning, tone, team, project economics) that (2) was built from.

These are not competing designs, but they describe two different postures for the same business: (1) treats Eliyah Acoustic as a catalog retailer with configurable SKUs and a checkout; (2)/(3) describe a bespoke, commissioned-work studio (₪70,000–₪400,000+ per project) where the product *is* the consultation and build process, not a shelf item.

**Resolution (updated after direct user input during scoping):** the marketing site and a catalog of real products ship together in Phase 1 — a homepage per (2)/(3) plus a showcase of **5 fixed speaker models** (name, description, images, indicative pricing), still with consultation CTAs and **no checkout**. Real payment processing (checkout, cart, server-side price recomputation) stays deferred to a later phase, once there's a real business reason to let a lower-ticket product line transact online instead of routing everyone through a consultation. This doc keeps (1)'s data model and payment architecture (they're sound and reusable) but **renumbers phases** so the marketing site + catalog is Phase 1. It also keeps (1)'s original **GitHub Pages-first deployment plan** (static export, `basePath`/`assetPrefix` toggle) for Phase 1, migrating to Vercel + a custom domain once checkout requires real server-side routes (see §3.4).

This document replaces `speakers-ecommerce-scope.md` and the design handoff's README as the source of truth for scope; those files remain in the repo as historical/reference material (the design handoff's HTML/CSS in particular is the canonical *visual* reference — see §5).


## 1. Brand & Positioning

*(condensed from `resources/Eliyah_Acoustic.docx`; full bilingual text lives there — do not re-translate, copy verbatim when building UI strings)*

**Team:** Maayan Dadush (Marketing & Brand), Ofer Uziel (Sound Design, Tuning & Development), Bar Dadush (Loudspeaker Design, Development & Planning, Assembly & Client Relations).

**Vision:** Reintroduce sound as a physical, spatial experience — designed to move correctly within architectural space. Every system is custom, hand-crafted for its space, and tuned in-house by the team as an integral part of the service.

**Core value:** Sound is not a fixed standard — it's personal, contextual, and shaped by space. Systems are custom-built from the ground up, shaped by materials and proportions, and tuned by listening, never presets. The loudspeaker is not the product; it's part of a larger acoustic composition.

**Experience principle:** A system is successful when it changes behavior — not defined by how it sounds, but by what it creates in the space. Tuned correctly: conversation stops, movement begins.

**Structure of service** (every project, entirely in-house): 1. Spatial Analysis (dimensions, materials, acoustic behavior) → 2. System Architecture (how sound moves through the space) → 3. Fabrication (hand-built in-house) → 4. Integration (positioned as part of the architectural language) → 5. Tuning (final on-site calibration by ear).

**Project scope:** Projects begin around ₪70,000 and can reach ₪400,000+, depending on system scale, architectural complexity, and level of customization.

**Brand direction:** Positioning — custom-built sound systems for high-end architectural spaces, designed/built/tuned entirely in-house. Visual language — natural materials (wood-forward), warm controlled lighting, clean architectural aesthetic, systems designed as part of the space. Tone — direct and precise; describes process clearly; focuses on real outcomes (how the system performs in the room, how the client experiences it).

This positioning is why Phase 1 has no price list, no "buy" button, and no generic product photography — the design handoff's consultation-only CTAs are a direct expression of it, not an arbitrary scope cut.


## 2. Product & Phasing

### 2.1 Phase 1 — Marketing Homepage + Product Catalog (build this first)

Recreate `design_handoff_eliyah_homepage/` pixel-faithfully as a real, deployed site, **plus** a showcase catalog of 5 fixed speaker models. Full design spec is in §5 — this section covers scope only.

**In scope:**
- One continuous-scroll homepage, bilingual (English default, Hebrew via nav toggle), all 17 sections per §5.4, all copy from the design handoff's bilingual dictionary verbatim.
- A catalog of **5 speaker models** — a catalog listing page and one detail page per model (name, description, images, indicative price), using the `Product` shape from §6 (each model is one `Product`; per-model wood-finish/size/etc. variants are optional here — see the note below). Images are supplied by the user per model (pending as of this doc's writing — placeholder imagery until provided). CTA on every product page is still "Request a Consultation" / "Begin a System" — **no price-as-buy-button, no cart, no checkout.**
- A working contact mechanism: both the homepage Consultation section and every product page's CTA must actually submit somewhere. Use Formspree (carried over from the original e-commerce scope doc's contact-form choice) since it needs no backend and fits a static/GitHub-Pages site (§3.1).
- Mobile-responsive, full bilingual EN/HE with correct RTL handling (§5.3), reduced-motion support — for both the homepage and the catalog pages.
- Deployed live on GitHub Pages (§3.1/§3.4).

**Out of scope:** live per-variant configurator pricing math (`calculatePrice()`, §6) — that's a Phase 2 upgrade once the 5 static models are live; checkout; legal pages (Terms/Privacy/Refund — deferred to Phase 2, since they're only load-bearing once payment underwriting starts).

**"Done" when:** all 17 homepage sections render pixel-faithfully in both languages, all 5 product pages are live with real client-supplied imagery, the consultation/CTA forms submit successfully from both the homepage and product pages, and the site is live on GitHub Pages.

### 2.2 Phase 2 — Configurator Upgrade (quote-driven, still not checkout)

Upgrade the Phase 1 catalog's 5 static models with a real per-product configurator (variant selection, live price display via `calculatePrice()`), and migrate deployment off GitHub Pages onto Vercel + a custom domain (§3.4) — the configurator's live pricing math and any future server-side work benefit from Vercel's runtime, which GitHub Pages' static export can't provide. The configurator's terminal action is still a **quote/consultation request**, not a cart or checkout — consistent with the brand's bespoke-commissioned-work positioning (§1).

**In scope:**
- Per-model configurator UI (`/products/[slug]`) per §6's `VariantCategory`/`VariantOption` model — per-category variant selection, live price via `calculatePrice()`, required categories block submission. "Submission" means a quote request (reuses the Phase 1 contact mechanism, pre-filled with the configuration), not payment.
- Legal pages: Terms, Privacy, Refund policy. These land here — ahead of Phase 3 — because both Stripe and Tranzila require a live site with visible ToS/refund policy before underwriting completes, and having them live before applying removes a dependency from the Phase 3 timeline.
- Custom domain + Vercel migration: drop `output: 'export'`/`basePath`, retire the GitHub Pages deployment (§3.4).
- About / team page (can promote the design handoff's "About" section, §5.4 item 15, into its own route once there's more team content than fits inline).

**Out of scope:** any payment integration, cart, order persistence.

**"Done" when:** all 5 models have a working configurator with live pricing, the site is live on a custom domain via Vercel with GitHub Pages retired, quote requests reach the same inbox as Phase 1's consultation form, legal pages are published.

### 2.3 Phase 3 — E-commerce Checkout

Add real payment processing on top of Phase 2's configurator.

**In scope:**
- Stripe + Tranzila integration, routed by the customer's **billing country as entered/confirmed at checkout** — not IP geolocation (IP guesses are wrong often enough — VPNs, ISP routing, travelers — that both providers need accurate billing details regardless, so there's no reason to trust the guess for routing).
- Server-side price recomputation from `lib/pricing.ts`'s `calculatePrice()` — same function as Phase 2's client-side display, **never** two implementations; the server call is the one that's trusted for the actual charge.
- Webhook-confirmed order creation (`Order` type, §6), order confirmation email.
- Checkout review + order confirmation pages.

**Out of scope (until real usage justifies it):** inventory/stock tracking — see §6's note on why `Product` has no stock-count field; these are custom-built-to-order systems, not shelf stock.

**"Done" when:** both Stripe and Tranzila are processing real transactions, price recomputation is server-side and trusted, orders are webhook-confirmed, confirmation emails send, and billing-country routing has been tested both directions.

### 2.4 Phase 4 — Intentionally Undefined

Not scoped. Revisit once Phase 3 is live and real pain points (inventory, admin tooling, CRM integration, etc.) justify specific work.

### 2.5 Explicit Non-Goals

- No checkout, cart, or price-as-a-buy-button anywhere before Phase 3 — a "Buy Now" button in Phase 1 or 2 actively contradicts the brand's consultation-first positioning (§1).
- No generic stock photography — all imagery is the client-supplied photography in `design_handoff_eliyah_homepage/images/` (Phase 1) or genuine project photography (later phases).
- No dark-pattern urgency/scarcity messaging — inconsistent with the brand's "direct and precise" tone (§1).


## 3. Technology Stack & Architecture

### 3.1 Framework & Language
- **Next.js (App Router)**, **TypeScript** throughout. Chosen over Astro (the design handoff's other suggested option) because Phase 3 needs real server-side logic (webhook handlers, server-side price recomputation, payment-provider routing) — Next.js carries the project through all four phases without a framework migration partway through; Astro would need one when checkout lands.
- Deployment: **GitHub Pages for Phase 1** (per explicit user direction), migrating to **Vercel + a custom domain starting Phase 2** once the configurator's live pricing needs a real runtime. Phase 1 uses `output: 'export'` (static export) with `basePath`/`assetPrefix` gated on an env var, exactly as the original e-commerce scope doc specified — this keeps the later Vercel move a config flip rather than a rewrite.
  - **Static-export constraints this imposes on Phase 1:** no Next.js server components that need per-request data, no API routes with dynamic behavior (only pure static GET handlers survive `output: 'export'`), no `next/image` optimization API (use `images: { unoptimized: true }` or serve pre-optimized assets), no middleware-based i18n (use static per-locale routes generated via `generateStaticParams` instead — see §3.3). None of these block Phase 1's scope (§2.1); they become real constraints only if Phase 1 scope creeps toward something that needs a live server, which is a signal to pull the Vercel migration forward rather than fight the export mode.
  - `app/api/` stays an empty placeholder through Phase 1, for the same reason as the original scope doc: real `route.ts` files can only land once `output: 'export'` is dropped in Phase 2.

### 3.2 Styling
Use **CSS Modules** with a shared `tokens.css` (custom properties) for colors/type/spacing from §5.1–5.2, rather than a utility-class framework (Tailwind, etc.). The design handoff's layout is dominated by bespoke `clamp()`-based fluid type/spacing, directional gradients that flip per-language, and exact hex/rgba values — a token file + CSS Modules matches that shape more directly than composing dozens of utility classes per element, and keeps the RTL-flip logic (§5.3) centralized rather than duplicated across className strings.

### 3.3 Internationalization
- Two locales: `en` (default) and `he`, as static per-locale routes (`/` and `/he`) generated via `generateStaticParams` on an `app/[locale]/` segment — **not** middleware-based locale detection, which doesn't run under Phase 1's static export (§3.1). Do not build a custom client-side-only toggle like the design prototype's `localStorage`-based one either, since that defeats SSR and hurts SEO for a marketing/catalog site that needs to be indexed in both languages. Once Phase 2 moves to Vercel, middleware-based locale detection can be layered on top if desired — not required.
- `dir="ltr"|"rtl"` and font-family swap (Fraunces/Manrope for EN, Heebo for HE — see §5.2) driven by the active locale, applied at the root layout.
- All copy lives in per-locale translation files (JSON or similar), ported verbatim from the design handoff's bilingual dictionary — the wording is client-approved brand text, not to be paraphrased.

### 3.4 Repo Structure

```
eliyah-acoustic/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # dir/lang, font loading per locale
│   │   ├── page.tsx               # Home (Phase 1)
│   │   ├── products/              # Phase 1: catalog + 5 static model pages; Phase 2 adds configurator UI
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── about/page.tsx         # Phase 2
│   │   ├── legal/                 # Phase 2
│   │   │   ├── terms/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   └── refunds/page.tsx
│   │   ├── checkout/              # Phase 3
│   │   └── order-confirmation/    # Phase 3
│   └── api/                       # empty until Phase 3 (webhook/checkout routes)
├── components/
│   ├── homepage/                  # Phase 1: Hero, Vision, CoreValue, ExperienceBand, etc. — one per §5.4 section
│   ├── catalog/                     # Phase 1: ProductCard.tsx, ProductGallery.tsx (static, no pricing math)
│   ├── configurator/               # Phase 2: Configurator.tsx, VariantSelector.tsx, PriceDisplay.tsx
│   ├── layout/                     # header/nav, footer, language toggle
│   └── ui/
├── lib/
│   ├── pricing.ts                  # calculatePrice() — client (Ph2) + server (Ph3), one implementation
│   ├── products.ts                 # data access: static file through Ph2-3, DB query if Ph4 needs it
│   ├── currency.ts
│   └── region.ts                   # Phase 3+: billing-country-based routing, not IP geolocation (§2.3)
├── data/
│   └── products.ts                 # Phase 1: 5 static Product entries; source of truth through Phase 2-3
├── types/
│   ├── product.ts                  # Phase 1: needed for the 5-model catalog, not just Phase 2+
│   └── order.ts                    # Phase 3
├── i18n/
│   ├── en.json
│   └── he.json
├── public/images/
└── styles/
    └── tokens.css                  # design tokens from §5.1-5.2

next.config.js                      # Phase 1: output:'export', basePath/assetPrefix gated on an env var (§3.1)
```

Phase 1 needs `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`, `app/[locale]/products/`, `components/homepage/`, `components/catalog/`, `components/layout/`, `data/products.ts`, `types/product.ts`, `i18n/`, `styles/tokens.css`, and `next.config.js`'s export config — everything else in the tree above is scaffolding for Phase 2+, listed here so Phase 1 code lands in the right eventual location rather than needing to be moved later.


## 4. Non-Functional Requirements

- **Bilingual/RTL correctness is a first-class acceptance criterion, not a nice-to-have** — every Phase 1 section must be verified in both languages, not just visually inspected in English. Chrome (icon/label layout) stays LTR; only text runs flip for Hebrew, per §5.3.
- **Mobile-responsive** across all phases — the design handoff's `clamp()`-based fluid type/spacing (§5.2) is the mechanism; preserve it rather than substituting fixed breakpoints.
- **Accessibility:** honor `prefers-reduced-motion: reduce` (skip all scroll/parallax/reveal animation, §5.5) and respect reduced-transparency where feasible (the nav's `backdrop-filter: blur`, hero scrims).
- **No fake urgency or e-commerce affordances before Phase 3** (§2.5).
- **Performance:** the design handoff uses full-bleed, high-resolution photography throughout — serve responsive sources (`next/image`, `srcset`) rather than raw JPEGs at full-bleed sizes.
- **SEO:** both locales must be independently crawlable/indexable (informs the i18n routing choice in §3.3 over a client-only toggle).


## 5. Design System (Phase 1)

*Canonical visual reference: `design_handoff_eliyah_homepage/Eliyah Acoustic Homepage.dc.html` (markup/styles/copy) and `eliyah-design-direction.html` (palette/type rationale). This section is a condensed index — consult those files for exact values. The prototype's own JS runtime (`support.js`, `image-slot.js`) is reference-only; do not port it.*

### 5.1 Colour

| Token | Hex | Use |
|---|---|---|
| Void Oak | `#181310` | Primary background (warm near-black, never pure black) |
| Card / raised | `#201914` | Image-frame background behind photos while loading |
| Travertine | `#E9E2D3` | Primary text on dark; background of the light "About" section |
| Travertine dim | `#D8D0BE` | Image-frame background inside the light section |
| Walnut | `#6B4E36` | Labels/rules inside the light section |
| Aubergine | `#3A2142` | Hover wash + `::selection` only — never a flat background |
| Aged Brass | `#B8935F` | Eyebrow labels, step numbers, CTA underline, one accent line per band |
| Smoke | `#A39880` | Wordmark sub-lockup, muted meta |

Text alphas on dark: headings `#E9E2D3`; body `rgba(233,226,211,0.72)`; step body `rgba(233,226,211,0.68)`; cell text `rgba(233,226,211,0.82–0.86)`. On light: body `rgba(24,19,16,0.78)`; caption `rgba(24,19,16,0.60–0.62)`. Hairlines: `rgba(233,226,211,0.10–0.14)` dark, `rgba(24,19,16,0.16)` light.

### 5.2 Typography & Spacing

- Display (EN): Fraunces, weight 200 (300 for step titles/team names), Google Fonts axes `opsz,wght@9..144,200;300;400`.
- Body & UI (EN): Manrope, 300 body / 500–600 labels.
- Hebrew (both roles): Heebo, 200 display / 300 body — Fraunces/Manrope have no Hebrew coverage, so the family swap on locale change is required, not cosmetic. Hebrew heads run ~15% smaller with looser line-height (1.4–1.45).
- Section eyebrow label: 10px/600/`0.28em`/uppercase/brass (EN); 11px/500/`0.24em`/no-uppercase (HE).
- Body: 15px, line-height 1.95 (EN) / 2.05 (HE), exposed as `--lh`.
- Headings use `clamp()` throughout — see the per-section list in §5.4.
- Section vertical rhythm: `clamp(84–90px, 11–13vw, 150–180px)`; horizontal page padding 40px. Content max-width 1180px (1240px for the image grid), centered.
- Radius: none anywhere except the 2px language button. Shadows: only text-shadows over photography.

### 5.3 RTL / LTR Directionality

- Container chrome (icon + label layout) stays LTR always; only the text run itself flips for Hebrew.
- Directional gradients flip: 100deg↔260deg on the pinned Experience band, 90deg↔270deg on Structure-of-Service row hover.
- Truncation/ellipsis respects direction (lead-truncate from the left for RTL).
- Root page wrapper uses `overflow-x: clip`, **not** `hidden` — `hidden` creates a scrollport that silently breaks `position: sticky` in the pinned band (§5.4 item 5).

### 5.4 Sections (in order — fixed by the brand document, keep it)

1. **Nav** (fixed) — wordmark left, links (Core Value/Process/Approach/Systems/About), brass "Request a Consultation" CTA, language toggle (`עב`/`EN`). Transparent+blurred → solid past 0.8×viewport; hides on scroll-down past one viewport, returns on scroll-up.
2. **Hero** — 100vh full-bleed photo (`room-wall-system.jpg`), ungraded, two scrims, centered wordmark lockup + tagline "Sound, Shaped by Space", scroll cue.
3. **Vision** — label + h1 + one body paragraph (§1 Vision copy).
4. **Core Value** — head, sub, three numbered cells (01–03), closing display line (§1 Core Value copy).
5. **Experience Principle** — pinned/sticky band (`height:170vh` outer / `sticky` inner) over `burl-pair-wide.jpg`, directional scrim, closing lines "Conversation stops" / "Movement begins" (§1 Experience Principle copy).
6. **Structure of Service** — 5 numbered rows (§1 Structure of Service: Spatial Analysis, System Architecture, Fabrication, Integration, Tuning), hover wash.
7. **Project Scope** — head + intro + three rows (§1 Project Scope: ₪70,000–₪400,000+, drivers of final pricing).
8. **Eliyah Acoustic** (about-the-studio narrative) — label/head/two-column body.
9. **Approach** — 50/50 photo (`cherry-single.jpg`) / text split, five "room factor" chips between two paragraphs.
10. **Experience** — two columns: text + a stacked 3-line display list, third line brass.
11. **Sound & Individual Perception** — head + single paragraph.
12. **Material & Form** — label/head/body + 6-up photo grid (`sys-cherry-wave/burl-oval/oak-steel/steel-stack/ivory-column/black-octagon.jpg`), `aspect-ratio: 3/4` cells.
13. **Application** — head + four bordered cells + closing paragraph.
14. **Manifesto** — head ("Sound is not fixed. It is shaped."), two-column body, closing display line.
15. **About** — the page's only light section (`#E9E2D3` bg). Left portrait (`sys-cherry-tall.jpg` — placeholder; **needs a real team photo, see §7 Open Questions**), right label/head/two paragraphs/pull-quote, Team row (Bar Dadush, Ofer Uziel, Maayan Dadush — see §7 for whether this stays visible).
16. **Consultation** — head, body, "Request a Consultation" (primary) + "Begin a System" (secondary) CTAs — both submit via the Phase 1 contact mechanism (§2.1).
17. **Footer** — wordmark, contact, credit.

### 5.5 Interactions & Behavior

Implement with `requestAnimationFrame`-throttled scroll handling + `IntersectionObserver`; **honor `prefers-reduced-motion: reduce` by skipping all of the below.**

- **Reveal on enter:** `opacity`/`transform` over 1.05s, staggered `index × 90ms`; observer `{rootMargin:'0px 0px -10% 0px', threshold:0.04}`, unobserve after reveal.
- **Parallax:** `scale(1.16) translate3d(...)`; speeds — hero 0.10, pinned band 0.14, approach 0.09, grid tiles 0.05, about portrait 0.07. Skip elements >240px outside viewport.
- **Hero:** lockup fades/moves/scales out over the first 0.7×viewport; bottom row fades over 0.35×viewport.
- **Pinned band:** progress `p = clamp(−rect.top / (rect.height − viewportHeight), 0, 1)`; copy holds full opacity to `p=0.74`, fades to 0 by `p=1`.
- **Nav:** hide/show per scroll direction (see §5.4 item 1); solidify past 0.8×viewport.
- **Language toggle:** swap all strings, `dir`, font families, `--lh`, flip directional gradients, persist choice (via the i18n routing in §3.3, not `localStorage` — see that section's reasoning), re-init the reveal observer after the swap since DOM nodes change.
- **Anchors:** smooth scroll to section ids (`#core`, `#process`, `#approach`, `#material`, `#about`, `#consultation`).

### 5.6 Assets

Ten client-supplied photographs in `design_handoff_eliyah_homepage/images/` — copy into `public/images/` and serve via `next/image`/responsive sources (§4 Performance). Shown **as shot**: no duotone, no color grading, only black scrims for text legibility. No icons anywhere by design. The wordmark is set in type (Fraunces "ELIYAH" + Manrope "ACOUSTIC"), not an SVG logo — **a vector lockup from the client is needed for production, see §7.**


## 6. Data Model

`Product`/`VariantCategory`/`VariantOption` (below) are used starting **Phase 1** — the 5 catalog models are real `Product` entries in `data/products.ts`, just without a live configurator UI driving `selectedOptions` yet (that's Phase 2). `ProductConfiguration`/`PriceResult`/`Order` are defined now so Phase 1's `Product` shape doesn't box in the eventual configurator/checkout, even though nothing in Phase 1 constructs them yet.

```typescript
// types/product.ts

type Currency = 'USD' | 'ILS';   // canonical currency undecided — see §7

interface VariantOption {
  id: string;
  category: string;           // 'woodFinish' | 'driver' | 'size' | 'engraving' | ...
  label: string;
  priceDeltaCents: number;    // integer — never float
  sku?: string;
}

interface VariantCategory {
  category: string;
  label: string;
  required: boolean;
  options: VariantOption[];
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  baseCurrency: Currency;
  images: string[];
  variantCategories: VariantCategory[];
}

// types/order.ts

interface ProductConfiguration {
  productId: string;
  selectedOptions: Record<string, string>;   // category -> optionId
  engravingText?: string;                    // cap length in the UI, not the type
}

interface PriceResult {
  currency: Currency;
  amountCents: number;
  vatIncluded: boolean;
  breakdown: { label: string; amountCents: number }[];
}

// Phase 3+
interface Order {
  id: string;
  createdAt: string;
  config: ProductConfiguration;
  customer: { email: string; name: string; billingCountry: string };
  paymentProvider: 'stripe' | 'tranzila';
  paymentReference: string;
  price: PriceResult;          // computed server-side from config — never trusted from client
  status: 'pending' | 'paid' | 'failed' | 'fulfilled';
}
```

`lib/pricing.ts` exports one function — `calculatePrice(product, config): PriceResult` — called client-side in Phase 2 for display, server-side in Phase 3's checkout route for the real charge. Same function, two call sites, never two implementations (§2.3).

No stock-count field, by design: these are custom-built-to-order systems (§1), so each `Order` drives a build rather than decrementing inventory. A ready-stock/display-unit line, if that ever exists, is a cheap `inventory` field to add to `Product` later.


## 7. Open Questions

Flagged rather than silently decided — resolve before the relevant phase starts, not before Phase 1:

0. **5 product models' images and details** — pending from the user as of this doc's writing ("when u ready I will tell you what img to use for each"). Build the catalog against placeholder imagery/copy first so the structure is ready, swap in real assets/content once supplied; this blocks Phase 1's "Done" criteria (§2.1), not the build itself.
1. **Canonical currency** — `Currency` (§6) is typed `'USD' | 'ILS'` but nothing declares which is canonical for `basePriceCents`/display default. The brand doc prices everything in ₪ (ILS); recommend ILS as canonical with USD as a display conversion, but confirm before Phase 1's indicative pricing displays.
2. **About section team photo** (§5.4 item 15) — currently a placeholder (`sys-cherry-tall.jpg`, a product photo, not a portrait). Needs a real team photo before Phase 1 ships, or the "About" section's `showTeam` flag should default off until one exists.
3. **Wordmark vector lockup** (§5.6) — currently set in type; request the real vector logo from the client for production use (favicon, social cards, etc.) even though the homepage itself doesn't strictly need it.
4. **Formspree vs. a real backend for the contact/consultation form** — Formspree is fine through Phase 2 (no backend exists yet); revisit once Phase 3 introduces `app/api/` routes, since at that point routing the form through the app's own backend may be simpler than maintaining two integrations.


## 8. Summary for the Coding Agent

- Treat **Phase 1** as the immediate build: the marketing homepage (pixel-faithful to `design_handoff_eliyah_homepage/`) plus a 5-model product catalog (static, no configurator, no checkout), bilingual EN/HE with correct RTL, deployed live on **GitHub Pages** via static export (§3.1). Nothing else in this doc is in scope yet.
- Build the repo structure in §3.4 even though most of it stays empty until later phases — it saves a restructuring pass when Phase 2 starts.
- Treat §5 (design tokens, section spec, interactions) as literal acceptance criteria for Phase 1, not inspiration — this is a high-fidelity handoff, not a rough sketch.
- Implement `types/product.ts`/`types/order.ts` and `lib/pricing.ts`'s `calculatePrice()` signature exactly as specified in §6 once Phase 2 starts, so Phase 3's checkout route can import them directly without a rewrite.
- Respect the non-functional constraints in §4 from the outset, especially bilingual/RTL correctness and reduced-motion support — these are easy to skip and hard to retrofit.
- Resolve §7's open questions at the start of the phase each one blocks, not by guessing.

This unified requirements document is the single source of truth for scope, architecture, and design fidelity across all four phases, superseding `speakers-ecommerce-scope.md` and the design handoff's own README as the authoritative spec (those files remain as reference material — see Executive Overview).
