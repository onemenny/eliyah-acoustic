import Image from 'next/image';

import type { Dictionary, Locale } from '@/i18n';
import { formatIndicativePrice } from '@/lib/formatPrice';
import type { Product } from '@/types/product';
import styles from './ProductCard.module.css';

type Props = {
  product: Product;
  locale: Locale;
  t: Dictionary;
};

/**
 * Catalog listing card (docs §3.4 `catalog/`, §2.1): image, name, short
 * description, indicative price — no buy/cart affordance (§2.5). Static —
 * no reveal-on-scroll/parallax, unlike the homepage's sections; the doc
 * doesn't call for one here and a plain grid keeps this first non-homepage
 * page a server component. Deliberately not a link: there's no product
 * detail page yet (separate issue) for it to point to.
 */
export function ProductCard({ product, locale, t }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.images[0]}
          alt=""
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          unoptimized
          className={styles.image}
        />
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.price}>
          {t.products.priceFrom} {formatIndicativePrice(product.basePriceCents, product.baseCurrency, locale)}
        </div>
      </div>
    </article>
  );
}
