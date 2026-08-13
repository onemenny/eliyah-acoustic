'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import styles from './Hero.module.css';

type Props = {
  t: Dictionary;
};

/**
 * 100vh full-bleed hero (docs §5.4 item 2). Lockup fades/moves/scales out
 * over the first 0.7×viewport of scroll; the bottom row fades over
 * 0.35×viewport (docs §5.5) — math mirrors the design handoff's `frame()`
 * (support.js, reference-only) but writes directly to refs rather than
 * driving React state every frame.
 */
export function Hero({ t }: Props) {
  const textRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the fade/move/scale entirely — the
    // elements stay at their CSS resting state (opacity 1, no transform).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ y, vh }) => {
      const textEl = textRef.current;
      if (textEl) {
        const p = Math.min(1, Math.max(0, y / (vh * 0.7)));
        textEl.style.opacity = String(1 - p);
        textEl.style.transform = `translate3d(0, ${(p * 64).toFixed(1)}px, 0) scale(${(1 - p * 0.04).toFixed(3)})`;
      }

      const footEl = footRef.current;
      if (footEl) {
        footEl.style.opacity = String(Math.min(1, Math.max(0, 1 - y / (vh * 0.35))));
      }
    });
  }, []);

  return (
    <section id="top" className={styles.hero}>
      <Image
        src="/images/room-wall-system.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized
        className={styles.image}
      />
      {/* Shown ungraded — these are plain black scrims for text legibility
          only, no duotone/colour grading on the photo itself (docs §5.6). */}
      <div className={styles.scrimLinear} aria-hidden="true" />
      <div className={styles.scrimRadial} aria-hidden="true" />

      <div ref={textRef} className={styles.text}>
        <div className={styles.wordmarkMain}>Eliyah</div>
        <div className={styles.wordmarkSub}>Acoustic</div>
        <div className={styles.rule} aria-hidden="true" />
        <div className={styles.tagline}>{t.tagline}</div>
      </div>

      <div ref={footRef} className={styles.foot}>
        <p className={styles.positioning}>{t.positioning}</p>
        <span className={styles.scrollLabel}>{t.scrollLabel}</span>
      </div>
    </section>
  );
}
