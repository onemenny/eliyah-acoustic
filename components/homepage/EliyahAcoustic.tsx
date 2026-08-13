'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './EliyahAcoustic.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Eliyah Acoustic narrative section (docs §5.4 item 8): eyebrow (the literal
 * brand name, not a dictionary key — the handoff inlines this text directly
 * in its markup rather than templating it, same precedent as Nav's hardcoded
 * "ELIYAH ACOUSTIC" wordmark) + large head + two-column body. Reveal indices
 * 0/1/2/3 mirror the handoff's `data-reveal="0|1|2|3"` on label/head/bodyA/bodyB.
 */
export function EliyahAcoustic({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyARef = useRef<HTMLParagraphElement>(null);
  const bodyBRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([
      labelRef.current,
      headRef.current,
      bodyARef.current,
      bodyBRef.current,
    ]);
  }, []);

  return (
    <section id="studio-intro" className={styles.studio}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          Eliyah Acoustic
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.studioHead}
        </h2>
        <div className={styles.body}>
          <p ref={bodyARef} className={styles.bodyA}>
            {t.studioA}
          </p>
          <p ref={bodyBRef} className={styles.bodyB}>
            {t.studioB}
          </p>
        </div>
      </div>
    </section>
  );
}
