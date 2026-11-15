import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Counter } from '@/components/motion/Counter';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { categories, projects, yearsRange, type CategorySlug } from '@/data/content';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

export default function Progetti() {
  const [params, setParams] = useSearchParams();
  const cat = (params.get('ambito') as CategorySlug | null) ?? null;
  const yearParam = params.get('anno');
  const year = yearParam ? Number(yearParam) : null;

  const set = (k: 'ambito' | 'anno', v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const byCat = useMemo(() => projects.filter((p) => !cat || p.category === cat), [cat]);
  const list = useMemo(() => byCat.filter((p) => !year || p.year === year).sort((a, b) => b.year - a.year), [byCat, year]);

  const years = useMemo(() => {
    const out: { y: number; n: number }[] = [];
    for (let y = yearsRange.from; y <= yearsRange.to; y++) out.push({ y, n: byCat.filter((p) => p.year === y).length });
    return out;
  }, [byCat]);
  const max = Math.max(...years.map((y) => y.n), 1);

  return (
    <>
      <Seo title="Progetti" description={`L’archivio dei progetti di RGR Architetti dal ${yearsRange.from} al ${yearsRange.to}: residenziale, interior design, commerciale e industriale.`} />
      <PageHeader
        kicker="Archivio"
        title={['Progetti']}
        crumbs={[{ to: '/', label: 'Home' }]}
        lead={
          <>
            <Counter to={projects.length} /> progetti dal {yearsRange.from} al {yearsRange.to}, in quattro ambiti.
          </>
        }
      />

      <section className="pb-24 lg:pb-36">
        <div className="container-rgr">
          {/* filtri per ambito */}
          <div className="sticky top-0 z-30 -mx-4 border-b border-border bg-white/92 px-4 py-4 backdrop-blur-md sm:mx-0 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="toolbar" aria-label="Filtra per ambito">
              <Chip active={!cat} onClick={() => set('ambito', null)} label="Tutti" n={projects.length} />
              {categories.map((c) => (
                <Chip key={c.slug} active={cat === c.slug} onClick={() => set('ambito', c.slug)} label={c.title} n={c.projects.length} />
              ))}
            </div>
          </div>

          {/* istogramma degli anni: ogni barra è un anno, cliccabile */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <p className="label-tech">Anno</p>
              {year && (
                <button type="button" onClick={() => set('anno', null)} className="label-tech flex items-center gap-1 !text-primary">
                  {year} <X className="size-3.5" /> <span className="sr-only">Rimuovi il filtro anno</span>
                </button>
              )}
            </div>
            <div className="mt-4 flex h-28 items-end gap-[3px] border-b border-rgr-ink sm:gap-1.5" role="group" aria-label="Filtra per anno">
              {years.map(({ y, n }) => (
                <button
                  key={y}
                  type="button"
                  disabled={!n}
                  aria-pressed={year === y}
                  aria-label={`${y}: ${n} progetti`}
                  onClick={() => set('anno', year === y ? null : String(y))}
                  className="group relative flex h-full min-w-0 flex-1 items-end disabled:cursor-default"
                >
                  <motion.span
                    className={cn('block w-full origin-bottom transition-colors', year === y ? 'bg-primary' : n ? 'bg-rgr-grey group-hover:bg-rgr-black' : 'bg-rgr-paper-2')}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1, height: `${Math.max((n / max) * 100, 4)}%` }}
                    transition={{ duration: 0.8, ease: EASE_EXPO, delay: (y - yearsRange.from) * 0.02 }}
                  />
                  {n > 0 && (
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-nav text-xs md:text-[0.65rem] text-rgr-black opacity-0 transition-opacity group-hover:opacity-100">{n}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-2 flex justify-between font-nav text-xs text-muted-foreground">
              <span>{yearsRange.from}</span>
              <span>{yearsRange.to}</span>
            </div>
            {/* su mobile le barre sono troppo strette da toccare: selettore dell'anno */}
            <label className="mt-6 flex items-center gap-4 sm:hidden">
              <span className="label-tech shrink-0">Scelga l’anno</span>
              <select
                value={year ?? ''}
                onChange={(e) => set('anno', e.target.value || null)}
                className="h-12 min-w-0 flex-1 border border-border bg-white px-3 font-nav text-base uppercase tracking-[0.12em] text-rgr-black focus:border-primary focus:outline-none"
              >
                <option value="">Tutti gli anni</option>
                {years
                  .filter((y) => y.n > 0)
                  .reverse()
                  .map(({ y, n }) => (
                    <option key={y} value={y}>
                      {y} ({n})
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <p className="label-tech mt-12" aria-live="polite">
            {list.length} {list.length === 1 ? 'progetto' : 'progetti'}
          </p>

          <motion.div layout className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: EASE_EXPO, delay: Math.min(i, 8) * 0.04 }}
                >
                  <ProjectCard project={p} headingLevel="h2" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function Chip({ active, onClick, label, n }: { active: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'relative flex h-11 shrink-0 items-center gap-2 border px-5 font-nav text-[0.75rem] uppercase tracking-[0.16em] transition-colors',
        active ? 'border-rgr-black bg-rgr-black text-white' : 'border-border text-rgr-black hover:border-rgr-black',
      )}
    >
      {label}
      <span className={cn('text-xs md:text-[0.65rem]', active ? 'text-primary' : 'text-muted-foreground')}>{String(n).padStart(2, '0')}</span>
    </button>
  );
}
