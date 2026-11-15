import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LOGO_GREY, LOGO_RED } from '@/components/brand/logo-paths';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { site } from '@/data/content';

/* Riferimenti geometrici del logo (coordinate del viewBox 251 x 90, ricavati dal tracciato):
   R 44.4–94.8, G 94.7–146.2, Я 150–200, altezza lettere 0–64, occhielli 12–28,
   ARCHITETTI 67–76, linea rossa 88–90. R e Я sono speculari rispetto all'asse x = 122.2. */
const AXIS = 122.2;
const H_GUIDES = [0, 12, 28, 64, 67.2, 76, 89];
const V_GUIDES = [44.4, 58.9, 80.2, 94.7, 146.2, 150, 164.5, 185.5, 200];

/**
 * HERO 1: "Il disegno per sottrazione".
 * Sul foglio si tracciano le linee di costruzione e l'asse di simmetria da cui nasce la R specchiata;
 * le lettere si chiudono e si riempiono del grigio del logo, ARCHITETTI e la linea rossa si tracciano.
 * Poi le linee ausiliarie si tolgono, una alla volta, finché non resta più niente da togliere.
 */
export function HeroIntro() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // 1 px schermo espresso in unità del viewBox: le linee restano sottili a ogni larghezza
  const [px, setPx] = useState(0.3);
  useLayoutEffect(() => {
    const svg = svgRef.current!;
    const ro = new ResizeObserver(() => setPx(251 / Math.max(svg.getBoundingClientRect().width, 1)));
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);
  const sw = (k: number) => ({ strokeWidth: px * k });

  const parts = useMemo(() => {
    const sub = LOGO_GREY[0].split(/(?=M)/);
    // ordine del tracciato: [G, R, Я, occhiello R, occhiello Я]
    const [G, R, RR, Rc, RRc] = sub;
    const red = LOGO_RED[0].split(/(?=M)/);
    const rule = red.pop()!; // l'ultima è la linea rossa
    return { R: R + Rc, RR: RR + RRc, G, outlines: { R: [R, Rc], RR: [RR, RRc], G: [G] }, letters: red, rule };
  }, []);

  useLayoutEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const strokes = q('.draw');
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      if (prefersReducedMotion()) {
        gsap.set(q('.guide, .axis, .arc, .outline'), { autoAlpha: 0 });
        gsap.set(q('.fill, .letter'), { autoAlpha: 1 });
        gsap.set(q('.rule'), { strokeDashoffset: 0 });
        gsap.set(q('.reveal-line'), { yPercent: 0 });
        gsap.set(q('.fade'), { autoAlpha: 1 });
        return;
      }
      gsap.set(q('.fill, .letter, .fade'), { autoAlpha: 0 });
      gsap.set(q('.reveal-line'), { yPercent: 110 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, delay: 0.25 });
      tl.to(q('.guide-h'), { strokeDashoffset: 0, duration: 1.1, stagger: 0.07 }, 0)
        .to(q('.guide-v'), { strokeDashoffset: 0, duration: 1.0, stagger: 0.05 }, 0.35)
        .to(q('.axis'), { strokeDashoffset: 0, duration: 1.1 }, 0.55)
        .to(q('.circle'), { strokeDashoffset: 0, duration: 1.0 }, 0.8)
        // R e Я si disegnano insieme, come riflesse nello specchio dell'asse
        .to(q('.outline-R'), { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut', stagger: 0.12 }, 1.05)
        .to(q('.outline-RR'), { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut', stagger: 0.12 }, 1.05)
        .to(q('.arc'), { strokeDashoffset: 0, duration: 0.9 }, 1.2)
        .to(q('.outline-G'), { strokeDashoffset: 0, duration: 1.3, ease: 'power1.inOut' }, 1.45)
        .to(q('.fill'), { autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: 'power1.out' }, 2.3)
        .to(q('.outline'), { autoAlpha: 0, duration: 0.8 }, 2.6)
        .to(q('.letter'), { autoAlpha: 1, duration: 0.35, stagger: 0.05, ease: 'none' }, 2.55)
        .to(q('.rule'), { strokeDashoffset: 0, duration: 1.1, ease: 'expo.inOut' }, 2.75)
        // "quando non gli resta più niente da togliere": le linee di costruzione si ritirano
        .to(q('.guide, .circle, .arc'), { strokeDashoffset: -1, duration: 0.9, stagger: { each: 0.035, from: 'random' }, ease: 'power2.in' }, 3.35)
        .to(q('.axis'), { strokeDashoffset: -1, duration: 0.8, ease: 'power2.in' }, 3.9)
        .to(q('.reveal-line'), { yPercent: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out' }, 3.55)
        .to(q('.fade'), { autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'power1.out' }, 4.1);
    }, el);
    return () => ctx.revert();
  }, []);

  const guide = 'guide draw fill-none stroke-[var(--rgr-grey)]';

  return (
    <section ref={root} className="paper-grid relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="RGR Architetti">
      <h1 className="sr-only">RGR Architetti, studio di architettura a Bergamo</h1>

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-28 lg:pt-24">
        <svg
          ref={svgRef}
          viewBox="0 0 251 90"
          overflow="visible"
          className="relative w-[min(86vw,820px)] overflow-visible"
          aria-hidden
        >
          {/* linee di costruzione */}
          {H_GUIDES.map((y) => (
            <path key={'h' + y} className={guide + ' guide-h'} d={`M-1400 ${y}H1650`} pathLength={1} style={sw(0.9)} />
          ))}
          {V_GUIDES.map((x) => (
            <path key={'v' + x} className={guide + ' guide-v'} d={`M${x} -700V800`} pathLength={1} style={sw(0.9)} />
          ))}
          <path className="guide draw circle fill-none stroke-[var(--rgr-grey)]" d="M152.2 31.8a31.8 31.8 0 1 0 -63.6 0a31.8 31.8 0 1 0 63.6 0" pathLength={1} style={sw(0.9)} />
          {/* asse di simmetria (punto e linea) da cui nasce la R specchiata */}
          <path className="axis draw fill-none stroke-[var(--rgr-red)]" d={`M${AXIS} -700V800`} pathLength={1} style={sw(1.4)} />
          <path className="arc draw fill-none stroke-[var(--rgr-red)]" d="M69.6 -6Q122.2 -38 175 -6" pathLength={1} style={sw(1.2)} />
          <path className="arc draw fill-none stroke-[var(--rgr-red)]" d="M171 -9.5L175 -6L169.6 -4.6" pathLength={1} style={sw(1.2)} />

          {/* lettere: contorno che si disegna, poi riempimento grigio */}
          <path className="fill" d={parts.R} fill="var(--rgr-grey)" fillRule="evenodd" />
          <path className="fill" d={parts.G} fill="var(--rgr-grey)" fillRule="evenodd" />
          <path className="fill" d={parts.RR} fill="var(--rgr-grey)" fillRule="evenodd" />
          {(['R', 'RR', 'G'] as const).map((k) =>
            parts.outlines[k].map((d, i) => (
              <path key={k + i} className={`outline outline-${k} draw fill-none stroke-[var(--rgr-ink)]`} d={d} pathLength={1} style={sw(1.1)} />
            )),
          )}
          {parts.letters.map((d, i) => (
            <path key={'l' + i} className="letter" d={d} fill="var(--rgr-red)" />
          ))}
          <path className="rule draw" d="M0 89H251" pathLength={1} stroke="var(--rgr-red)" strokeWidth={2.1} fill="none" />
        </svg>

        <blockquote className="relative mt-[clamp(2.5rem,7vh,5rem)] max-w-3xl text-center">
          <p className="font-display text-[clamp(1.15rem,2.3vw,1.85rem)] font-light leading-snug text-rgr-ink">
            {site.quote.map((l, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="reveal-line block text-balance">{l}</span>
              </span>
            ))}
          </p>
          <footer className="fade label-tech mt-5 !text-primary">{site.quoteAuthor}</footer>
        </blockquote>
      </div>

      {/* cartiglio a margine del foglio */}
      <div className="container-rgr relative flex items-end justify-between pb-6 lg:pb-8">
        <p className="fade label-tech hidden sm:block">Studio di architettura · Bergamo</p>
        <p className="fade label-tech flex items-center gap-3">
          <span>Scorra: dal disegno alla casa</span>
          <span className="relative block h-10 w-px overflow-hidden bg-rgr-grey/40">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-primary" />
          </span>
        </p>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(220%)}}`}</style>
    </section>
  );
}
