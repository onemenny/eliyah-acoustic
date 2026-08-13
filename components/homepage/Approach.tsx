'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeRevealGroup } from '@/lib/reveal';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import styles from './Approach.module.css';

type Props = {
  t: Dictionary;
};

const PARALLAX_SPEED = 0.09; // docs §5.5
const OFFSCREEN_SKIP_PX = 240; // docs §5.5: skip elements >240px outside viewport

/**
 * Approach section (docs §5.4 item 9): 50/50 photo (`cherry-single.jpg`) /
 * text split. Unlike ExperienceBand's pinned/sticky band, this photo panel
 * is a normal in-flow element that scrolls through once, so its parallax
 * can't reuse ExperienceBand's pinned-band `p` progress formula (docs §5.5
 * only defines that for the pinned band). Instead it tracks the panel's own
 * distance from the viewport's vertical center each frame — 0 when
 * centered, negative above, positive below — and translates opposite that
 * offset by the parallax speed, producing the same "photo drifts slower
 * than the scroll" effect while the panel is in view. Reuses the same
 * `subscribeScrollFrame` + `scale(1.16) translate3d(...)` mechanism and
 * offscreen-skip guard as ExperienceBand.
 */
export function Approach({ t }: Props) {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the parallax entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible,
    // untransformed) state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ vh }) => {
      const imageEl = imageWrapRef.current;
      if (!imageEl) return;

      const rect = imageEl.getBoundingClientRect();

      // Skip elements far outside the viewport (§5.5 parallax rule) — also
      // sidesteps redundant style writes while the panel is nowhere near view.
      if (rect.bottom < -OFFSCREEN_SKIP_PX || rect.top > vh + OFFSCREEN_SKIP_PX) return;

      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      imageEl.style.transform = `scale(1.16) translate3d(0, ${(-centerOffset * PARALLAX_SPEED).toFixed(1)}px, 0)`;
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return observeRevealGroup([
      labelRef.current,
      headRef.current,
      bodyRef.current,
      chipsRef.current,
      closeRef.current,
    ]);
  }, []);

  return (
    <section id="approach" className={styles.approach}>
      <div className={styles.photoPanel}>
        <div ref={imageWrapRef} className={styles.imageWrap}>
          <Image
            src="/images/cherry-single.jpg"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            unoptimized
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.textPanel}>
        <div ref={labelRef} className={styles.label}>
          {t.approachLabel}
        </div>
        <h2 ref={headRef} className={styles.head}>
          {t.approachHead}
        </h2>
        <p ref={bodyRef} className={styles.body}>
          {t.approachBody}
        </p>
        <div ref={chipsRef} className={styles.chips}>
          {t.roomFactors.map((factor) => (
            <div key={factor} className={styles.chip}>
              {factor}
            </div>
          ))}
        </div>
        <p ref={closeRef} className={styles.close}>
          {t.approachClose}
        </p>
      </div>
    </section>
  );
}
