import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { Seo } from '@/components/layout/Seo';
import { Reveal, RevealImage } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { Lightbox } from '@/components/projects/Lightbox';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ButtonLink } from '@/components/ui/button-link';
import { categoryBySlug, coverOf, projectBySlug, projectsOf, projectUrl, srcSetOf } from '@/data/content';
import { EASE_EXPO } from '@/lib/motion';
import NotFound from './NotFound';

export default function Progetto() {
  const { categoria, slug } = useParams();
  const p = projectBySlug(slug);
  const [lb, setLb] = useState<number | null>(null);
  if (!p || p.category !== categoria) return <NotFound />;
  const cat = categoryBySlug(p.category)!;
  const siblings = projectsOf(p.category);
  const idx = siblings.findIndex((x) => x.slug === p.slug);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];
  const related = siblings.filter((x) => x.slug !== p.slug).slice(Math.max(0, idx - 1), Math.max(0, idx - 1) + 3);
  const hero = coverOf(p);
  const rest = p.images.slice(1);

  return (
    <>
      <Seo title={`${p.title} (${p.year})`} description={`${p.title}, ${p.year}: progetto ${cat.title.toLowerCase()} di RGR Architetti, studio di architettura a Bergamo. Galleria fotografica.`} image={hero?.src} />

      <header className="paper-grid relative pb-12 pt-[130px] lg:pb-16 lg:pt-[170px]">
        <div className="container-rgr">
          <motion.nav aria-label="Percorso" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <ol className="label-tech flex flex-wrap gap-x-2 items-center">
              <li className="after:ml-2 after:content-['/']">
                <Link to="/progetti" className="inline-block py-2.5 hover:text-primary">
                  Progetti
                </Link>
              </li>
              <li>
                <Link to={`/progetti/${cat.slug}`} className="inline-block py-2.5 hover:text-primary">
                  {cat.title}
                </Link>
              </li>
            </ol>
          </motion.nav>
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-9">
              <motion.p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-light text-primary" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.2 }}>
                {p.year}
              </motion.p>
              <SplitTitle as="h1" lines={[p.title]} inView={false} delay={0.3} className="mt-2 text-[clamp(2.2rem,6vw,5.5rem)] font-bold uppercase leading-[0.95]" />
            </div>
            <motion.dl className="grid grid-cols-3 gap-4 border-t border-rgr-ink pt-4 lg:col-span-3 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <div>
                <dt className="label-tech text-xs md:text-[0.6rem]">Ambito</dt>
                <dd className="font-nav text-sm uppercase">{cat.title}</dd>
              </div>
              <div>
                <dt className="label-tech text-xs md:text-[0.6rem]">Anno</dt>
                <dd className="font-nav text-sm">{p.year}</dd>
              </div>
              <div>
                <dt className="label-tech text-xs md:text-[0.6rem]">Foto</dt>
                <dd className="font-nav text-sm">{String(p.images.length).padStart(2, '0')}</dd>
              </div>
            </motion.dl>
          </div>
          {p.description && <p className="mt-10 max-w-3xl whitespace-pre-line text-lg leading-relaxed">{p.description}</p>}
        </div>
      </header>

      {hero && (
        <div className="container-rgr">
          <RevealImage>
            <button type="button" onClick={() => setLb(0)} className="group relative block w-full overflow-hidden bg-rgr-paper-2" aria-label="Apri la galleria a schermo intero">
              <img src={hero.src} srcSet={srcSetOf(hero)} sizes="(min-width: 1440px) 1312px, 100vw" alt={`${p.title}, foto 1`} className="max-h-[82svh] w-full object-cover transition-transform duration-[1.4s] group-hover:scale-[1.02]" style={{ aspectRatio: `${hero.w}/${hero.h}` }} fetchPriority="high" />
              <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-white/90 text-rgr-black opacity-0 transition-opacity group-hover:opacity-100">
                <Expand className="size-4" />
              </span>
            </button>
          </RevealImage>
        </div>
      )}

      {rest.length > 0 && (
        <section className="py-10 lg:py-14" aria-label="Galleria">
          <div className="container-rgr columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {rest.map((im, i) => (
              <Reveal key={im.src} delay={(i % 3) * 0.08} y={40} className="break-inside-avoid">
                <button type="button" onClick={() => setLb(i + 1)} className="group crop-marks relative block w-full" aria-label={`Apri la foto ${i + 2}`}>
                  <span className="block overflow-hidden bg-rgr-paper-2">
                    <img src={im.thumb ?? im.src} alt={`${p.title}, foto ${i + 2}`} loading="lazy" decoding="async" className="w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" style={{ aspectRatio: `${im.w}/${im.h}` }} />
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Altri progetti" className="border-y border-border">
        <div className="container-rgr grid sm:grid-cols-2">
          <Link to={projectUrl(prev)} className="group flex items-center gap-5 py-10 pr-6 sm:border-r sm:border-border">
            <ArrowLeft className="size-6 shrink-0 transition-transform group-hover:-translate-x-2" />
            <span>
              <span className="label-tech block">Precedente · {prev.year}</span>
              <span className="mt-1 block font-display text-xl font-bold uppercase text-rgr-black group-hover:text-primary">{prev.title}</span>
            </span>
          </Link>
          <Link to={projectUrl(next)} className="group flex items-center justify-end gap-5 py-10 text-right sm:pl-6">
            <span>
              <span className="label-tech block">Successivo · {next.year}</span>
              <span className="mt-1 block font-display text-xl font-bold uppercase text-rgr-black group-hover:text-primary">{next.title}</span>
            </span>
            <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </nav>

      {related.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-rgr">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase">Altri progetti {cat.title.toLowerCase()}</h2>
              <ButtonLink to={`/progetti/${cat.slug}`} variant="outline" className="max-sm:hidden">
                Tutti
              </ButtonLink>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              {related.map((r, i) => (
                <Reveal key={r.slug} delay={i * 0.08}>
                  <ProjectCard project={r} showCategory={false} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox images={p.images} index={lb} onChange={setLb} title={p.title} />
    </>
  );
}
