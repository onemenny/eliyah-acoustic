'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import styles from './ExperienceBand.module.css';

type Props = {
  t: Dictionary;
};

const FADE_START = 0.74; // docs §5.5: copy holds full opacity to p=0.74, fades to 0 by p=1
const PARALLAX_SPEED = 0.14;
const OFFSCREEN_SKIP_PX = 240; // docs §5.5: skip elements >240px outside viewport

/**
 * Experience Principle section (docs §5.4 item 5): 170vh outer / 100vh
 * `position: sticky` inner pinned band over `burl-pair-wide.jpg`. Progress
 * `p = clamp(-rect.top / (rect.height - vh), 0, 1)` (§5.5) drives both the
 * copy's fade-out and the image's parallax translate — computed from the
 * *outer* section's own bounding rect every scroll frame, unlike Hero's
 * simpler scroll-from-top math, since this section stays pinned in the
 * viewport for a fixed scroll distance rather than scrolling through once.
 */
export function ExperienceBand({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the parallax/progress-fade
    // entirely — the CSS Module's own reduced-motion block renders the
    // resting (fully visible, untransformed) state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ vh }) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();

      // Skip elements far outside the viewport (§5.5 parallax rule) — also
      // sidesteps redundant style writes while the band is nowhere near view.
      if (rect.bottom < -OFFSCREEN_SKIP_PX || rect.top > vh + OFFSCREEN_SKIP_PX) return;

      // Guard against a zero/negative denominator on unusually short
      // viewports where 170vh doesn't clear vh by much.
      const denom = Math.max(1, rect.height - vh);
      const p = Math.min(1, Math.max(0, -rect.top / denom));

      const imageEl = imageRef.current;
      if (imageEl) {
        imageEl.style.transform = `scale(1.16) translate3d(0, ${(p * PARALLAX_SPEED * vh).toFixed(1)}px, 0)`;
      }

      const textEl = textRef.current;
      if (textEl) {
        const opacity = p <= FADE_START ? 1 : 1 - (p - FADE_START) / (1 - FADE_START);
        textEl.style.opacity = opacity.toFixed(3);
      }
    });
  }, []);

  return (
    <section id="principle" ref={sectionRef} className={styles.principle}>
      <div className={styles.sticky}>
        <div ref={imageRef} className={styles.imageWrap}>
          <Image
            src="/images/burl-pair-wide.jpg"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className={styles.image}
          />
        </div>
        {/* Shown ungraded, black scrims only for text legibility (docs §5.6). */}
        <div className={styles.scrimLinear} aria-hidden="true" />
        <div className={styles.scrimDirectional} aria-hidden="true" />

        <div ref={textRef} className={styles.text}>
          <div className={styles.label}>{t.principleLabel}</div>
          <h2 className={styles.head}>{t.principleHead}</h2>
          <p className={styles.body}>{t.principleBody}</p>
          <div className={styles.lines}>
            <div className={styles.lineA}>{t.principleA}</div>
            <div className={styles.lineB}>{t.principleB}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
