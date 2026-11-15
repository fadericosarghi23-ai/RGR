import { motion } from 'framer-motion';
import { Seo } from '@/components/layout/Seo';
import { ButtonLink } from '@/components/ui/button-link';

/** 404: un foglio con il disegno interrotto. */
export default function NotFound() {
  return (
    <section className="paper-grid flex min-h-[100svh] items-center pt-24">
      <Seo title="Pagina non trovata" description="La pagina richiesta non esiste o è stata spostata." />
      <div className="container-rgr grid items-center gap-12 lg:grid-cols-2">
        <svg viewBox="0 0 400 260" className="w-full max-w-lg" aria-hidden>
          {[
            'M20 230H380',
            'M60 230V110L200 30L340 110V230',
            'M60 110H340',
            'M110 230V160H160V230',
            'M230 150H300V200H230Z',
          ].map((d, i) => (
            <motion.path key={d} d={d} fill="none" stroke="var(--rgr-ink)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: i === 1 ? 0.62 : 1 }} transition={{ duration: 1.2, delay: 0.2 + i * 0.2, ease: [0.65, 0, 0.35, 1] }} />
          ))}
          <motion.path d="M200 30V250" stroke="var(--rgr-red)" strokeWidth="1.5" strokeDasharray="10 5 2 5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 1.2 }} />
        </svg>
        <div>
          <p className="label-tech !text-primary">Errore 404</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,5rem)] font-bold uppercase leading-[0.95]">Questo disegno non è mai stato finito</h1>
          <p className="mt-6 max-w-md text-rgr-ink/80">La pagina che cerca non esiste o è stata spostata con il nuovo sito.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink to="/">Torna alla home</ButtonLink>
            <ButtonLink to="/progetti" variant="outline">
              I progetti
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
