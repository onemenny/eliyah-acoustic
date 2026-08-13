import Link from 'next/link';

import { ProductGallery } from '@/components/catalog/ProductGallery';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { products } from '@/data/products';
import { formatIndicativePrice } from '@/lib/formatPrice';
import { defaultLocale, getDictionary, isLocale, locales, type Locale } from '@/i18n';
import styles from './page.module.css';

// Product detail page (docs §2.1, §3.4 `app/[locale]/products/[slug]/`,
// issue #11). Statically generates all 5 placeholder products × 2 locales.
// `generateStaticParams` returns the full combined param set (locale + slug)
// rather than relying on implicit parent/child merging with the
// `app/[locale]/layout.tsx` layout's own `generateStaticParams` — explicit
// here, since this is the first nested-dynamic-segment route in the repo.
//
// `dynamicParams = false` matches the parent layout's convention and is
// required under `output: 'export'` (docs §3.1): static export enforces that
// every requested [locale]/[slug] combination appear in
// `generateStaticParams()` regardless of this flag's value, but leaving it
// unset still let an out-of-list slug reach `next dev`'s server-render path
// far enough to throw ("missing param ... required with output: export"),
// producing a blank/crashed page instead of a clean 404 — setting it
// explicitly makes Next's own static-miss handling intercept the request
// before that happens (found in review, issue #11 fix cycle 1). The inline
// "not found" JSX below stays as defensive code — on GitHub Pages only the
// 10 pre-rendered locale×slug files exist as static HTML, so a genuinely
// unknown slug never reaches this component in production and always hits
// the host's own 404 (out of scope here — see issue #14); this branch would
// only fire if `products` and `generateStaticParams` ever disagreed with
// each other. `variantCategories` is rendered as a plain static list only
// when non-empty — no selection state, no price math (Phase 2, §6).
export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((product) => ({ locale, slug: product.slug })));
}

export const dynamicParams = false;

type Params = Promise<{ locale: string; slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getDictionary(locale);
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <>
        <Nav locale={locale} t={t} />
        <main>
          <section className={styles.notFound}>
            <h1 className={styles.notFoundHead}>{t.products.notFoundHead}</h1>
            <p className={styles.notFoundBody}>{t.products.notFoundBody}</p>
            <Link href={`/${locale}/products/`} className={styles.backLink}>
              {t.products.backToCatalog}
            </Link>
          </section>
        </main>
        <Footer t={t} />
      </>
    );
  }

  return (
    <>
      <Nav locale={locale} t={t} />
      <main>
        <section className={styles.product}>
          <Link href={`/${locale}/products/`} className={styles.backLink}>
            {t.products.backToCatalog}
          </Link>

          <div className={styles.layout}>
            <ProductGallery images={product.images} t={t} />

            <div className={styles.info}>
              <h1 className={styles.name}>{product.name}</h1>
              <p className={styles.description}>{product.description}</p>
              <div className={styles.price}>
                {t.products.priceFrom}{' '}
                {formatIndicativePrice(product.basePriceCents, product.baseCurrency, locale)}
              </div>

              {/* Static list only — real per-model variant data lands with
                  issue #12; the placeholder products all have an empty
                  array, so this block renders nothing until then. */}
              {product.variantCategories.length > 0 && (
                <div className={styles.variants}>
                  <div className={styles.variantsLabel}>{t.products.optionsLabel}</div>
                  {product.variantCategories.map((category) => (
                    <div key={category.category} className={styles.variantCategory}>
                      <div className={styles.variantCategoryLabel}>{category.label}</div>
                      <ul className={styles.variantOptions}>
                        {category.options.map((option) => (
                          <li key={option.id}>{option.label}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Same non-submitting anchor pattern as Consultation.tsx —
                  cross-page here, so a plain Link back to the homepage's
                  `#consultation` id is enough: Nav's own "hash on load"
                  effect (components/layout/Nav.tsx) handles the
                  scroll-into-view once the homepage mounts. Issue #13 wires
                  the actual submission. */}
              <div className={styles.ctaRow}>
                <Link href={`/${locale}/#consultation`} className={styles.primary}>
                  {t.cta.primary}
                </Link>
                <Link href={`/${locale}/#consultation`} className={styles.secondary}>
                  {t.cta.secondary}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
