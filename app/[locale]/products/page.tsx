import { ProductCard } from '@/components/catalog/ProductCard';
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { products } from '@/data/products';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';
import styles from './products.module.css';

// Catalog listing page (docs §2.1, §3.4 `app/[locale]/products/`) — the
// site's first non-homepage route. Shares the homepage's Nav/Footer and
// `--content-max-width` column, but is otherwise a plain static grid: no
// parallax/reveal, no client component. `data/products.ts` is placeholder
// content pending issue #12 (see that file's header comment) — this page's
// job is the layout, not the content.
export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);

  return (
    <>
      <Nav locale={locale} t={t} />
      <main>
        <section className={styles.products}>
          <div className={styles.header}>
            <div className={styles.label}>{t.products.label}</div>
            <h1 className={styles.head}>{t.products.head}</h1>
            <p className={styles.intro}>{t.products.intro}</p>
          </div>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} t={t} />
            ))}
          </div>
        </section>
      </main>
      <Footer t={t} />
    </>
  );
}
