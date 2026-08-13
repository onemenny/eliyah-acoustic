'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

import type { Dictionary } from '@/i18n';
import { scrollToHash } from '@/lib/anchorScroll';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Consultation.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Consultation section (docs §5.4 item 16): eyebrow label + display head +
 * body + a closing CTA row (primary "Request a Consultation" + secondary
 * "Begin a System"). Reveal indices 0/1/2/3 mirror the handoff's
 * `data-reveal="0|1|2|3"` on label/head/body/CTA-row.
 *
 * Both CTAs are real anchors (not dead links) matching the handoff exactly:
 * primary points at this section's own `#consultation` id (the same target
 * Nav's CTA already scrolls to via lib/anchorScroll.ts), secondary at
 * `#top`. Neither submits anything yet — issue #13 (Formspree wiring) is
 * the integration point that turns this CTA row into a real submission
 * (e.g. wrapping it in a <form>/adding an onSubmit); this issue only needs
 * the markup to be ready and non-dead, not functional.
 */
export function Consultation({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

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

  // Same explicit-scroll takeover as Nav.tsx: native fragment navigation's
  // `scroll-behavior: smooth` was found to get cancelled mid-flight (see
  // lib/anchorScroll.ts) — most relevant here for the secondary CTA's
  // full-page scroll back to `#top`.
  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;

    if (scrollToHash(href.slice(1))) {
      event.preventDefault();
      history.pushState(null, '', href);
    }
  }

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
        {/* Issue #13 integration point: swap these anchors for a real
            Formspree submission (form/onSubmit) once contact-form wiring
            lands. Until then they're plain, non-dead in-page anchors. */}
        <div ref={ctaRowRef} className={styles.ctaRow}>
          <a href="#consultation" className={styles.primary} onClick={handleAnchorClick}>
            {t.cta.primary}
          </a>
          <a href="#top" className={styles.secondary} onClick={handleAnchorClick}>
            {t.cta.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
