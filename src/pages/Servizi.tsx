import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { indexCopy } from '@/components/services/copy';
import { SectionHead, ServiceCta } from '@/components/services/ServiceBlocks';
import { ServiceRows } from '@/components/services/ServiceRows';
import { site } from '@/data/content';
import { services } from '@/data/services';
import { EASE_EXPO } from '@/lib/motion';

/** numero d'ordine della voce nell'elenco originale del sito */
const voiceNumber = (v: string) => String(site.services.findIndex((s) => s.toLowerCase() === v.toLowerCase()) + 1).padStart(2, '0');

export default function Servizi() {
  return (
    <>
      <Seo title={indexCopy.seoTitle} description={indexCopy.seoDescription} />
      <PageHeader kicker={indexCopy.kicker} title={indexCopy.title} lead={indexCopy.lead} crumbs={[{ to: '/', label: 'Home' }]} />

      <section className="container-rgr py-20 lg:py-28">
        <ServiceRows />
      </section>

      {/* le dieci voci originali, raggruppate per area */}
      <section className="border-t border-border bg-rgr-paper-2 py-20 lg:py-28">
        <div className="container-rgr">
          <SectionHead label={indexCopy.kicker} title={indexCopy.voicesTitle} intro={indexCopy.voicesIntro} />
          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 1, ease: EASE_EXPO, delay: i * 0.07 }}
                className="border-t border-rgr-black/80 pt-5"
              >
                <Link to={`/servizi/${s.slug}`} className="group inline-flex min-h-[44px] items-start gap-3">
                  <span className="pt-1 font-nav text-xs tracking-[0.2em] text-primary">{s.n}</span>
                  <h3 className="link-draw text-lg font-bold uppercase leading-tight transition-colors duration-300 group-hover:text-primary">{s.title}</h3>
                </Link>
                <ul className="mt-4">
                  {s.items.map((v) => (
                    <li key={v} className="flex gap-3 border-b border-rgr-grey/40 py-3 leading-snug">
                      <span className="font-nav text-xs md:text-[0.7rem] tracking-[0.15em] text-muted-foreground">{voiceNumber(v)}</span>
                      <span className="text-rgr-ink">{v}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCta kicker={indexCopy.ctaKicker} title={indexCopy.ctaTitle} text={indexCopy.ctaText} button={indexCopy.ctaButton} to="/contatti" />
    </>
  );
}
