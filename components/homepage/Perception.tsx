'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Perception.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Sound & Individual Perception section (docs §5.4 item 11): label + head in
 * the left column, a single body paragraph in the right column. Reveal-on-enter
 * indices 0/1/2 mirror the design handoff's `data-reveal="0|1|2"` on
 * label/head/body.
 */
export function Perception({ t }: Props) {
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
    <section id="perception" className={styles.perception}>
      <div className={styles.inner}>
        <div>
          <div ref={labelRef} className={styles.label}>
            {t.percLabel}
          </div>
          <h2 ref={headRef} className={styles.head}>
            {t.percHead}
          </h2>
        </div>
        <p ref={bodyRef} className={styles.body}>
          {t.percBody}
        </p>
      </div>
    </section>
  );
}
