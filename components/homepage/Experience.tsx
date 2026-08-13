'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import styles from './Experience.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Experience section (docs §5.4 item 10): text column (label/head/body) +
 * a 1px-gap stack of three display lines, the third rendered in brass.
 * Reveal-on-enter indices 0/1/2 mirror the design handoff's
 * `data-reveal="0|1|2"` on label/head/body — the line stack itself has no
 * `data-reveal` in the handoff, so (like `CoreValue`'s cell row) it renders
 * statically rather than being staggered.
 */
export function Experience({ t }: Props) {
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

  const lastIndex = t.expLines.length - 1;

  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.inner}>
        <div>
          <div ref={labelRef} className={styles.label}>
            {t.expLabel}
          </div>
          <h2 ref={headRef} className={styles.head}>
            {t.expHead}
          </h2>
          <p ref={bodyRef} className={styles.body}>
            {t.expBody}
          </p>
        </div>
        <div className={styles.lines}>
          {t.expLines.map((line, i) => (
            <div key={line} className={i === lastIndex ? styles.lineBrass : styles.line}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
