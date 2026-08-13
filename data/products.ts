import type { Product } from '@/types/product';

// Source of truth for the catalog through Phase 2-3 (docs §3.4).
//
// PLACEHOLDER DATA — issue #10. All 5 entries below (name, description,
// price, images) are throwaway stand-ins: real imagery/copy for the 5 actual
// speaker models is pending from the user (docs §7 open item 0 / Status.md
// open item 1, tracked as issue #12). Images are borrowed from the existing
// `public/images/sys-*.jpg` handoff photos already used elsewhere on the
// homepage (MaterialForm's gallery, About's placeholder portrait) — same
// stand-in convention, not new assets.
//
// When #12 lands, this file gets wholesale REPLACED with the 5 real
// `Product` entries, not extended in place — don't build on top of these
// placeholder ids/slugs/prices as if they were real catalog content.
//
// `baseCurrency: 'ILS'` follows the doc's non-binding recommendation at §7
// open question 1 (canonical currency still unconfirmed).
export const products: Product[] = [
  {
    id: 'placeholder-01',
    slug: 'octagon',
    name: 'Octagon',
    description: 'A compact floor system in blackened oak, built for focused listening rooms.',
    basePriceCents: 4_200_000,
    baseCurrency: 'ILS',
    images: ['/images/sys-black-octagon.jpg'],
    variantCategories: [],
  },
  {
    id: 'placeholder-02',
    slug: 'oval',
    name: 'Oval',
    description: 'A burl-veneered pair shaped for open living spaces and natural dispersion.',
    basePriceCents: 5_600_000,
    baseCurrency: 'ILS',
    images: ['/images/sys-burl-oval.jpg'],
    variantCategories: [],
  },
  {
    id: 'placeholder-03',
    slug: 'column',
    name: 'Column',
    description: 'A tall cherry-wood column system, suited to double-height architectural rooms.',
    basePriceCents: 7_800_000,
    baseCurrency: 'ILS',
    images: ['/images/sys-cherry-tall.jpg'],
    variantCategories: [],
  },
  {
    id: 'placeholder-04',
    slug: 'stack',
    name: 'Stack',
    description: 'A steel-and-oak stacked-driver system for high-output, large-room installations.',
    basePriceCents: 9_500_000,
    baseCurrency: 'ILS',
    images: ['/images/sys-oak-steel.jpg'],
    variantCategories: [],
  },
  {
    id: 'placeholder-05',
    slug: 'ivory',
    name: 'Ivory',
    description: 'An ivory-lacquered column system, finished for light, minimal interiors.',
    basePriceCents: 6_400_000,
    baseCurrency: 'ILS',
    images: ['/images/sys-ivory-column.jpg'],
    variantCategories: [],
  },
];
