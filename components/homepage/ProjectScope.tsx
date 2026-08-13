'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './ProjectScope.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Project Scope section (docs §5.4 item 7): two-column layout — label+head
 * left, intro+three pricing-driver rows right. Reveal indices 0/1/2 mirror
 * the handoff's `data-reveal="0|1|2"`: the right column's intro and rows
 * reveal together as one group (index 2), not staggered individually.
 */
export function ProjectScope({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the reveal entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible)
    // state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([labelRef.current, headRef.current, rightRef.current]);
  }, []);

  return (
    <section id="scope" className={styles.scope}>
      <div className={styles.grid}>
        <div>
          <div ref={labelRef} className={styles.label}>
            {t.scopeLabel}
          </div>
          <h2 ref={headRef} className={styles.head}>
            {t.scopeHead}
          </h2>
        </div>
        <div ref={rightRef} className={styles.right}>
          <div className={styles.intro}>{t.scopeIntro}</div>
          <div className={styles.rows}>
            {t.scopeItems.map((item) => (
              <div key={item} className={styles.row}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
