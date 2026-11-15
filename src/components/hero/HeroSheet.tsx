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
 * HERO 2: la tavola. Allo scroll si disegna il prospetto della Casa di montagna in Valseriana
 * (ricalcato sulla foto reale): terra, struttura, falde, aperture, retini, contesto, quote.
 * Poi la linea rossa del logo diventa la scansione che trasforma il disegno nella foto.
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
      // schermi stretti: la tavola si allarga del 35% e resta centrata sulla casa (x ≈ 54% del disegno)
      const w = Math.min(W * 1.35, H * 0.6 * RATIO);
      const h = w / RATIO;
      const x = Math.min(0, Math.max(W - w, W / 2 - w * 0.545));
      setBox({ w, h, x, y: Math.max((H - h) / 2, 0), contain });
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
        gsap.set(q('.end'), { autoAlpha: 1, y: 0 });
        gsap.set(q('.scan'), { autoAlpha: 0 });
        return;
      }
      gsap.set(all, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.set(q('.photo'), { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(q('.scan'), { left: '0%', autoAlpha: 0 });
      gsap.set(q('.end'), { autoAlpha: 0, y: 24 });
      gsap.set(q('.end-bg'), { autoAlpha: 0 });
      gsap.set(q('.sheet-in'), { autoAlpha: 0, y: 12 });

      const W = { p: 0 };
      const apply = () => {
        const p = W.p;
        (q('.photo')[0] as HTMLElement).style.clipPath = `inset(0 ${100 - p}% 0 0)`;
        (q('.drawing')[0] as HTMLElement).style.clipPath = `inset(0 0 0 ${p}%)`;
        (q('.scan')[0] as HTMLElement).style.left = `${p}%`;
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      });
      tl.to(q('.frame'), { strokeDashoffset: 0, duration: 0.8, stagger: 0.1 }, 0)
        .to(q('.sheet-in'), { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.3)
        .to(q('.g-ground .ln')[0], { strokeDashoffset: 0, duration: 0.9 }, 0.3)
        .to(q('.g-ground .ln').slice(1), { strokeDashoffset: 0, duration: 0.3, stagger: 0.006 }, 0.7)
        .to(q('.g-struct .ln'), { strokeDashoffset: 0, duration: 0.9, stagger: 0.07 }, 0.9)
        .to(q('.g-roofs .ln'), { strokeDashoffset: 0, duration: 1.1, stagger: 0.08 }, 1.5)
        .to(q('.g-openings .ln'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.035 }, 2.2)
        .to(q('.g-hatch .ln'), { strokeDashoffset: 0, duration: 0.45, stagger: 0.008 }, 2.8)
        .to(q('.g-ctx .ln'), { strokeDashoffset: 0, duration: 1.2, stagger: 0.06 }, 3.1)
        .to(q('.g-dims .ln'), { strokeDashoffset: 0, duration: 0.5, stagger: 0.02 }, 3.7)
        .to(q('.scan'), { autoAlpha: 1, duration: 0.15 }, 4.4)
        .to(W, { p: 100, duration: 2.2, ease: 'power1.inOut', onUpdate: apply }, 4.45)
        .to(q('.scan'), { autoAlpha: 0, duration: 0.2 }, 6.6)
        .to(q('.end-bg'), { autoAlpha: 1, duration: 0.6 }, 6.3)
        .to(q('.end'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, 6.5)
        .to({}, { duration: 0.6 });
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
    <section ref={section} className={cn('relative bg-white', reduced ? '' : 'h-[300vh] lg:h-[420vh]')} aria-label="Dal disegno alla casa">
      <div className={cn('top-0 flex h-[100svh] flex-col p-3 pt-[72px] sm:p-5 sm:pt-[84px] lg:p-8 lg:pt-[96px]', !reduced && 'sticky')}>
        <div className="relative flex-1">
          {/* cornice della tavola */}
          <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
            <rect className="ln frame" x="0" y="0" width="100%" height="100%" fill="none" stroke="var(--rgr-ink)" strokeWidth={1} pathLength={1} />
          </svg>

          <div ref={stage} className="paper-grid absolute inset-0 overflow-hidden">
            {box.contain && (
              <div className="sheet-in absolute inset-x-4 top-4 z-10">
                <p className="label-tech !text-primary">Prospetto</p>
                <p className="mt-1 font-display text-2xl font-bold uppercase leading-none text-rgr-black">Casa di montagna in Valseriana</p>
              </div>
            )}

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
