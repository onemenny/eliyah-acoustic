'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './CoreValue.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Core Value section (docs §5.4 item 4): eyebrow label + h2 + sub paragraph +
 * three numbered cells + closing display line. Reveal-on-enter indices 0/1/2/3
 * mirror the design handoff's `data-reveal="0|1|2|3"` on label/head/sub/close
 * — the cell row itself has no `data-reveal` in the handoff, so it renders
 * statically (no fade-in) rather than being staggered.
 */
export function CoreValue({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const closeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([
      labelRef.current,
      headRef.current,
      subRef.current,
      closeRef.current,
    ]);
  }, []);

  return (
    <section id="core" className={styles.core}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          {t.coreLabel}
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.coreHead}
        </h2>
        <p ref={subRef} className={styles.sub}>
          {t.coreSub}
        </p>
        <div className={styles.cells}>
          {t.coreItems.map((item) => (
            <div key={item.n} className={styles.cell}>
              <div className={styles.cellNumber}>{item.n}</div>
              <div className={styles.cellText}>{item.text}</div>
            </div>
          ))}
        </div>
        <p ref={closeRef} className={styles.close}>
          {t.coreClose}
        </p>
      </div>
    </section>
  );
}
