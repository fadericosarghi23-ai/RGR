import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { HeroIntro } from '@/components/hero/HeroIntro';
import { Seo } from '@/components/layout/Seo';
import { Counter } from '@/components/motion/Counter';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, RevealImage } from '@/components/motion/Reveal';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { ButtonLink } from '@/components/ui/button-link';
import { content, site, srcSetOf, team, type Person } from '@/data/content';
import { lenisStore } from '@/lib/motion';
import { cn } from '@/lib/utils';

export default function Studio() {
  const socie = team.filter((t) => t.group === 'socie');
  const collab = team.filter((t) => t.group !== 'socie');
  const loc = useLocation();

  // ancore dalla home (/studio#barbara-radici)
  useEffect(() => {
    if (!loc.hash) return;
    const t = setTimeout(() => {
      const el = document.querySelector(loc.hash);
      if (el) lenisStore.current ? lenisStore.current.scrollTo(el as HTMLElement, { offset: -100 }) : el.scrollIntoView();
    }, 900);
    return () => clearTimeout(t);
  }, [loc.hash]);

  return (
    <>
      <Seo title="Lo studio" description="RGR Architetti: Barbara Radici, Raffaella Guazzoni e Cristina Rovetta, architette laureate al Politecnico di Milano. Lo studio nasce a Bergamo nel 2003." />
      {/* apertura: il logo che si disegna per sottrazione, con la frase guida dello studio */}
      <HeroIntro title="Lo studio RGR Architetti" label="Chi siamo · Lo studio" cue="Scorra: le architette" />

      <section className="pb-14 pt-4 lg:pb-20">
        <div className="container-rgr grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label-tech !text-primary">Chi siamo</p>
            <SplitTitle lines={['Lo studio']} className="mt-4 text-[clamp(2.6rem,6vw,5.5rem)] font-bold uppercase" />
          </div>
          <Reveal className="lg:col-span-8 lg:pt-10">
            <p className="font-display text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium leading-snug text-rgr-black">{site.intro}</p>
          </Reveal>
        </div>
      </section>

      {content.home.studioPhoto && (
        <div className="container-rgr">
          <RevealImage>
            <ParallaxImage src={content.home.studioPhoto.src} srcSet={srcSetOf(content.home.studioPhoto)} alt="Lo studio RGR Architetti a Bergamo" className="aspect-[21/9] max-sm:aspect-[4/3]" strength={12} eager />
          </RevealImage>
        </div>
      )}

      <section className="py-24 lg:py-32">
        <div className="container-rgr">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="label-tech !text-primary">Incontra il team</p>
              <SplitTitle lines={['Le architette']} className="mt-4 text-[clamp(2.4rem,6vw,5.5rem)] font-bold uppercase" />
            </div>
            <Reveal className="flex gap-12">
              <div>
                <p className="font-display text-5xl font-bold text-rgr-black">
                  <Counter to={2003} from={1990} />
                </p>
                <p className="label-tech mt-2">Fondazione</p>
              </div>
              <div>
                <p className="font-display text-5xl font-bold text-rgr-black">
                  <Counter to={socie.length} pad={2} />
                </p>
                <p className="label-tech mt-2">Socie</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-20 space-y-28 lg:space-y-40">
            {socie.map((p, i) => (
              <PersonRow key={p.slug} person={p} flip={i % 2 === 1} index={i} />
            ))}
          </div>
        </div>
      </section>

      {collab.length > 0 && (
        <section className="paper-grid border-t border-border py-24 lg:py-32">
          <div className="container-rgr">
            <p className="label-tech !text-primary">Collaboratori</p>
            <div className="mt-10 grid gap-16">
              {collab.map((p) => (
                <article key={p.slug} id={p.slug} className="grid gap-8 lg:grid-cols-12">
                  <Reveal className="lg:col-span-5">
                    <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase leading-none text-rgr-black">{p.name}</h3>
                  </Reveal>
                  <Reveal delay={0.1} className="space-y-6 lg:col-span-7">
                    <p className="text-lg leading-relaxed text-rgr-ink/85">{p.bio}</p>
                    {p.quote && <blockquote className="border-l-2 border-primary pl-6 font-display text-xl font-light italic leading-snug text-rgr-black">“{p.quote}”</blockquote>}
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-rgr-black py-16 text-white lg:py-20">
        <div className="container-rgr flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <Reveal>
            <p className="label-tech !text-primary">Lo studio</p>
            <p className="mt-3 font-display text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-tight">
              {site.address.street}, {site.address.city}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <ButtonLink to="/progetti" variant="light">
              Guardi i progetti
            </ButtonLink>
            <ButtonLink to="/contatti">Contatti</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function PersonRow({ person, flip, index }: { person: Person; flip: boolean; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <article ref={ref} id={person.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className={cn('relative lg:col-span-5', flip && 'lg:order-2 lg:col-start-8')}>
        <span aria-hidden className="pointer-events-none absolute -top-10 font-display text-[9rem] font-extrabold leading-none text-rgr-paper-2 max-lg:hidden" style={{ [flip ? 'right' : 'left']: '-2.5rem' }}>
          0{index + 1}
        </span>
        <RevealImage className="relative">
          <div className="aspect-[4/5] overflow-hidden bg-rgr-paper-2">
            {person.photo && <img src={person.photo.src} alt={`Arch. ${person.name}`} loading="lazy" className="h-full w-full object-cover" />}
          </div>
        </RevealImage>
      </div>
      <motion.div style={{ y }} className={cn('lg:col-span-6', flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7')}>
        <p className="label-tech !text-primary">Architetta · Socia</p>
        <SplitTitle lines={person.name.split(' ')} as="h3" className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-bold uppercase" />
        <Reveal delay={0.15}>
          <p className="mt-8 text-lg leading-relaxed text-rgr-ink/85">{person.bio}</p>
        </Reveal>
        {person.quote && (
          <Reveal delay={0.25}>
            <blockquote className="mt-10 border-l-2 border-primary pl-6 font-display text-[clamp(1.2rem,1.8vw,1.6rem)] font-light italic leading-snug text-rgr-black">“{person.quote}”</blockquote>
          </Reveal>
        )}
      </motion.div>
    </article>
  );
}
