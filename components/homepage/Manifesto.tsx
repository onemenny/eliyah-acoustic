'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Manifesto.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Manifesto section (docs §5.4 item 14): eyebrow label + large head + a
 * two-column body (reusing `EliyahAcoustic.tsx`'s item-8 grid pattern) +
 * a closing display line (reusing `CoreValue.tsx`'s item-4 `.close` pattern).
 * Reveal indices 0/1/2/3/4 mirror the handoff's
 * `data-reveal="0|1|2|3|4"` on label/head/bodyA/bodyB/close — unlike
 * `EliyahAcoustic`, the two body paragraphs are staggered individually here.
 */
export function Manifesto({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyARef = useRef<HTMLParagraphElement>(null);
  const bodyBRef = useRef<HTMLParagraphElement>(null);
  const closeRef = useRef<HTMLParagraphElement>(null);

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
      closeRef.current,
    ]);
  }, []);

  return (
    <section id="manifesto" className={styles.manifesto}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          {t.maniLabel}
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.maniHead}
        </h2>
        <div className={styles.body}>
          <p ref={bodyARef} className={styles.bodyA}>
            {t.maniA}
          </p>
          <p ref={bodyBRef} className={styles.bodyB}>
            {t.maniB}
          </p>
        </div>
        <p ref={closeRef} className={styles.close}>
          {t.maniClose}
        </p>
      </div>
    </section>
  );
}
