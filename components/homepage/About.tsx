'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import type { Dictionary } from '@/i18n';
import { observeReveal } from '@/lib/reveal';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import styles from './About.module.css';

type Props = {
  t: Dictionary;
};

const PARALLAX_SPEED = 0.07; // docs §5.5: about portrait
const OFFSCREEN_SKIP_PX = 240; // docs §5.5: skip elements >240px outside viewport

// Real team photos/bios aren't ready yet (docs §7 open item 2, Status.md
// "Known open items" #3) — the portrait is still a placeholder product shot,
// not a portrait. Keep the team row unrendered (not just visually hidden)
// until real content exists; flip this one constant when it does.
const SHOW_TEAM = false;

/**
 * About section (docs §5.4 item 15): the homepage's only light-theme
 * section (`--travertine` bg instead of `--void-oak` everywhere else).
 * Left: parallaxing portrait placeholder (`sys-cherry-tall.jpg`), reusing
 * `Approach.tsx`'s in-flow viewport-center-distance parallax formula at this
 * section's own 0.07 speed. Right: label/head/two paragraphs/pull-quote,
 * plus an optional team row gated by `SHOW_TEAM`. Reveal indices mirror the
 * handoff's `data-reveal="0|1|2|3|3|4"` on portrait/label/head/bodyA/bodyB/
 * quote-block — bodyA and bodyB share index 3 (revealed together, unlike
 * Manifesto's per-paragraph stagger), so this uses individual `observeReveal`
 * calls rather than `observeRevealGroup`'s one-index-per-array-slot
 * convenience. The team row carries no `data-reveal` in the handoff, so it
 * renders statically like CoreValue's cell row.
 */
export function About({ t }: Props) {
  const portraitRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const bodyARef = useRef<HTMLParagraphElement>(null);
  const bodyBRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

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
      // sidesteps redundant style writes while the portrait is nowhere near view.
      if (rect.bottom < -OFFSCREEN_SKIP_PX || rect.top > vh + OFFSCREEN_SKIP_PX) return;

      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      imageEl.style.transform = `scale(1.16) translate3d(0, ${(-centerOffset * PARALLAX_SPEED).toFixed(1)}px, 0)`;
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets: [HTMLElement | null, number][] = [
      [portraitRef.current, 0],
      [labelRef.current, 1],
      [headRef.current, 2],
      [bodyARef.current, 3],
      [bodyBRef.current, 3],
      [quoteRef.current, 4],
    ];

    const cleanups = targets
      .filter((pair): pair is [HTMLElement, number] => Boolean(pair[0]))
      .map(([el, index]) => observeReveal(el, index));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div ref={portraitRef} className={styles.portrait}>
            <div ref={imageWrapRef} className={styles.imageWrap}>
              <Image
                src="/images/sys-cherry-tall.jpg"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                unoptimized
                className={styles.image}
              />
            </div>
          </div>

          <div>
            <div ref={labelRef} className={styles.label}>
              {t.aboutLabel}
            </div>
            <h2 ref={headRef} className={styles.head}>
              {t.aboutHead}
            </h2>
            <p ref={bodyARef} className={styles.body}>
              {t.aboutA}
            </p>
            <p ref={bodyBRef} className={styles.body}>
              {t.aboutB}
            </p>
            <div ref={quoteRef} className={styles.quoteBlock}>
              <p className={styles.quote}>{t.aboutQuote}</p>
              <p className={styles.quoteSub}>{t.aboutQuoteSub}</p>
            </div>
          </div>
        </div>

        {SHOW_TEAM && (
          <div className={styles.teamSection}>
            <div className={styles.teamLabel}>{t.teamLabel}</div>
            <div className={styles.teamGrid}>
              {t.team.map((member) => (
                <div key={member.name}>
                  <div className={styles.teamName}>{member.name}</div>
                  <div className={styles.teamRole}>{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
