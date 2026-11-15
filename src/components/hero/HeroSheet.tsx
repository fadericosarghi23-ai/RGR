import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { buildElevation, ELEV_H, ELEV_W } from './elevation';
import { Logo } from '@/components/brand/Logo';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { content } from '@/data/content';
import { cn } from '@/lib/utils';

const RATIO = ELEV_W / ELEV_H;

type Box = { w: number; h: number; x: number; y: number; contain: boolean };

/**
 * HERO della home: la tavola.
 * All'apertura il prospetto della Casa di montagna in Valseriana (ricalcato sulla foto reale)
 * si disegna da solo: terra, struttura, falde, aperture, retini, contesto, quote.
 * Allo scroll la linea rossa del logo diventa la scansione che trasforma il disegno nella foto.
 */
export function HeroSheet() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const elev = useMemo(() => buildElevation(), []);
  const photo = content.home.slides[0];
  const [box, setBox] = useState<Box>({ w: 1320, h: 700, x: 0, y: 0, contain: false });
  const reduced = typeof window !== 'undefined' && prefersReducedMotion();

  // dimensiona la tavola: "cover" su schermi larghi, "contain" su schermi stretti (mobile)
  useLayoutEffect(() => {
    const el = stage.current!;
    const fit = () => {
      const { width: W, height: H } = el.getBoundingClientRect();
      const contain = W / H < 1.25;
      if (!contain) {
        const w = Math.max(W, H * RATIO);
        const h = w / RATIO;
        setBox({ w, h, x: (W - w) / 2, y: (H - h) / 2, contain });
        return;
      }
      // schermi stretti: la tavola si allarga del 35% e resta centrata sulla casa (x circa 54% del disegno)
      const w = Math.min(W * 1.35, H * 0.6 * RATIO);
      const h = w / RATIO;
      const x = Math.min(0, Math.max(W - w, W / 2 - w * 0.545));
      setBox({ w, h, x, y: Math.max((H - h) / 2 + 30, 0), contain });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const el = section.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const all = q('.ln');
      if (reduced) {
        gsap.set(all, { strokeDasharray: 'none' });
        gsap.set(q('.photo'), { clipPath: 'inset(0 0% 0 0)' });
        gsap.set(q('.drawing'), { clipPath: 'inset(0 0 0 100%)' });
        gsap.set(q('.end, .end-bg'), { autoAlpha: 1, y: 0 });
        gsap.set(q('.scan, .start, .cue'), { autoAlpha: 0 });
        return;
      }
      gsap.set(all, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q('.photo'), { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(q('.scan'), { left: '0%', autoAlpha: 0 });
      gsap.set(q('.end'), { autoAlpha: 0, y: 24 });
      gsap.set(q('.end-bg, .cue'), { autoAlpha: 0 });
      gsap.set(q('.sheet-in'), { autoAlpha: 0, y: 12 });
      gsap.set(q('.start'), { autoAlpha: 0, y: 18 });

      const W = { p: 0 };
      const apply = () => {
        const p = W.p;
        (q('.photo')[0] as HTMLElement).style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        (q('.drawing')[0] as HTMLElement).style.clipPath = `inset(0 0 0 ${p}%)`;
        (q('.scan')[0] as HTMLElement).style.left = `${p}%`;
      };

      // 1. all'apertura il prospetto si disegna da solo (circa 3,5 secondi)
      const draw = gsap.timeline({ defaults: { ease: 'power2.inOut' }, delay: 0.35 });
      draw
        .to(q('.frame'), { strokeDashoffset: 0, duration: 0.9 }, 0)
        .to(q('.start'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 0.2)
        .to(q('.sheet-in'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' }, 0.4)
        .to(q('.g-ground .ln')[0], { strokeDashoffset: 0, duration: 0.7 }, 0.3)
        .to(q('.g-ground .ln').slice(1), { strokeDashoffset: 0, duration: 0.25, stagger: 0.004 }, 0.6)
        .to(q('.g-struct .ln'), { strokeDashoffset: 0, duration: 0.7, stagger: 0.05 }, 0.7)
        .to(q('.g-roofs .ln'), { strokeDashoffset: 0, duration: 0.8, stagger: 0.06 }, 1.1)
        .to(q('.g-openings .ln'), { strokeDashoffset: 0, duration: 0.45, stagger: 0.025 }, 1.6)
        .to(q('.g-hatch .ln'), { strokeDashoffset: 0, duration: 0.35, stagger: 0.005, ease: 'power1.out' }, 2.0)
        .to(q('.g-ctx .ln'), { strokeDashoffset: 0, duration: 0.9, stagger: 0.04 }, 2.2)
        .to(q('.g-dims .ln'), { strokeDashoffset: 0, duration: 0.4, stagger: 0.015 }, 2.7)
        .to(q('.cue'), { autoAlpha: 1, duration: 0.6 }, 3.0);

      // 2. allo scroll la linea rossa trasforma il disegno nella foto
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          // se si scorre prima che il disegno sia finito, lo si completa in fretta
          onUpdate: (st) => {
            if (st.progress > 0.01 && draw.progress() < 1) draw.timeScale(5);
          },
        },
      });
      tl.to(q('.start, .cue'), { autoAlpha: 0, y: -16, duration: 0.35 }, 0)
        .to(q('.scan'), { autoAlpha: 1, duration: 0.1 }, 0.05)
        .to(W, { p: 100, duration: 1.8, ease: 'power1.inOut', onUpdate: apply }, 0.1)
        .to(q('.scan'), { autoAlpha: 0, duration: 0.15 }, 1.9)
        .to(q('.end-bg'), { autoAlpha: 1, duration: 0.5 }, 1.6)
        .to(q('.end'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.75)
        .to({}, { duration: 0.2 });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const unit = ELEV_W / box.w; // 1 px schermo in unità del disegno
  const groups: { key: keyof typeof elev; stroke: string; w: number }[] = [
    { key: 'ctx', stroke: 'var(--rgr-grey)', w: 1 },
    { key: 'ground', stroke: 'var(--rgr-ink)', w: 1.1 },
    { key: 'hatch', stroke: '#8a8d8f', w: 0.7 },
    { key: 'struct', stroke: 'var(--rgr-ink)', w: 1.4 },
    { key: 'roofs', stroke: 'var(--rgr-ink)', w: 1.5 },
    { key: 'openings', stroke: 'var(--rgr-ink)', w: 1.1 },
    { key: 'dims', stroke: 'var(--rgr-red)', w: 1 },
  ];

  return (
    <section ref={section} className={cn('relative bg-white', reduced ? '' : 'h-[175vh] lg:h-[200vh]')} aria-label="RGR Architetti, dal disegno alla casa">
      <h1 className="sr-only">RGR Architetti, studio di architettura a Bergamo</h1>
      <div className={cn('top-0 flex h-[100svh] flex-col p-3 pt-[72px] sm:p-5 sm:pt-[84px] lg:p-8 lg:pt-[96px]', !reduced && 'sticky')}>
        <div className="relative flex-1">
          {/* cornice della tavola */}
          <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
            <rect className="ln frame" x="0" y="0" width="100%" height="100%" fill="none" stroke="var(--rgr-ink)" strokeWidth={1} pathLength={1} />
          </svg>

          <div ref={stage} className="paper-grid absolute inset-0 overflow-hidden">
            <div className="absolute" style={{ left: box.x, top: box.y, width: box.w, height: box.h }}>
              <img
                className="photo absolute inset-0 h-full w-full select-none object-cover"
                src={photo.src}
                width={photo.w}
                height={photo.h}
                alt="Casa di montagna in Valseriana progettata da RGR Architetti: muri in pietra, volume in legno e tetto a falde nella neve"
                fetchPriority="high"
              />
              <svg className="drawing absolute inset-0 h-full w-full" viewBox={`0 0 ${ELEV_W} ${ELEV_H}`} preserveAspectRatio="none" aria-hidden>
                {groups.map((g) => (
                  <g key={g.key} className={'g-' + g.key} fill="none" stroke={g.stroke} strokeWidth={g.w * unit}>
                    {elev[g.key].map((d, i) => (
                      <path key={i} className="ln" d={d} pathLength={1} />
                    ))}
                  </g>
                ))}
              </svg>
              <div className="scan pointer-events-none absolute inset-y-0 z-10 w-[2px] -translate-x-1/2 bg-primary shadow-[0_0_24px_rgba(244,23,28,0.55)]" />
            </div>

            {/* titolo d'apertura: scompare quando parte la linea rossa */}
            <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 sm:left-8 sm:top-7 lg:left-10 lg:top-9">
              <p className="start label-tech !text-primary">Studio di architettura · Bergamo</p>
              <p aria-hidden className="start mt-3 font-display text-[clamp(2.1rem,5.6vw,5.25rem)] font-bold uppercase leading-[0.9] text-rgr-black">
                Dal disegno
                <br />
                alla casa
              </p>
            </div>
            <p className="cue label-tech pointer-events-none absolute bottom-5 left-4 z-10 flex items-center gap-3 sm:left-8 lg:bottom-8 lg:left-10">
              <span className="relative block h-9 w-px overflow-hidden bg-rgr-grey/40">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-primary" />
              </span>
              Scorra: il disegno diventa la casa
            </p>
            <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(220%)}}`}</style>

            {/* fine sequenza: didascalia sopra la foto */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 lg:p-12">
              {!box.contain && <div aria-hidden className="end-bg absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/60 via-black/20 to-transparent" />}
              <div className={cn('pointer-events-auto relative max-w-2xl', box.contain ? 'text-rgr-black' : 'text-white')}>
                <p className={cn('end label-tech', box.contain ? '!text-primary' : '!text-white/80')}>Casa di montagna · Valseriana</p>
                <p className={cn('end mt-3 font-display text-[clamp(2rem,5.5vw,4.75rem)] font-bold uppercase leading-[0.92]', box.contain ? 'text-rgr-black' : 'text-white')}>
                  Dal disegno
                  <br />
                  alla casa.
                </p>
                <div className="end mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/progetti"
                    className={cn(
                      'group inline-flex h-12 items-center gap-3 px-6 font-nav text-[0.75rem] uppercase tracking-[0.2em] transition-colors',
                      box.contain ? 'bg-primary text-white hover:bg-rgr-black' : 'bg-white text-rgr-black hover:bg-primary hover:text-white',
                    )}
                  >
                    I progetti dello studio <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/rassegna-stampa/casa-di-montagna"
                    className={cn('inline-flex h-12 items-center px-2 font-nav text-[0.75rem] uppercase tracking-[0.2em] underline-offset-8 hover:underline', box.contain ? 'text-rgr-black' : 'text-white')}
                  >
                    L’articolo
                  </Link>
                </div>
              </div>
            </div>

            {/* cartiglio */}
            <div className="sheet-in absolute bottom-0 right-0 z-20 hidden border-l border-t border-rgr-ink bg-white/95 text-xs md:text-[0.68rem] lg:block">
              <div className="grid grid-cols-[auto_auto] divide-x divide-rgr-ink/70">
                <div className="flex items-center px-4 py-3">
                  <Logo className="w-[72px]" />
                </div>
                <dl className="grid grid-cols-2 divide-x divide-y divide-rgr-ink/30">
                  <div className="px-3 py-2">
                    <dt className="label-tech text-xs md:text-[0.55rem]">Tavola</dt>
                    <dd className="font-nav uppercase tracking-wider">Prospetto</dd>
                  </div>
                  <div className="px-3 py-2">
                    <dt className="label-tech text-xs md:text-[0.55rem]">Luogo</dt>
                    <dd className="font-nav uppercase tracking-wider">Valseriana, BG</dd>
                  </div>
                  <div className="col-span-2 px-3 py-2">
                    <dt className="label-tech text-xs md:text-[0.55rem]">Progetto</dt>
                    <dd className="font-nav uppercase tracking-wider">Casa di montagna</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
