import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Manrope, Heebo } from 'next/font/google';

import { defaultLocale, dirFor, getDictionary, isLocale, locales, type Locale } from '@/i18n';
import { basePath } from '@/lib/basePath';
import '@/styles/globals.css';
import styles from './layout.module.css';

// Self-hosted at build time by next/font — no runtime request to
// fonts.googleapis.com (docs §4 Performance).
// Loaded as a variable font: §5.2 requires the `opsz 9..144` axis alongside
// `wght`, and next/font only exposes extra axes on variable instances. The
// variable `wght` range covers the 200/300/400 the design calls for.
const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-fraunces',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-manrope',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['200', '300', '400', '500'],
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
