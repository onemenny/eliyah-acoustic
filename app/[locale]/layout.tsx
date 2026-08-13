import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';

import { defaultLocale, dirFor, getDictionary, isLocale, locales, type Locale } from '@/i18n';
import { basePath } from '@/lib/basePath';
import '@/styles/globals.css';
import styles from './layout.module.css';

// Fonts are vendored as .woff2 under assets/fonts/ and loaded with
// next/font/local rather than next/font/google. next/font/google resolves font
// files by fetching CSS from fonts.googleapis.com during the build; a stale
// edge-cached stylesheet there hands back gstatic URLs that 404, which fails
// the build outright on a cold CI checkout (no local font cache to mask it).
// Vendoring removes the build-time network dependency entirely. Files are still
// self-hosted in the output, so there is no runtime request to Google either
// (docs §4 Performance).
//
// Provenance — regenerate from these sources if a family needs updating:
//   fraunces-variable-latin.woff2  Fraunces v38, latin subset, variable
//                                  (opsz 9..144, wght 100..900), from the
//                                  gstatic URL in
//                                  fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,100..900
//   manrope-{300,400,500,600}-latin.woff2       Manrope v20, latin
//   heebo-{200,300,400,500}-hebrew-latin.woff2  Heebo v28, hebrew+latin merged
//                                  (both via gwfh.mranftl.com, which emits one
//                                  file per weight covering all chosen subsets
//                                  — next/font/local has no per-src
//                                  unicode-range, so Heebo's Hebrew and Latin
//                                  coverage has to live in a single file)

// §5.2 requires the `opsz 9..144` axis alongside `wght`, so Fraunces stays a
// variable instance; `font-optical-sizing: auto` (the browser default) drives
// opsz from the computed font-size. The 100..900 `wght` range covers the
// 200/300/400 the design calls for.
const fraunces = localFont({
  src: [{ path: '../../assets/fonts/fraunces-variable-latin.woff2', weight: '100 900', style: 'normal' }],
  display: 'swap',
  variable: '--font-fraunces',
  adjustFontFallback: 'Times New Roman',
});

const manrope = localFont({
  src: [
    { path: '../../assets/fonts/manrope-300-latin.woff2', weight: '300', style: 'normal' },
    { path: '../../assets/fonts/manrope-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/manrope-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../../assets/fonts/manrope-600-latin.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-manrope',
});

const heebo = localFont({
  src: [
    { path: '../../assets/fonts/heebo-200-hebrew-latin.woff2', weight: '200', style: 'normal' },
    { path: '../../assets/fonts/heebo-300-hebrew-latin.woff2', weight: '300', style: 'normal' },
    { path: '../../assets/fonts/heebo-400-hebrew-latin.woff2', weight: '400', style: 'normal' },
    { path: '../../assets/fonts/heebo-500-hebrew-latin.woff2', weight: '500', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-heebo',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onemenny.github.io';

// Static per-locale routes, generated at build time. Deliberately not
// middleware-based detection: middleware does not run under `output: 'export'`
// (docs §3.1, §3.3).
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// The enumerated locales are the only valid params; anything else 404s as a
// static file miss rather than being rendered on demand.
export const dynamicParams = false;

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: t.meta.title,
    description: t.meta.description,
    // Both locales must be independently crawlable/indexable (docs §4 SEO).
    alternates: {
      canonical: `${basePath}/${locale}/`,
      languages: Object.fromEntries(locales.map((l) => [l, `${basePath}/${l}/`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      // data-locale selects the locale-varying token block in tokens.css: font
      // families, --lh, directional gradient angles, eyebrow metrics. It has to
      // sit on <html>, not on the page wrapper inside <body> — custom
      // properties only inherit downward, so a definition below <body> leaves
      // globals.css's `body { font-family: var(--body) }` invalid at
      // computed-value time and body copy falls back to the UA serif.
      data-locale={locale}
      className={`${fraunces.variable} ${manrope.variable} ${heebo.variable}`}
    >
      <body>
        <div className={styles.page}>{children}</div>
      </body>
    </html>
  );
}
