import { About } from '@/components/homepage/About';
import { Application } from '@/components/homepage/Application';
import { Approach } from '@/components/homepage/Approach';
import { Consultation } from '@/components/homepage/Consultation';
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
import { Footer } from '@/components/layout/Footer';
import { Nav } from '@/components/layout/Nav';
import { defaultLocale, getDictionary, isLocale, type Locale } from '@/i18n';

// Homepage — docs §5.4, all 17 sections: Nav + Hero (1-2), Vision + Core
// Value + Experience Principle (3-5), Structure of Service + Project Scope
// (6-7), Eliyah Acoustic + Approach (8-9), Experience + Sound & Individual
// Perception (10-11), Material & Form + Application (12-13), Manifesto +
// About (14-15), and Consultation + Footer (16-17).
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
        <Consultation t={t} locale={locale} />
      </main>
      <Footer t={t} />
    </>
  );
}
