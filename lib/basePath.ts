// Single source of truth for the GitHub Pages project-page prefix. The deploy
// workflow sets NEXT_PUBLIC_BASE_PATH=/eliyah-acoustic only at build time;
// local dev and any other environment leave it unset (docs §3.1). next.config.js
// reads the same env var for `basePath`/`assetPrefix`, so Next.js's own runtime
// (`_next/static/*`, <Link>/router navigation) gets the prefix automatically —
// but string-literal `next/image` src values pointing at `public/` assets do
// not, so any such reference must go through assetPath() below.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(path: string): string {
  return `${basePath}${path}`;
}
