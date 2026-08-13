'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { scrollToHash } from '@/lib/anchorScroll';
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

  // Keeps --nav-height (styles/tokens.css) in sync with the nav's actual
  // rendered box — it wraps to more than one row on narrow viewports, so a
  // hardcoded fallback alone isn't enough for `scroll-margin-top` on anchor
  // targets (globals.css) to reliably clear it. Independent of reduced
  // motion: this is a layout measurement, not an animation.
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const setNavHeight = () => {
      document.documentElement.style.setProperty(
        '--nav-height',
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    };
    setNavHeight();

    const observer = new ResizeObserver(setNavHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handles a URL loaded with a hash already set (e.g. `/en/#core`) — the
  // click handler below only covers in-page anchor clicks, not initial load,
  // and both were reported broken under native fragment navigation (see
  // lib/anchorScroll.ts).
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) scrollToHash(hash);
  }, []);

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;

    // Only take over when the target actually exists (later Phase 1 issues
    // still land the sections some of these links point to) — otherwise let
    // the browser's default (a harmless no-op scroll + hash update) happen.
    if (scrollToHash(href.slice(1))) {
      event.preventDefault();
      history.pushState(null, '', href);
    }
  }

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Primary">
      <a href="#top" className={styles.wordmark} onClick={handleAnchorClick}>
        <span className={styles.wordmarkMain}>Eliyah</span>
        <span className={styles.wordmarkSub}>Acoustic</span>
      </a>
      <div className={styles.links}>
        <a href="#core" className={styles.link} onClick={handleAnchorClick}>
          {t.nav.value}
        </a>
        <a href="#process" className={styles.link} onClick={handleAnchorClick}>
          {t.nav.process}
        </a>
        <a href="#approach" className={styles.link} onClick={handleAnchorClick}>
          {t.nav.approach}
        </a>
        <a href="#material" className={styles.link} onClick={handleAnchorClick}>
          {t.nav.systems}
        </a>
        <a href="#about" className={styles.link} onClick={handleAnchorClick}>
          {t.nav.about}
        </a>
        <a href="#consultation" className={styles.cta} onClick={handleAnchorClick}>
          {t.cta.primary}
        </a>
        <LocaleSwitcher locale={locale} label={t.langLabel} />
      </div>
    </nav>
  );
}
