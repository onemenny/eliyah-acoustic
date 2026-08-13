# Custom Speakers E-Commerce — Technical Scope

## Repo Structure (Phase 1)

```
speakers-site/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                  # Home
│   ├── products/
│   │   ├── page.tsx              # Catalog
│   │   └── [slug]/page.tsx       # Product detail + configurator
│   ├── about/page.tsx
│   ├── contact/page.tsx          # Formspree-backed form
│   ├── legal/
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   └── refunds/page.tsx
│   └── api/                      # empty in Phase 1-2, see note below
├── components/
│   ├── configurator/
│   │   ├── Configurator.tsx
│   │   ├── VariantSelector.tsx
│   │   └── PriceDisplay.tsx
│   ├── layout/                   # header, footer, nav
│   └── ui/
├── lib/
│   ├── pricing.ts                 # pure fn — shared client (Ph1) + server (Ph3)
│   ├── products.ts                # data access: static file now, DB query in Ph4
│   ├── currency.ts                # formatting + conversion
│   └── region.ts                  # Phase 2+: wraps @vercel/functions geolocation()
├── data/
│   └── products.ts                # source of truth through Phase 1-3
├── types/
│   ├── product.ts
│   └── order.ts
├── public/images/
└── next.config.js                 # basePath toggled by env var, see note below
```

**Note on `app/api/`:** Next.js won't build a Route Handler that needs per-request dynamic data while `output: 'export'` is set — only pure static GET handlers survive export, which is useless for creating a Stripe/Tranzila session. So the folder can sit empty as a placeholder, but real `route.ts` files can only land once `output: 'export'` is dropped (Phase 2/3). The thing that actually has to stay put across phases is `lib/pricing.ts` and `types/order.ts` — Phase 3's routes will import those directly.

**Note on `next.config.js`:** GitHub Pages needs `basePath`/`assetPrefix` set to your repo name (unless serving from the root `username.github.io`). Gate it on an env var so Phase 2's move to Vercel + custom domain is a config flip, not an edit.

## Data Model

```typescript
// types/product.ts

type Currency = 'USD' | 'ILS';

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
  baseCurrency: Currency;     // canonical currency — decide now (see scope doc)
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

`lib/pricing.ts` exports one function — `calculatePrice(product, config): PriceResult` — called client-side in Phase 1 for display, and server-side in Phase 3's checkout route for the real charge. Same function, two call sites, never two implementations.

No stock-count field on purpose: assuming these are custom-built to order, so each `Order` drives a build rather than decrementing inventory. If you do carry any ready-stock/display units, an `inventory` field is a cheap add to `Product` later.

## Requirements & Scope

**Pages**
- Home, product catalog, product detail + configurator (`[slug]`), about, contact
- Terms / Privacy / Refund policy — build these in Phase 1–2, not Phase 3. Your own addendum notes both Tranzila and Stripe require a live site with visible ToS/refund policy before underwriting completes; having them live before you apply removes a dependency from the Phase 3 timeline.
- Phase 3 additions: checkout review, order confirmation

**Configurator behavior**
- Per-category variant selection (wood finish, driver, size, engraving) — treat the category list as data-driven, not hardcoded to exactly four
- Live price via `calculatePrice()`; required categories block submission until selected
- Optional nice-to-have: encode the selection in the URL query string so a configuration is shareable by link — cheap to add now, annoying to retrofit later

**Region detection (Phase 3 payment routing)**
- Phase 2+: use `@vercel/functions`'s `geolocation()` in Edge Middleware — <cite index="11-1">it reads location info for the incoming request from Vercel's geolocation headers, including the two-letter country code</cite> — to default the displayed currency/region. This only works once deployed to Vercel, not in local dev or on GitHub Pages.
- Phase 3: don't route Stripe vs. Tranzila off that IP guess. Use the billing country the customer actually enters/confirms at checkout as the source of truth — both providers need accurate billing details anyway, and IP geolocation is easy to get wrong (VPNs, ISP routing, travelers).

**"Done" per phase**
- Phase 1: catalog + configurator live on GitHub Pages, contact form working via Formspree, legal pages in place, mobile-responsive, no domain/payment
- Phase 2: same, live on custom domain via Vercel with SSL, `output: 'export'` removed, GitHub Pages retired
- Phase 3: Stripe + Tranzila both processing real transactions, server-side price recomputation from config, webhook-confirmed orders, order confirmation email, billing-country routing tested both ways
- Phase 4: intentionally undefined until Phase 3 pain points justify it
