import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { projectUrl, type Project } from '@/data/content';
import { EASE_DRAW, EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { serviceCopy, surveyCopy } from './copy';
import { altOf, landscapeOf, projTitle, thumbOf } from './utils';

/**
 * 02 Ristrutturazione e recupero: "Prima il rilievo, poi il progetto".
 * Confronto trascinabile tra la foto reale e una sua rielaborazione grafica "da rilievo"
 * (bianco e nero contrastato, griglia millimetrata, quote indicative).
 */
export function SurveyCompare({ projects }: { projects: Project[] }) {
  const [sel, setSel] = useState(0);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const box = useRef<HTMLDivElement>(null);

  const p = projects[sel];
  const { img, index } = landscapeOf(p);

  const fromClientX = useCallback((x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setPos(Math.round(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100))));
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    fromClientX(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) fromClientX(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: pos - step, ArrowDown: pos - step, ArrowRight: pos + step, ArrowUp: pos + step,
      PageDown: pos - 10, PageUp: pos + 10, Home: 0, End: 100,
    };
    if (e.key in map) {
      e.preventDefault();
      setPos(Math.max(0, Math.min(100, map[e.key])));
    }
  };

  const choose = (i: number) => {
    setSel(i);
    setPos(50);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* selettore progetti */}
      <div className="lg:col-span-4">
        <p className="label-tech mb-4" id="survey-pick">{surveyCopy.pickLabel}</p>
        <ul aria-labelledby="survey-pick" className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-0">
          {projects.map((pr, i) => {
            const on = i === sel;
            return (
              <li key={pr.slug}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(i)}
                  className={cn(
                    'group relative flex min-h-[44px] w-full items-center gap-3 text-left transition-colors duration-300 lg:gap-4 lg:border-b lg:border-border lg:py-3',
                    on ? 'text-rgr-black' : 'text-rgr-ink/70 hover:text-rgr-black',
                  )}
                >
                  <span className={cn('relative block size-14 shrink-0 overflow-hidden bg-rgr-paper-2 ring-offset-2 transition-[box-shadow] duration-300 lg:size-16', on && 'ring-1 ring-primary')}>
                    <img src={thumbOf(pr.images[0])} alt="" loading="lazy" decoding="async" className={cn('h-full w-full object-cover transition-[filter] duration-500', !on && 'grayscale')} />
                  </span>
                  <span className="min-w-0">
                    <span className="label-tech block text-xs md:text-[0.62rem]">{pr.year}</span>
                    <span className="block font-display text-sm font-bold uppercase leading-tight lg:text-base">{projTitle(pr)}</span>
                  </span>
                  <span aria-hidden className={cn('absolute bottom-[-1px] left-0 hidden h-px w-full origin-left bg-primary transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] lg:block', on ? 'scale-x-100' : 'scale-x-0')} />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 hidden text-sm leading-relaxed text-muted-foreground lg:block">{surveyCopy.note}</p>
      </div>

      {/* confronto */}
      <div className="lg:col-span-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <span className="label-tech text-xs md:text-[0.62rem] !text-rgr-black">{surveyCopy.before}</span>
          <span className="label-tech text-right text-xs md:text-[0.62rem] !text-primary">{surveyCopy.after}</span>
        </div>

        <div
          ref={box}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={cn('relative aspect-[4/5] select-none overflow-hidden bg-rgr-paper-2 sm:aspect-[4/3]', dragging ? 'cursor-grabbing' : 'cursor-ew-resize')}
          style={{ touchAction: 'pan-y' }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={p.slug}
              className="absolute inset-0"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.8, ease: EASE_EXPO }}
            >
              {/* sotto: il progetto realizzato */}
              <img src={img.src} alt={altOf(p, index)} width={img.w} height={img.h} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
              {/* sopra: lettura dell'esistente, ritagliata dalla posizione del cursore */}
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} aria-hidden>
                <img
                  src={img.src}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ filter: 'grayscale(1) contrast(1.35) brightness(1.08)' }}
                />
                <div className="absolute inset-0 bg-white/25" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(37,37,37,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,37,37,0.16) 1px, transparent 1px), linear-gradient(to right, rgba(37,37,37,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,37,37,0.07) 1px, transparent 1px)',
                    backgroundSize: '64px 64px, 64px 64px, 16px 16px, 16px 16px',
                  }}
                />
                <SurveyMarks reduce={reduce} k={p.slug} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* maniglia */}
          <div className="pointer-events-none absolute inset-y-0 z-[2] w-0" style={{ left: `${pos}%` }}>
            <span className="absolute inset-y-0 -left-px w-[2px] bg-primary" />
            <div
              role="slider"
              tabIndex={0}
              aria-label={surveyCopy.sliderLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pos}
              aria-valuetext={surveyCopy.valueText(pos)}
              aria-orientation="horizontal"
              onKeyDown={onKey}
              className="pointer-events-auto absolute left-0 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center rounded-full border border-primary bg-white text-primary shadow-[0_4px_24px_rgba(13,13,13,0.18)] transition-transform duration-300 hover:scale-105 active:cursor-grabbing"
            >
              <MoveHorizontal aria-hidden className="size-5" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="label-tech text-xs md:text-[0.62rem]">{surveyCopy.hint}</p>
          <Link to={projectUrl(p)} className="label-tech link-draw inline-flex min-h-[44px] items-center !text-rgr-black hover:!text-primary sm:min-h-0">
            {serviceCopy.photoLink}: {projTitle(p)}
          </Link>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:hidden">{surveyCopy.note}</p>
      </div>
    </div>
  );
}

/** quote e riferimenti disegnati sopra la vista "rilievo": solo segni indicativi, senza misure */
function SurveyMarks({ reduce, k }: { reduce: boolean; k: string }) {
  const lines = [
    // quota orizzontale in alto
    'M8 10 H92', 'M8 8 V12', 'M92 8 V12', 'M7 11 L9 9', 'M91 11 L93 9',
    // quota verticale a destra
    'M94 16 V88', 'M92 16 H96', 'M92 88 H96', 'M93 17 L95 15', 'M93 89 L95 87',
    // linea di riferimento a terra
    'M4 82 H60',
  ];
  const label = 'absolute font-nav text-xs md:text-[0.65rem] tracking-[0.18em] text-primary bg-white/80 px-1 leading-none py-0.5';
  return (
    <>
      <svg key={k} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        {lines.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="var(--rgr-red)"
            strokeWidth={1.2}
            vectorEffect="non-scaling-stroke"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: EASE_DRAW, delay: reduce ? 0 : 0.2 + i * 0.05 }}
          />
        ))}
      </svg>
      <span className={cn(label, 'left-1/2 top-[10%] -translate-x-1/2 -translate-y-1/2')}>L</span>
      <span className={cn(label, 'right-[6%] top-[52%] -translate-y-1/2 translate-x-1/2')}>H</span>
      <span className={cn(label, 'left-[5%] top-[82%] -translate-y-[130%]')}>±0,00</span>
    </>
  );
}
