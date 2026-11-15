import { animate, AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectUrl } from '@/data/content';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { ambientCopy } from './copy';
import { altOf, ambientOf, ambients, interiorProjects, projTitle, thumbOf, type Ambient } from './utils';

type Filter = Ambient | 'tutti';

/**
 * 03 Interior design: "Esplora per ambiente".
 * Chip di filtro, griglia con layout animato e contatore dei progetti trovati.
 */
export function AmbientExplorer() {
  const [filter, setFilter] = useState<Filter>('tutti');
  const reduce = useReducedMotion() ?? false;

  const classified = useMemo(() => interiorProjects.map((p) => ({ p, a: ambientOf(p) })), []);
  const counts = useMemo(() => {
    const c = { tutti: classified.length } as Record<Filter, number>;
    for (const { id } of ambients) c[id] = classified.filter((x) => x.a === id).length;
    return c;
  }, [classified]);
  const list = filter === 'tutti' ? classified : classified.filter((x) => x.a === filter);

  const chips: { id: Filter; label: string }[] = [{ id: 'tutti', label: ambientCopy.all }, ...ambients];

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label={ambientCopy.filterLabel} className="flex flex-wrap gap-2">
          <LayoutGroup id="ambient-chips">
            {chips.map((c) => {
              const on = c.id === filter;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'relative isolate inline-flex min-h-[44px] items-center gap-2 border px-4 font-nav text-xs md:text-[0.72rem] uppercase tracking-[0.18em] transition-colors duration-300',
                    on ? 'border-rgr-black text-white' : 'border-rgr-grey/70 text-rgr-ink hover:border-rgr-black',
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="ambient-chip-bg"
                      className="absolute inset-0 -z-10 bg-rgr-black"
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE_EXPO }}
                    />
                  )}
                  {c.label}
                  <span className={cn('text-xs md:text-[0.62rem] tracking-[0.1em]', on ? 'text-primary' : 'text-muted-foreground')}>{counts[c.id]}</span>
                </button>
              );
            })}
          </LayoutGroup>
        </div>
        <p className="flex items-baseline gap-3" aria-live="polite">
          <AnimatedNumber value={list.length} reduce={reduce} className="font-display text-5xl font-bold leading-none text-primary lg:text-6xl" />
          <span className="label-tech">{ambientCopy.found(list.length)}</span>
        </p>
      </div>

      <motion.ul layout={!reduce} className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map(({ p }) => (
            <motion.li
              key={p.slug}
              layout={!reduce}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE_EXPO }}
            >
              <Link to={projectUrl(p)} className="group block" aria-label={`${ambientCopy.open}: ${projTitle(p)}`}>
                <div className="crop-marks">
                  <div className="relative overflow-hidden bg-rgr-paper-2">
                    <img
                      src={thumbOf(p.images[0])}
                      alt={altOf(p, 0)}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                    <span className="absolute right-2 top-2 grid size-9 translate-y-1 place-items-center bg-white text-rgr-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <ArrowUpRight aria-hidden className="size-4" />
                    </span>
                  </div>
                </div>
                <p className="label-tech mt-3 text-xs md:text-[0.62rem]">
                  {p.year} · {ambients.find((a) => a.id === ambientOf(p))?.label}
                </p>
                <h3 className="mt-1 text-sm font-bold uppercase leading-tight transition-colors duration-300 group-hover:text-primary sm:text-base">{projTitle(p)}</h3>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && <p className="mt-10 text-muted-foreground">{ambientCopy.empty}</p>}
    </div>
  );
}

/** numero che scorre dal valore precedente al nuovo (solo conteggi reali) */
function AnimatedNumber({ value, reduce, className }: { value: number; reduce: boolean; className?: string }) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (reduce) {
      setShown(value);
      prev.current = value;
      return;
    }
    const c = animate(prev.current, value, { duration: 0.8, ease: EASE_EXPO, onUpdate: (x) => setShown(Math.round(x)) });
    prev.current = value;
    return () => c.stop();
  }, [value, reduce]);
  return (
    <span className={className}>
      <span aria-hidden>{String(shown).padStart(2, '0')}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
