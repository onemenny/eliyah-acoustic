import { Approach } from '@/components/homepage/Approach';
import { CoreValue } from '@/components/homepage/CoreValue';
import { EliyahAcoustic } from '@/components/homepage/EliyahAcoustic';
import { Experience } from '@/components/homepage/Experience';
import { ExperienceBand } from '@/components/homepage/ExperienceBand';
import { Hero } from '@/components/homepage/Hero';
import { Perception } from '@/components/homepage/Perception';
import { ProjectScope } from '@/components/homepage/ProjectScope';
import { StructureOfService } from '@/components/homepage/StructureOfService';
import { Vision } from '@/components/homepage/Vision';
import { Nav } from '@/components/layout/Nav';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

// Homepage — docs §5.4. Nav + Hero (sections 1-2), Vision + Core Value +
// Experience Principle (sections 3-5), Structure of Service + Project Scope
// (sections 6-7), Eliyah Acoustic + Approach (sections 8-9), and Experience +
// Sound & Individual Perception (sections 10-11) land here; the remaining 6
// sections (Material & Form through Footer) are separate Phase 1 issues built
// on top of this same foundation.
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDictionary(locale);

  return (
    <>
      <Nav locale={locale} t={t} />
      <main>
        <Hero t={t} />
        <Vision t={t} />
        <CoreValue t={t} />
        <ExperienceBand t={t} />
        <StructureOfService t={t} />
        <ProjectScope t={t} />
        <EliyahAcoustic t={t} />
        <Approach t={t} />
        <Experience t={t} />
        <Perception t={t} />
        {/* Material & Form, Application, Manifesto, About, Consultation,
            Footer: docs §5.4 items 12-17, later issues. */}
      </main>
    </>
  );
}
