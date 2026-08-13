'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Vision.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Vision section (docs §5.4 item 3): eyebrow label + h1 + one body
 * paragraph, staggered reveal-on-enter — indices 0/1/2 mirror the design
 * handoff's `data-reveal="0|1|2"` on this section.
 */
export function Vision({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([labelRef.current, headRef.current, bodyRef.current]);
  }, []);

  return (
    <section id="vision" className={styles.vision}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          {t.visionLabel}
        </div>
        <h1 ref={headRef} className={styles.head}>
          {t.visionHead}
        </h1>
        <p ref={bodyRef} className={styles.body}>
          {t.visionBody}
        </p>
      </div>
    </section>
  );
}
