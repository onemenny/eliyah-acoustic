'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './StructureOfService.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Structure of Service section (docs §5.4 item 6): eyebrow label + h2, then
 * 5 numbered process-step rows with a directional hover wash. Reveal-on-enter
 * covers only the label/head (indices 0/1) — the handoff has no `data-reveal`
 * on the row list itself, same precedent as CoreValue's un-staggered cell
 * grid, so the rows render statically.
 */
export function StructureOfService({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([labelRef.current, headRef.current]);
  }, []);

  return (
    <section id="process" className={styles.process}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div ref={labelRef} className={styles.label}>
            {t.serviceLabel}
          </div>
          <h2 ref={headRef} className={styles.head}>
            {t.serviceHead}
          </h2>
        </div>
        <div className={styles.rows}>
          {t.steps.map((step) => (
            <div key={step.n} className={styles.row}>
              <div className={styles.number}>{step.n}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.body}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
