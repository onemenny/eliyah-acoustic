'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Application.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Application section (docs §5.4 item 13): head over four bordered cells
 * (plain text, unlike CoreValue's numbered 01-03 cells) plus a closing body
 * paragraph. Reveal indices 0/1/2 on label/head/body mirror the handoff's
 * `data-reveal` attributes; the cell row itself isn't reveal-staggered in
 * the handoff (only label/head/body carry `data-reveal`).
 */
export function Application({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([labelRef.current, headRef.current, bodyRef.current]);
  }, []);

  return (
    <section id="application" className={styles.application}>
      <div className={styles.inner}>
        <div ref={labelRef} className={styles.label}>
          {t.appLabel}
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.appHead}
        </h2>
        <div className={styles.cells}>
          {t.applications.map((item) => (
            <div key={item} className={styles.cell}>
              {item}
            </div>
          ))}
        </div>
        <p ref={bodyRef} className={styles.body}>
          {t.appBody}
        </p>
      </div>
    </section>
  );
}
