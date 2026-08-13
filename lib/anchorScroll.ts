// Explicit anchor-to-section scrolling (docs §5.4 item 1 / §5.5's "smooth
// scroll to section ids" behaviour).
//
// Native browser fragment navigation — `scroll-behavior: smooth` in
// styles/globals.css, triggered by clicking an `href="#id"` link or loading
// a URL with a hash already set — was found (Reviewer, issue #3) to get
// cancelled mid-flight: the viewport starts moving toward the target then
// settles back near the top, most likely due to a layout reflow (web-font
// swap from `next/font`'s `display:'swap'`, or one of lib/scrollFx.ts's
// RAF-driven listeners) landing while the browser's native smooth-scroll
// animation for that history/fragment entry is still in progress. Driving
// the scroll explicitly via `Element.scrollIntoView()` from a click/mount
// handler sidesteps that: it isn't tied to the fragment-navigation history
// entry the way the cancelled native scroll was, so a later reflow doesn't
// abort it.
//
// This module checks `prefers-reduced-motion` itself (unlike scrollFx.ts /
// lib/reveal.ts, which leave that to their callers) since there's no
// continuous per-frame animation here to gate — just a single scroll call
// per invocation, so it's simplest to decide `behavior` right here.

export function scrollToHash(id: string): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
  target.scrollIntoView({ behavior, block: 'start' });
  return true;
}
