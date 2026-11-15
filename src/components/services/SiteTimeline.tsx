import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HardHat, Ruler } from 'lucide-react';
import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { siteCopy, sitePhases } from './copy';

/**
 * 04 Direzione lavori e sicurezza: "Il cantiere, fase per fase".
 * Cursore personalizzato su un binario tratteggiato da tavola: trascinando, il rosso avanza
 * e sotto compaiono le attività di direzione lavori e di sicurezza della fase.
 */
export function SiteTimeline() {
  const n = sitePhases.length;
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const reduce = useReducedMotion() ?? false;
  const track = useRef<HTMLDivElement>(null);

  const posFromX = (x: number) => {
    const r = track.current?.getBoundingClientRect();
    if (!r || r.width === 0) return 0;
    return Math.max(0, Math.min(n - 1, ((x - r.left) / r.width) * (n - 1)));
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const v = posFromX(e.clientX);
    setDrag(v);
    setActive(Math.round(v));
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag === null) return;
    const v = posFromX(e.clientX);
    setDrag(v);
    setActive(Math.round(v));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDrag(null);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowUp: active + 1, ArrowLeft: active - 1, ArrowDown: active - 1, Home: 0, End: n - 1, PageUp: active + 1, PageDown: active - 1 };
    if (e.key in map) {
      e.preventDefault();
      setActive(Math.max(0, Math.min(n - 1, map[e.key])));
    }
  };

  const pct = ((drag ?? active) / (n - 1)) * 100;
  const move = { duration: drag !== null || reduce ? 0 : 0.7, ease: EASE_EXPO };
  const phase = sitePhases[active];

  return (
    <div className="border border-border bg-white">
      {/* binario */}
      <div className="paper-grid border-b border-border px-6 pb-6 pt-10 sm:px-10 lg:px-14">
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={cn('relative -mx-2 select-none px-2 py-5', drag !== null ? 'cursor-grabbing' : 'cursor-pointer')}
          style={{ touchAction: 'pan-y' }}
        >
          <div ref={track} className="relative h-[3px]">
            {/* tratteggio grigio di costruzione */}
            <span aria-hidden className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--rgr-grey) 0 8px, transparent 8px 14px)' }} />
            {/* avanzamento rosso */}
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0"
              style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--rgr-red) 0 8px, transparent 8px 14px)' }}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={move}
            />
            {/* tacche */}
            {sitePhases.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={cn('absolute top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 transition-colors duration-500', i <= active ? 'bg-primary' : 'bg-rgr-grey')}
                style={{ left: `${(i / (n - 1)) * 100}%` }}
              />
            ))}
            {/* cursore */}
            <motion.div
              role="slider"
              tabIndex={0}
              aria-label={siteCopy.sliderLabel}
              aria-valuemin={1}
              aria-valuemax={n}
              aria-valuenow={active + 1}
              aria-valuetext={`${siteCopy.phaseOf(active + 1, n)}: ${phase.title}`}
              onKeyDown={onKey}
              className="absolute top-1/2 z-[1] grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center bg-rgr-black text-white shadow-[0_6px_20px_rgba(13,13,13,0.25)] active:cursor-grabbing"
              initial={false}
              animate={{ left: `${pct}%` }}
              transition={move}
            >
              <span className="font-nav text-xs tracking-[0.12em]">{String(active + 1).padStart(2, '0')}</span>
              <span aria-hidden className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-rgr-black" />
            </motion.div>
          </div>
        </div>

        {/* etichette delle fasi */}
        <ol className="relative mt-1 h-12 md:h-[5.5rem]">
          {sitePhases.map((ph, i) => (
            <li
              key={ph.title}
              className={cn('absolute top-0', i === 0 ? '' : i === n - 1 ? '-translate-x-full' : '-translate-x-1/2')}
              style={{ left: `${(i / (n - 1)) * 100}%` }}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={`${siteCopy.phaseOf(i + 1, n)}: ${ph.title}`}
                className={cn(
                  'group flex min-h-[44px] min-w-[44px] flex-col items-center text-center transition-colors duration-300',
                  i === 0 && 'items-start text-left',
                  i === n - 1 && 'items-end text-right',
                  i === active ? 'text-rgr-black' : 'text-muted-foreground hover:text-rgr-black',
                )}
              >
                <span className={cn('font-nav text-xs tracking-[0.15em]', i <= active && 'text-primary')}>{String(i + 1).padStart(2, '0')}</span>
                <span className="mt-1 hidden max-w-[14ch] font-nav text-xs md:text-[0.66rem] uppercase leading-snug tracking-[0.12em] md:block">{ph.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="label-tech mt-6 text-xs md:text-[0.62rem]">{siteCopy.hint}</p>
      </div>

      {/* attività della fase */}
      <div className="relative overflow-hidden p-6 sm:p-10 lg:p-14" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE_EXPO }}
            className="grid gap-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <p className="label-tech">{siteCopy.phaseOf(active + 1, n)}</p>
              <h3 className="mt-3 text-[clamp(1.7rem,3.4vw,2.8rem)] font-bold uppercase leading-[0.98]">{phase.title}</h3>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
              <ActivityList icon={<Ruler aria-hidden className="size-4" />} label={siteCopy.dlLabel} items={phase.dl} reduce={reduce} />
              <ActivityList icon={<HardHat aria-hidden className="size-4" />} label={siteCopy.safetyLabel} items={phase.safety} reduce={reduce} />
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground">{siteCopy.note}</p>
      </div>
    </div>
  );
}

function ActivityList({ icon, label, items, reduce }: { icon: React.ReactNode; label: string; items: string[]; reduce: boolean }) {
  return (
    <div className="border-t border-rgr-black/80 pt-4">
      <p className="label-tech flex items-center gap-2 !text-rgr-black">
        <span className="text-primary">{icon}</span>
        {label}
      </p>
      <ul className="mt-4">
        {items.map((it, i) => (
          <motion.li
            key={it}
            initial={reduce ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE_EXPO, delay: reduce ? 0 : 0.12 + i * 0.07 }}
            className="flex gap-3 border-b border-border py-3 leading-snug text-rgr-ink/90"
          >
            <span aria-hidden className="mt-[0.6em] block h-px w-3 shrink-0 bg-primary" />
            {it}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
