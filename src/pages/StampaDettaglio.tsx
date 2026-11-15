import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ZoomIn } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal } from '@/components/motion/Reveal';
import { Lightbox } from '@/components/projects/Lightbox';
import { content } from '@/data/content';
import NotFound from './NotFound';

export default function StampaDettaglio() {
  const { slug } = useParams();
  const p = content.pressPages.find((x) => x.slug === slug);
  const [lb, setLb] = useState<number | null>(null);
  if (!p) return <NotFound />;
  return (
    <>
      <Seo title={`${p.title}, rassegna stampa`} description={p.excerpt.replace(/\.{3}$/, '.')} image={p.cover?.src} />
      <PageHeader
        kicker="Rassegna stampa · su rivista"
        title={[p.title]}
        lead={p.excerpt}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/rassegna-stampa', label: 'Rassegna stampa' },
        ]}
      />
      <section className="pb-24">
        <div className="container-rgr">
          <p className="label-tech">L’articolo, pagina per pagina. Clicchi su una pagina per leggerla ingrandita.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {p.scans.map((s, i) => (
              <Reveal key={s.src} delay={(i % 2) * 0.08} y={40}>
                <button type="button" onClick={() => setLb(i)} className="group crop-marks relative block w-full bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)]" aria-label={`Apri la pagina ${i + 1}`}>
                  <img src={s.src} alt={`${p.title}, pagina ${i + 1} dell’articolo`} loading="lazy" className="w-full" style={{ aspectRatio: `${s.w}/${s.h}` }} />
                  <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center bg-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                    <ZoomIn className="size-4" />
                  </span>
                  <span className="label-tech absolute left-3 top-3 bg-white/90 px-2 py-1 text-xs md:text-[0.6rem]">{String(i + 1).padStart(2, '0')}</span>
                </button>
              </Reveal>
            ))}
          </div>
          <Link to="/rassegna-stampa" className="mt-14 inline-flex items-center gap-3 font-nav text-xs uppercase tracking-[0.18em] hover:text-primary">
            <ArrowLeft className="size-4" /> Tutta la rassegna stampa
          </Link>
        </div>
      </section>
      <Lightbox images={p.scans} index={lb} onChange={setLb} title={p.title} />
    </>
  );
}
