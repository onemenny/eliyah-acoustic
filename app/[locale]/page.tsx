import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';
import styles from './page.module.css';

// SCAFFOLD STUB — throwaway. Exists only to prove the foundation in both
// locales: lang/dir on <html>, the font-family swap, --lh, the eyebrow token
// pair, and the locale switcher round-trip. The real homepage is the 17
// sections of docs §5.4, built in later slices.
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);

  return (
    <main className={styles.main}>
      <header className={styles.bar}>
        <nav className={styles.nav}>
          <span>{t.nav.value}</span>
          <span>{t.nav.process}</span>
          <span>{t.nav.approach}</span>
          <span>{t.nav.systems}</span>
          <span>{t.nav.about}</span>
        </nav>
        <LocaleSwitcher locale={locale} label={t.langLabel} />
      </header>

      <p className={styles.eyebrow}>{t.visionLabel}</p>
      <h1 className={styles.head}>{t.visionHead}</h1>
      <p className={styles.body}>{t.visionBody}</p>
      <p className={styles.tagline}>{t.tagline}</p>
    </main>
  );
}
