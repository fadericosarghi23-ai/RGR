import { useLayoutEffect, useRef, useState } from 'react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ButtonLink } from '@/components/ui/button-link';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { projects } from '@/data/content';
import { gsap, prefersReducedMotion } from '@/lib/motion';

const featured = [...projects].sort((a, b) => b.year - a.year).filter((p) => p.images.length >= 4).slice(0, 6);

function Intro({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="label-tech !text-primary">Progetti recenti</p>
      <SplitTitle lines={['Dal foglio', 'al cantiere']} className="mt-4 text-[clamp(2.4rem,5vw,4.5rem)] font-bold uppercase" />
      <p className="mt-6 max-w-sm text-rgr-ink/80">Una selezione dall’archivio dello studio: case, interni, spazi commerciali e industriali.</p>
      <ButtonLink to="/progetti" variant="outline" className="mt-8 self-start">
        Tutti i progetti
      </ButtonLink>
    </div>
  );
}

/**
 * Progetti recenti su un binario orizzontale.
 * Desktop: la sezione si ferma e il binario scorre in orizzontale mentre si scende.
 * Mobile: introduzione sopra e card da scorrere col dito, con indicatore di avanzamento.
 */
export function ProjectsRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      if (prefersReducedMotion()) return;
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 64;
      gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: () => '+=' + dist() * 0.6, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
      });
    });
    return () => mm.revert();
  }, []);

  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const max = t.scrollWidth - t.clientWidth;
    setProgress(max > 0 ? t.scrollLeft / max : 0);
  };

  return (
    <section ref={section} className="relative overflow-hidden bg-white py-14 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <Intro className="container-rgr mb-8 flex flex-col lg:hidden" />
      <div
        ref={track}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] max-lg:snap-x max-lg:snap-mandatory sm:gap-6 sm:scroll-px-8 sm:px-8 lg:w-max lg:gap-12 lg:overflow-visible lg:pb-0 lg:pl-16 lg:pr-24 [&::-webkit-scrollbar]:hidden"
      >
        <Intro className="hidden w-[400px] shrink-0 flex-col justify-center lg:flex" />
        {featured.map((p) => (
          <div key={p.slug} className="w-[78vw] max-w-[360px] shrink-0 snap-start lg:w-[min(30vw,420px)] lg:max-w-none">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
      {/* indicatore di scorrimento (solo mobile) */}
      <div className="container-rgr mt-8 flex items-center gap-4 lg:hidden" aria-hidden>
        <span className="relative h-px flex-1 bg-border">
          <span className="absolute inset-y-0 left-0 h-[2px] -translate-y-[0.5px] bg-primary transition-[width] duration-200" style={{ width: `${Math.max(progress, 0.08) * 100}%` }} />
        </span>
        <span className="label-tech">Scorra</span>
      </div>
    </section>
  );
}
