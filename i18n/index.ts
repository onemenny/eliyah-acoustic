import en from './en.json';
import he from './he.json';

export const locales = ['en', 'he'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export type Dictionary = typeof en;

// Static imports, resolved at build time. Nothing here may become a fetch or a
// dynamically-pathed import(): both break under `output: 'export'` (docs §3.1).
// Typing the map as Record<Locale, Dictionary> also makes a key missing from
// he.json a compile error rather than a runtime `undefined`.
const dictionaries: Record<Locale, Dictionary> = { en, he };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function isRtl(locale: Locale): boolean {
  return locale === 'he';
}

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return isRtl(locale) ? 'rtl' : 'ltr';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'he' : 'en';
}
