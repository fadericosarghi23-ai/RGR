import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HeroSheet } from '@/components/hero/HeroSheet';
import { ProjectsRail } from '@/components/home/ProjectsRail';
import { Seo } from '@/components/layout/Seo';
import { Counter } from '@/components/motion/Counter';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, RevealImage } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { TextFill } from '@/components/motion/TextFill';
import { ButtonLink } from '@/components/ui/button-link';
import { categories, content, coverOf, projectBySlug, projects, projectsOf, site, srcSetOf, team } from '@/data/content';
import { services } from '@/data/services';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <>
      <Seo
        title="RGR Architetti | Studio di architettura a Bergamo"
        description="Lo studio RGR nasce nel 2003 dall’incontro di tre architette: progettazione ex-novo, ristrutturazioni, recupero dell’edilizia storica, interior design, direzione lavori e consulenze a Bergamo."
        image={content.home.slides[0].src}
      />
      <HeroSheet />
      <Studio />
      <ServiziAccordion />
      <ProjectsRail />
      <Ambiti />
      <Stampa />
      <Team />
    </>
  );
}

/* ---------------- Lo studio ---------------- */
function Studio() {
  const photo = content.home.studioPhoto;
  const socie = team.filter((t) => t.group === 'socie').length;
  const stats = [
    { n: projects.length, label: 'progetti in archivio' },
    { n: socie, label: 'architette socie', pad: 2 },
    { n: site.services.length, label: 'servizi' },
    { n: categories.length, label: 'ambiti di progetto', pad: 2 },
  ];
  return (
    <section className="relative bg-white py-16 lg:py-24">
      <div className="container-rgr grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label-tech !text-primary">Lo studio</p>
          <p className="mt-6 font-display text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.8] tracking-tighter text-rgr-grey">
            <span className="block text-[0.32em] font-medium uppercase tracking-[0.1em] text-rgr-black">Dal</span>
            <Counter from={1990} to={2003} duration={2.2} />
          </p>
        </div>
        <div className="lg:col-span-8">
          <TextFill text={site.intro} className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.12] tracking-tight text-rgr-black" />
          <Reveal className="mt-10">
            <ButtonLink to="/studio" variant="outline">
              Conosca lo studio
            </ButtonLink>
          </Reveal>
        </div>
      </div>

      <div className="container-rgr mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 self-end lg:col-span-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="border-t border-rgr-ink/15 pt-4">
              <dd className="font-display text-6xl font-bold tabular-nums leading-none text-rgr-black">
                <Counter to={s.n} pad={s.pad} />
              </dd>
              <dt className="label-tech mt-3">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
        {photo && (
          <RevealImage className="lg:col-span-7">
            <ParallaxImage src={photo.src} srcSet={srcSetOf(photo)} sizes="(min-width: 1024px) 55vw, 100vw" alt="Lo studio RGR Architetti in Via Teodoro Frizzoni a Bergamo" className="aspect-[16/10]" width={photo.w} height={photo.h} />
          </RevealImage>
        )}
      </div>
    </section>
  );
}

/* ---------------- Servizi: fisarmonica orizzontale ---------------- */
function ServiziAccordion() {
  const [active, setActive] = useState(0);
  return (
    <section className="paper-grid border-y border-border py-16 lg:py-20">
      <div className="container-rgr">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="label-tech !text-primary">Servizi</p>
            <SplitTitle lines={['Cinque aree,', 'un solo metodo']} className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] font-bold uppercase" />
          </div>
          <Reveal>
            <p className="max-w-md text-rgr-ink/80">Le dieci attività dello studio, dalla progettazione ex-novo alla consulenza tecnica per il Tribunale, raccolte per area.</p>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-3 lg:h-[460px] lg:flex-row">
          {services.map((s, i) => {
            const p = projectBySlug(s.photoProjects[0]);
            const img = p ? coverOf(p) : null;
            const on = active === i;
            return (
              <motion.div
                key={s.slug}
                layout
                transition={{ duration: 0.8, ease: EASE_EXPO }}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn('group relative overflow-hidden bg-rgr-black text-white max-lg:min-h-[150px]', on ? 'lg:flex-[3.2]' : 'lg:flex-1')}
              >
                {img && (
                  <img
                    src={img.thumb ?? img.src}
                    alt=""
                    loading="lazy"
                    className={cn('absolute inset-0 h-full w-full object-cover transition-all duration-[1.2s]', on ? 'scale-100 opacity-70' : 'scale-110 opacity-35 grayscale')}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                <Link to={`/servizi/${s.slug}`} className="relative flex h-full flex-col justify-between p-6 lg:p-8">
                  <span className="flex items-center justify-between">
                    <span className="font-nav text-sm text-primary">{s.n}</span>
                    <ArrowUpRight className={cn('size-6 transition-all duration-500', on ? 'opacity-100' : 'opacity-0')} />
                  </span>
                  <span className="mt-8 block lg:mt-0">
                    <span className={cn('block font-display font-bold uppercase leading-[0.95] transition-all duration-700', on ? 'text-[clamp(1.8rem,2.6vw,2.6rem)]' : 'text-xl lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-2xl')}>
                      {s.title}
                    </span>
                    <span className={cn('mt-4 block max-w-md text-sm text-white/85 transition-all duration-700', on ? 'opacity-100' : 'lg:hidden')}>
                      {s.items.join(' · ')}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Ambiti (categorie) ---------------- */
function Ambiti() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-rgr">
        <p className="label-tech !text-primary">Ambiti</p>
        <SplitTitle lines={['Quattro scale', 'di progetto']} className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] font-bold uppercase" />
        <div className="mt-10 grid grid-cols-1 border-l border-t border-border sm:grid-cols-2">
          {categories.map((c, i) => {
            const list = projectsOf(c.slug);
            const img = c.header ?? (list[0] ? coverOf(list[0]) : null);
            return (
              <Reveal key={c.slug} delay={(i % 2) * 0.08} y={50} className="min-w-0 border-b border-r border-border bg-white">
                <Link to={`/progetti/${c.slug}`} className="group relative block overflow-hidden p-5 lg:p-7">
                  <div className="relative aspect-[16/9] overflow-hidden bg-rgr-paper-2">
                    {img && (
                      <img src={img.src} srcSet={srcSetOf(img)} sizes="(min-width: 640px) 45vw, 100vw" alt={`Progetti ${c.title}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <h3 className="min-w-0 break-words font-display text-[clamp(1.8rem,3vw,2.8rem)] font-bold uppercase text-rgr-black transition-colors group-hover:text-primary">{c.title}</h3>
                    <span className="flex items-center gap-3 font-nav text-sm text-rgr-ink/70">
                      <Counter to={list.length} pad={2} /> progetti
                      <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Dicono di noi ---------------- */
function Stampa() {
  return (
    <section className="bg-rgr-paper-2 py-16 lg:py-24">
      <div className="container-rgr">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="label-tech !text-primary">Rassegna stampa</p>
            <SplitTitle lines={['Dicono di noi']} className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] font-bold uppercase" />
          </div>
          <ButtonLink to="/rassegna-stampa" variant="outline">
            Tutta la rassegna
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-8 max-md:-mx-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:scroll-px-4 max-md:px-4 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          {content.press.map((p, i) => (
            <Reveal key={p.url} delay={i * 0.1} className="max-md:w-[80vw] max-md:shrink-0 max-md:snap-start">
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="group block h-full bg-white">
                {p.image && (
                  <div className="aspect-[3/2] overflow-hidden">
                    <img src={p.image.src} alt={p.title} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" />
                  </div>
                )}
                <div className="p-6">
                  <p className="label-tech !text-primary">{p.source}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-rgr-black">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-rgr-ink/80">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-nav text-xs uppercase tracking-[0.18em] text-rgr-black group-hover:text-primary">
                    Leggi l’articolo <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-8">
          {content.pressPages.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <Link to={`/rassegna-stampa/${p.slug}`} className="group grid grid-cols-[120px_1fr] items-center gap-6 bg-white p-4 sm:grid-cols-[160px_1fr]">
                {p.cover && <img src={p.cover.src} alt={p.title} loading="lazy" className="aspect-[3/4] w-full object-cover" />}
                <div>
                  <p className="label-tech">Su rivista</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-rgr-black group-hover:text-primary">{p.title}</h3>
                  <p className="mt-2 text-sm text-rgr-ink/80">{p.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Le architette ---------------- */
function Team() {
  const socie = team.filter((t) => t.group === 'socie');
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-rgr">
        <p className="label-tech !text-primary">Le architette</p>
        <SplitTitle lines={['Tre sguardi,', 'uno studio']} className="mt-4 text-[clamp(2.4rem,5.5vw,5rem)] font-bold uppercase" />
        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-10 max-md:-mx-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:scroll-px-4 max-md:px-4 max-md:pb-2 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
          {socie.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.12} y={60} className="max-md:w-[72vw] max-md:shrink-0 max-md:snap-start">
              <Link to={`/studio#${p.slug}`} className="group block">
                <div className="crop-marks aspect-[4/5]">
                  <div className="h-full overflow-hidden bg-rgr-paper-2">
                    {p.photo && (
                      <img src={p.photo.src} alt={`Arch. ${p.name}`} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:scale-[1.04] group-hover:grayscale-0" />
                    )}
                  </div>
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold uppercase text-rgr-black group-hover:text-primary">{p.name}</h3>
                <p className="mt-3 line-clamp-3 text-sm italic leading-relaxed text-rgr-ink/75">“{p.quote}”</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
