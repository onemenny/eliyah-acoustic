import { About } from '@/components/homepage/About';
import { Application } from '@/components/homepage/Application';
import { Approach } from '@/components/homepage/Approach';
import { CoreValue } from '@/components/homepage/CoreValue';
import { EliyahAcoustic } from '@/components/homepage/EliyahAcoustic';
import { Experience } from '@/components/homepage/Experience';
import { ExperienceBand } from '@/components/homepage/ExperienceBand';
import { Hero } from '@/components/homepage/Hero';
import { Manifesto } from '@/components/homepage/Manifesto';
import { MaterialForm } from '@/components/homepage/MaterialForm';
import { Perception } from '@/components/homepage/Perception';
import { ProjectScope } from '@/components/homepage/ProjectScope';
import { StructureOfService } from '@/components/homepage/StructureOfService';
import { Vision } from '@/components/homepage/Vision';
import { Nav } from '@/components/layout/Nav';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

// Homepage — docs §5.4. Nav + Hero (sections 1-2), Vision + Core Value +
// Experience Principle (sections 3-5), Structure of Service + Project Scope
// (sections 6-7), Eliyah Acoustic + Approach (sections 8-9), Experience +
// Sound & Individual Perception (sections 10-11), Material & Form +
// Application (sections 12-13), and Manifesto + About (sections 14-15) land
// here; Consultation + Footer (sections 16-17) are a separate Phase 1 issue
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
        <Vision t={t} />
        <CoreValue t={t} />
        <ExperienceBand t={t} />
        <StructureOfService t={t} />
        <ProjectScope t={t} />
        <EliyahAcoustic t={t} />
        <Approach t={t} />
        <Experience t={t} />
        <Perception t={t} />
        <MaterialForm t={t} />
        <Application t={t} />
        <Manifesto t={t} />
        <About t={t} />
        {/* Consultation, Footer: docs §5.4 items 16-17, later issue. */}
      </main>
    </>
  );
}
