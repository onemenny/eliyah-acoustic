'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeReveal, observeRevealGroup } from '@/lib/reveal';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import styles from './MaterialForm.module.css';

type Props = {
  t: Dictionary;
};

const PARALLAX_SPEED = 0.05; // docs §5.5: grid tiles
const OFFSCREEN_SKIP_PX = 240; // docs §5.5: skip elements >240px outside viewport

const TILES = [
  { src: '/images/sys-cherry-wave.jpg' },
  { src: '/images/sys-burl-oval.jpg' },
  { src: '/images/sys-oak-steel.jpg' },
  { src: '/images/sys-steel-stack.jpg' },
  { src: '/images/sys-ivory-column.jpg' },
  { src: '/images/sys-black-octagon.jpg' },
];

/**
 * Material & Form section (docs §5.4 item 12): label/head/body intro over a
 * 6-up photo grid. Unlike ExperienceBand/Approach (one parallaxing element
 * each), this section drives 6 parallaxing tiles from a *single*
 * `subscribeScrollFrame` subscription that loops over all 6 image-wrap refs
 * per frame — not 6 independent subscriptions — since they all share the
 * same frame source and skip guard; one shared loop avoids redundant
 * listener/RAF overhead. Each tile's offset uses the same viewport-center
 * distance formula as Approach.tsx, just at the grid's own 0.05 speed.
 */
export function MaterialForm({ t }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the parallax entirely — the CSS
    // Module's own reduced-motion block renders the resting (fully visible,
    // untransformed) state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ vh }) => {
      imageWrapRefs.current.forEach((imageEl, index) => {
        const tile = tileRefs.current[index];
        if (!tile || !imageEl) return;

        const rect = tile.getBoundingClientRect();

        // Skip elements far outside the viewport (§5.5 parallax rule) — also
        // sidesteps redundant style writes for tiles nowhere near view.
        if (rect.bottom < -OFFSCREEN_SKIP_PX || rect.top > vh + OFFSCREEN_SKIP_PX) return;

        const centerOffset = rect.top + rect.height / 2 - vh / 2;
        imageEl.style.transform = `scale(1.16) translate3d(0, ${(-centerOffset * PARALLAX_SPEED).toFixed(1)}px, 0)`;
      });
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const introCleanup = observeRevealGroup([labelRef.current, headRef.current, bodyRef.current]);

    // Tiles mirror the handoff's `data-reveal="0|1|2|0|1|2"` stagger — a
    // 3-step cadence repeating across the 6 tiles, not a straight 0-5 count.
    const tileCleanups = tileRefs.current
      .map((el, index) => (el ? observeReveal(el, index % 3) : undefined))
      .filter((fn): fn is () => void => Boolean(fn));

    return () => {
      introCleanup();
      tileCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section id="material" className={styles.material}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div ref={labelRef} className={styles.label}>
            {t.matLabel}
          </div>
          <h2 ref={headRef} className={styles.head}>
            {t.matHead}
          </h2>
          <p ref={bodyRef} className={styles.body}>
            {t.matBody}
          </p>
        </div>

        <div className={styles.grid}>
          {TILES.map((tile, index) => (
            <div
              key={tile.src}
              ref={(el) => {
                tileRefs.current[index] = el;
              }}
              className={styles.tile}
            >
              <div
                ref={(el) => {
                  imageWrapRefs.current[index] = el;
                }}
                className={styles.imageWrap}
              >
                <Image
                  src={tile.src}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 50vw, (max-width: 1240px) 33vw, 380px"
                  unoptimized
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
