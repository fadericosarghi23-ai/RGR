import { ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { AmbientExplorer } from '@/components/services/AmbientExplorer';
import { ConsultQuiz } from '@/components/services/ConsultQuiz';
import { interactiveIntro, serviceCopy } from '@/components/services/copy';
import { ProcessStepper } from '@/components/services/ProcessStepper';
import { InteractiveFrame, RelatedProjects, ServiceBody, ServiceCta, ServicePager, ServicePhotos } from '@/components/services/ServiceBlocks';
import { SiteTimeline } from '@/components/services/SiteTimeline';
import { SurveyCompare } from '@/components/services/SurveyCompare';
import { serviceProjects } from '@/components/services/utils';
import { ButtonLink } from '@/components/ui/button-link';
import { serviceBySlug, type Service, type ServiceSlug } from '@/data/services';

/** Righe del titolo grande. Il trattino morbido (­) va a capo solo se manca spazio, a 375px. */
const TITLE_LINES: Record<ServiceSlug, string[]> = {
  progettazione: ['Proget­tazione'],
  'ristrutturazione-e-recupero': ['Ristruttu­razione', 'e recupero'],
  'interior-design': ['Interior design', 'e allestimenti'],
  'direzione-lavori': ['Direzione lavori', 'e sicurezza'],
  consulenze: ['Consulenze', 'e perizie'],
};

function Interactive({ service }: { service: Service }) {
  switch (service.slug) {
    case 'progettazione':
      return <ProcessStepper />;
    case 'ristrutturazione-e-recupero':
      return <SurveyCompare projects={serviceProjects(service)} />;
    case 'interior-design':
      return <AmbientExplorer />;
    case 'direzione-lavori':
      return <SiteTimeline />;
    case 'consulenze':
      return <ConsultQuiz slug={service.slug} />;
  }
}

export default function Servizio() {
  const { slug } = useParams();
  const service = serviceBySlug(slug);

  if (!service) {
    return (
      <>
        <Seo title="Servizio non trovato" description={serviceCopy.notFoundText} />
        <PageHeader
          kicker="Servizi"
          title={serviceCopy.notFoundTitle}
          lead={serviceCopy.notFoundText}
          crumbs={[
            { to: '/', label: 'Home' },
            { to: '/servizi', label: 'Servizi' },
          ]}
        >
          <ButtonLink to="/servizi" variant="outline" className="mt-10">
            <ArrowLeft aria-hidden />
            {serviceCopy.notFoundLink}
          </ButtonLink>
        </PageHeader>
      </>
    );
  }

  const related = serviceProjects(service);

  return (
    <>
      <Seo title={service.title} description={service.lead} image={related[0]?.images[0]?.src} />
      <PageHeader
        kicker={serviceCopy.kicker(service.n)}
        title={TITLE_LINES[service.slug]}
        lead={service.lead}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/servizi', label: 'Servizi' },
        ]}
      />
      <ServiceBody service={service} />
      <ServicePhotos projects={related} />
      <InteractiveFrame label={serviceCopy.interactiveLabel} title={service.interactive} intro={interactiveIntro[service.slug]}>
        <Interactive service={service} />
      </InteractiveFrame>
      <RelatedProjects projects={related} />
      <ServicePager service={service} />
      <ServiceCta
        kicker={serviceCopy.ctaKicker}
        title={serviceCopy.ctaTitle}
        text={serviceCopy.ctaText}
        button={serviceCopy.ctaButton}
        to={`/contatti?servizio=${service.slug}`}
      />
    </>
  );
}
