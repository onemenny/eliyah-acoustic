'use client';

import { useEffect, useRef, useState } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import { ConsultationDialog } from '@/components/shared/ConsultationDialog';
import styles from './Consultation.module.css';

type Props = {
  t: Dictionary;
  locale: Locale;
};

/**
 * Consultation section (docs §5.4 item 16): eyebrow label + display head +
 * body + a closing CTA row (primary "Request a Consultation" + secondary
 * "Begin a System"). Reveal indices 0/1/2/3 mirror the handoff's
 * `data-reveal="0|1|2|3"` on label/head/body/CTA-row.
 *
 * Issue #13: both CTAs are now buttons that open a shared
 * ConsultationDialog (components/shared/ConsultationDialog.tsx) rather than
 * anchors — the actual Formspree submission happens inside that dialog, and
 * this section's own resting visual layout stays exactly as the handoff
 * specs it (no inline fields added here).
 */
export function Consultation({ t, locale }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);
  const [openVariant, setOpenVariant] = useState<'primary' | 'secondary' | null>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([
      labelRef.current,
      headRef.current,
      bodyRef.current,
      ctaRowRef.current,
    ]);
  }, []);

  return (
    <section id="consultation" className={styles.consultation}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          {t.commissionLabel}
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.commissionHead}
        </h2>
        <p ref={bodyRef} className={styles.body}>
          {t.commissionBody}
        </p>
        <div ref={ctaRowRef} className={styles.ctaRow}>
          <button type="button" className={styles.primary} onClick={() => setOpenVariant('primary')}>
            {t.cta.primary}
          </button>
          <button type="button" className={styles.secondary} onClick={() => setOpenVariant('secondary')}>
            {t.cta.secondary}
          </button>
        </div>
      </div>

      {openVariant && (
        <ConsultationDialog
          open
          onClose={() => setOpenVariant(null)}
          variant={openVariant}
          t={t}
          locale={locale}
        />
      )}
    </section>
  );
}
