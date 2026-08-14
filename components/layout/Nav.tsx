'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';

import type { Dictionary, Locale } from '@/i18n';
import { scrollToHash } from '@/lib/anchorScroll';
import { subscribeScrollFrame } from '@/lib/scrollFx';
import { LocaleSwitcher } from './LocaleSwitcher';
import styles from './Nav.module.css';

type Props = {
  locale: Locale;
  t: Dictionary;
};

// Empirically measured in-browser (issue #15 spec, open question 2): the
// desktop `.links` row's natural (unwrapped) content width plus the
// wordmark and nav padding comes to ~897px at /en/ (the binding case — /he/
// needs only ~744px, EN's Latin labels run wider). 960px leaves a ~60px
// buffer above that so normal font-rendering/scrollbar variance can't tip
// it into wrapping right at the boundary. Must match Nav.module.css's
// `@media` value.
const NAV_COLLAPSE_BREAKPOINT_PX = 960;

/**
 * Fixed site nav (docs §5.4 item 1): transparent+blurred → solid past
 * 0.8×viewport; hides on scroll-down past one viewport, returns on
 * scroll-up. Scroll/motion math mirrors the design handoff's `frame()`
 * (support.js, reference-only — not ported) but applied as CSS Modules
 * class toggles rather than direct inline-style writes, per docs §3.2.
 *
 * Issue #15: below NAV_COLLAPSE_BREAKPOINT_PX the desktop link row is
 * replaced by a hamburger toggle that opens the same links/CTA/language-
 * switcher in a slide-down `<dialog>` panel — native `<dialog>` gives
 * focus-trap/Esc-close/focus-return for free, mirroring the pattern already
 * established by components/shared/ConsultationDialog.tsx.
 */
export function Nav({ locale, t }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const menuDialogRef = useRef<HTMLDialogElement>(null);
  const menuOpenRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Docs §4/§5.5: reduced motion skips the hide/solidify animation
    // entirely — the nav CSS's own reduced-motion block renders a static,
    // always-legible resting state instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    return subscribeScrollFrame(({ y, vh }) => {
      const el = navRef.current;
      if (!el) return;

      // Issue #15 AC5/AC6: while the mobile panel is open the bar must stay
      // solid (never the transparent pre-scroll state) and never hide —
      // body scroll is locked while open (see the effect below) so this
      // mostly matters for a `resize` frame (e.g. a mobile on-screen
      // keyboard opening) landing mid-open, which scroll-locking alone
      // doesn't prevent.
      el.classList.toggle(styles.solid, y > vh * 0.8 || menuOpenRef.current);

      const scrolledDown = y > lastY.current + 4 && y > vh;
      const scrolledUp = y < lastY.current - 4;
      if (menuOpenRef.current) {
        el.classList.remove(styles.hidden);
      } else if (scrolledDown) {
        el.classList.add(styles.hidden);
      } else if (scrolledUp || y < vh) {
        el.classList.remove(styles.hidden);
      }
      lastY.current = y;
    });
  }, []);

  // Keeps the solid/hidden classes correct the instant the panel opens or
  // closes, rather than waiting for the next scroll/resize frame (which may
  // never come — e.g. closing the panel while already at the top of the
  // page produces no further scroll event).
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    const el = navRef.current;
    if (!el) return;

    if (menuOpen) {
      el.classList.add(styles.solid);
      el.classList.remove(styles.hidden);
    } else {
      const y = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight;
      el.classList.toggle(styles.solid, y > vh * 0.8);
      lastY.current = y;
    }
  }, [menuOpen]);

  // Syncs the panel's native <dialog> open state with React state — mirrors
  // ConsultationDialog.tsx's effect exactly.
  useEffect(() => {
    const dialog = menuDialogRef.current;
    if (!dialog) return;

    if (menuOpen && !dialog.open) {
      dialog.showModal();
    } else if (!menuOpen && dialog.open) {
      dialog.close();
    }
  }, [menuOpen]);

  // Issue #15 AC6: locks background scroll while the panel is open, applied
  // to <body> only — never to app/[locale]/layout.module.css's `.page`
  // wrapper, which must stay `overflow-x: clip` (not `hidden`) or the
  // pinned Experience band's `position: sticky` silently breaks (docs §5.3).
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Auto-close if a resize crosses back above the collapse breakpoint (e.g.
  // orientation change, or a devtools resize) so the panel can't get stuck
  // open under the desktop layout. Keep NAV_COLLAPSE_BREAKPOINT_PX in sync
  // with Nav.module.css's `@media` value by hand — CSS Modules `:export`
  // isn't reliably supported under Next 16's Turbopack build, so there's no
  // single shared source for this value yet.
  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia(`(min-width: ${NAV_COLLAPSE_BREAKPOINT_PX}px)`);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [menuOpen]);

  function handleMenuDialogClose() {
    // Fires on Esc and the native cancel path too — single source of truth
    // for "the panel just closed", same reasoning as ConsultationDialog.
    setMenuOpen(false);
  }

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

  // Same anchor-scroll behavior as the desktop links, plus closing the
  // panel so a tap doesn't leave it open over the section it just navigated
  // to. The body-scroll-lock unlock effect (above) only runs after this
  // handler returns and React commits the `menuOpen` state change — lifting
  // the `overflow: hidden` here too, synchronously, before scrolling,
  // avoids scrollIntoView() silently no-op'ing against a still-locked page.
  function handleMenuLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    document.body.style.overflow = '';
    handleAnchorClick(event);
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

      {/* Opens the panel. A native modal <dialog> makes every element outside
          it inert while open (HTML spec) — this button would silently stop
          responding to clicks if it also had to double as the close control,
          so closing instead happens via .menuClose (rendered inside the
          dialog, at the same fixed screen position) below. */}
      <button
        type="button"
        className={`${styles.menuToggle}${menuOpen ? ` ${styles.menuToggleHidden}` : ''}`}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        aria-label={t.nav.menuOpen}
        onClick={() => setMenuOpen(true)}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      <dialog
        id="mobile-nav-panel"
        ref={menuDialogRef}
        className={styles.menuDialog}
        aria-label={t.nav.menuLabel}
        onClose={handleMenuDialogClose}
        onCancel={handleMenuDialogClose}
      >
        {/* A sibling of .menuPanel, not a descendant: .menuPanel's slide-down
            entrance animates `transform`, which — even at its resting
            `translateY(0)` — would otherwise become the containing block for
            this button's `position: fixed` and knock it off the fixed
            top:20px/inset-inline-end coordinates it shares with .menuToggle. */}
        <button
          type="button"
          className={styles.menuClose}
          aria-label={t.nav.menuClose}
          onClick={() => setMenuOpen(false)}
        >
          <span className={styles.barX} />
          <span className={styles.barX} />
        </button>
        <div className={styles.menuPanel}>
          <a href="#core" className={styles.menuLink} onClick={handleMenuLinkClick}>
            {t.nav.value}
          </a>
          <a href="#process" className={styles.menuLink} onClick={handleMenuLinkClick}>
            {t.nav.process}
          </a>
          <a href="#approach" className={styles.menuLink} onClick={handleMenuLinkClick}>
            {t.nav.approach}
          </a>
          <a href="#material" className={styles.menuLink} onClick={handleMenuLinkClick}>
            {t.nav.systems}
          </a>
          <a href="#about" className={styles.menuLink} onClick={handleMenuLinkClick}>
            {t.nav.about}
          </a>
          <a href="#consultation" className={styles.menuCta} onClick={handleMenuLinkClick}>
            {t.cta.primary}
          </a>
          <div className={styles.menuLang}>
            <LocaleSwitcher locale={locale} label={t.langLabel} />
          </div>
        </div>
      </dialog>
    </nav>
  );
}
