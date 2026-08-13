import { Hero } from '@/components/homepage/Hero';
import { Nav } from '@/components/layout/Nav';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

// Homepage — docs §5.4. Nav + Hero (sections 1-2) land in this slice; the
// remaining 15 sections (Vision through Footer) are separate Phase 1 issues
// built on top of this same foundation.
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);

  return (
    <>
      <Nav locale={locale} t={t} />
      <main>
        <Hero t={t} />
        {/* Vision, Core Value, Experience Principle, Structure of Service,
            Project Scope, Eliyah Acoustic, Approach, Experience, Sound &
            Individual Perception, Material & Form, Application, Manifesto,
            About, Consultation, Footer: docs §5.4 items 3-17, later issues. */}
      </main>
    </>
  );
}
