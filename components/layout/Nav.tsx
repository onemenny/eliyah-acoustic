'use client';

import { useEffect, useRef } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './Nav.module.css';

type Props = {
  locale: Locale;
  t: Dictionary;
};

/**
 * Fixed site nav (docs §5.4 item 1): transparent+blurred → solid past
 * 0.8×viewport; hides on scroll-down past one viewport, returns on
 * scroll-up. Scroll/motion math mirrors the design handoff's `frame()`
 * (support.js, reference-only — not ported) but applied as CSS Modules
 * class toggles rather than direct inline-style writes, per docs §3.2.
 */
export function Nav({ locale, t }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the hide/solidify animation
    // entirely — the nav CSS's own reduced-motion block renders a static,
    // always-legible resting state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ y, vh }) => {
      const el = navRef.current;
      if (!el) return;

      el.classList.toggle(styles.solid, y > vh * 0.8);

      const scrolledDown = y > lastY.current + 4 && y > vh;
      const scrolledUp = y < lastY.current - 4;
      if (scrolledDown) {
        el.classList.add(styles.hidden);
      } else if (scrolledUp || y < vh) {
        el.classList.remove(styles.hidden);
      }
      lastY.current = y;
    });
  }, []);

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Primary">
      <a href="#top" className={styles.wordmark}>
        <span className={styles.wordmarkMain}>Eliyah</span>
        <span className={styles.wordmarkSub}>Acoustic</span>
      </a>
      <div className={styles.links}>
        <a href="#core" className={styles.link}>
          {t.nav.value}
        </a>
        <a href="#process" className={styles.link}>
          {t.nav.process}
        </a>
        <a href="#approach" className={styles.link}>
          {t.nav.approach}
        </a>
        <a href="#material" className={styles.link}>
          {t.nav.systems}
        </a>
        <a href="#about" className={styles.link}>
          {t.nav.about}
        </a>
        <a href="#consultation" className={styles.cta}>
          {t.cta.primary}
        </a>
        <LocaleSwitcher locale={locale} label={t.langLabel} />
      </div>
    </nav>
  );
}
