// Shared RAF-throttled scroll/resize frame source for Nav + Hero (docs §5.5).
// A single scroll/resize listener pair backs every subscriber so multiple
// scroll-reactive components don't each attach their own — mirrors the
// prototype's single `frame()` loop (support.js) without porting it.
//
// Callers are responsible for checking `prefers-reduced-motion` themselves
// before subscribing (docs §4, §5.5): this module has no opinion on motion
// preference, it just delivers frames RAF-throttled.

export type ScrollFrame = { y: number; vh: number };
type Listener = (frame: ScrollFrame) => void;

const listeners = new Set<Listener>();
let ticking = false;
let started = false;

function currentFrame(): ScrollFrame {
  return { y: window.scrollY || window.pageYOffset || 0, vh: window.innerHeight };
}

function tick() {
  ticking = false;
  const frame = currentFrame();
  listeners.forEach((listener) => listener(frame));
}

function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(tick);
}

function start() {
  if (started) return;
  started = true;
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
}

/**
 * Subscribe to RAF-throttled scroll frames. Fires once synchronously with the
 * current frame so initial (pre-scroll) state is correct, then on every
 * subsequent RAF-throttled scroll/resize. Returns an unsubscribe function.
 */
export function subscribeScrollFrame(listener: Listener): () => void {
  start();
  listeners.add(listener);
  listener(currentFrame());
  return () => {
    listeners.delete(listener);
  };
}
