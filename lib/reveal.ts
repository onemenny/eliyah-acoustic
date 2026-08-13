// Shared IntersectionObserver-driven reveal-on-enter (docs §5.5).
// Mirrors scrollFx.ts's shape (one small primitive, caller owns the effect +
// ref) but is discrete rather than continuous: instead of RAF-throttled
// per-frame writes, each element gets a single `data-revealed="true"` flip
// the first time it crosses the threshold, then is unobserved — consumed by
// each component's CSS Module via a `[data-revealed='true']` selector,
// matching Nav's classList-toggle convention (docs §3.2) rather than Hero's
// per-frame inline-style writes (this is a one-shot state, not a continuous
// scroll-driven value).
//
// Callers are responsible for checking `prefers-reduced-motion` themselves
// before calling `observeReveal` (docs §4, §5.5), same convention as
// scrollFx.ts — this module has no opinion on motion preference.

const REVEAL_OPTIONS: IntersectionObserverInit = {
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.04,
};

/**
 * Observe `el`, staggering its reveal by `index * 90ms` (written as a
 * `--reveal-delay` custom property the CSS Module reads via
 * `transition-delay`), and set `data-revealed="true"` the first time it
 * crosses the reveal threshold. Unobserves after the first reveal — this is
 * a one-shot entrance animation, not a re-triggering one. Returns a cleanup
 * function that disconnects the observer.
 */
export function observeReveal(el: HTMLElement, index = 0): () => void {
  el.style.setProperty('--reveal-delay', `${index * 90}ms`);

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      el.setAttribute('data-revealed', 'true');
      observer.unobserve(el);
    }
  }, REVEAL_OPTIONS);

  observer.observe(el);
  return () => observer.disconnect();
}

/**
 * Convenience for a component with a fixed row of reveal targets (e.g.
 * label/heading/body refs read in one `useEffect`): observes every non-null
 * element at its array index and returns one combined cleanup function.
 */
export function observeRevealGroup(elements: (HTMLElement | null)[]): () => void {
  const cleanups = elements
    .map((el, index) => (el ? observeReveal(el, index) : undefined))
    .filter((fn): fn is () => void => Boolean(fn));

  return () => cleanups.forEach((fn) => fn());
}
