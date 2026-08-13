import type { Dictionary } from '@/i18n';
import styles from './Footer.module.css';

type Props = {
  t: Dictionary;
};

/**
 * Site footer (docs §5.4 item 17): wordmark, contact, credit — the closing
 * strip of the homepage, matching the handoff's `<footer>` (lines 290-299).
 * No reveal-on-enter: the handoff carries no `data-reveal` on this element,
 * same precedent as About.tsx's team row. Email/city are literal in both
 * locales (absent from the handoff's per-locale copy object) — only
 * `footerNote` is translated.
 */
export function Footer({ t }: Props) {
  return (
    <footer className={styles.footer}>
      <div>
        <div className={styles.wordmarkMain}>Eliyah</div>
        <div className={styles.wordmarkSub}>Acoustic</div>
      </div>
      <div className={styles.contact}>
        <div>
          studio@eliyahacoustic.com
          <br />
          Tel Aviv
        </div>
        <div className={styles.credit}>
          {t.footerNote}
          <br />
          © 2026 Eliyah Acoustic
        </div>
      </div>
    </footer>
  );
}
