'use client';

import { useState } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { ConsultationDialog } from '@/components/shared/ConsultationDialog';
import styles from '@/app/[locale]/products/[slug]/page.module.css';

type Props = {
  product: { name: string; slug: string };
  t: Dictionary;
  locale: Locale;
};

/**
 * Product detail page's CTA row (docs §3.4 `catalog/`, issue #13). Same
 * ConsultationDialog as the homepage's Consultation section, but with the
 * `product` prop set so the inquiry's hidden field and pre-filled message
 * identify which model the visitor is asking about (issue #13 AC 3).
 *
 * A client component wrapping the CTA row is necessary here because
 * app/[locale]/products/[slug]/page.tsx itself stays an async server
 * component (static export, docs §3.1) — only this leaf needs interactivity.
 * Reuses the product page's own CSS module for the `.ctaRow`/`.primary`/
 * `.secondary` classes so the buttons render identically to the previous
 * <Link> pair.
 */
export function ProductConsultationCta({ product, t, locale }: Props) {
  const [openVariant, setOpenVariant] = useState<'primary' | 'secondary' | null>(null);

  return (
    <div className={styles.ctaRow}>
      <button type="button" className={styles.primary} onClick={() => setOpenVariant('primary')}>
        {t.cta.primary}
      </button>
      <button type="button" className={styles.secondary} onClick={() => setOpenVariant('secondary')}>
        {t.cta.secondary}
      </button>

      {openVariant && (
        <ConsultationDialog
          open
          onClose={() => setOpenVariant(null)}
          variant={openVariant}
          t={t}
          locale={locale}
          product={product}
        />
      )}
    </div>
  );
}
