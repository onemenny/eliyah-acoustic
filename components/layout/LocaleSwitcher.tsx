'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isLocale, otherLocale, type Locale } from '@/i18n';
import styles from './LocaleSwitcher.module.css';

type Props = {
  locale: Locale;
  /** The dictionary's langLabel — it names the *other* language ("עב" / "EN"). */
  label: string;
};

/**
 * Language toggle (docs §5.4 item 1). A real link to the counterpart locale's
 * route, not a localStorage-backed client toggle: the locale is a URL, so both
 * languages stay independently crawlable (docs §3.3, §4 SEO).
 *
 * Only the button chrome — the full nav is a separate Phase 1 slice.
 */
export function LocaleSwitcher({ locale, label }: Props) {
  const target = otherLocale(locale);
  // usePathname() excludes basePath, and <Link> re-adds it.
  const pathname = usePathname() ?? `/${locale}`;

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  const href = `/${segments.join('/')}/`;

  return (
    <Link href={href} className={styles.button} lang={target} hrefLang={target}>
      {label}
    </Link>
  );
}
