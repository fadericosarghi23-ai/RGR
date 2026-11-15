import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { EASE_DRAW, EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { processCopy, processSteps, type StepIcon } from './copy';

/**
 * 01 Progettazione: "Percorso a tappe".
 * Stepper (orizzontale da md in su, verticale su mobile) con linea rossa che avanza
 * fino alla tappa attiva e un piccolo disegno a linee che si traccia per ogni tappa.
 */
export function ProcessStepper() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const uid = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = processSteps.length;
  const progress = active / (n - 1);

  const go = (i: number, focus = false) => {
    const next = Math.max(0, Math.min(n - 1, i));
    setActive(next);
    if (focus) tabs.current[next]?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: n - 1 };
    if (e.key in map) {
      e.preventDefault();
      go(map[e.key], true);
    }
  };

  const step = processSteps[active];
  const lineT = { duration: reduce ? 0 : 0.9, ease: EASE_EXPO };

  return (
    <div className="grid gap-10 lg:gap-14">
      {/* binario delle tappe */}
      <div className="relative">
        {/* linea orizzontale (md+) */}
        <div aria-hidden className="pointer-events-none absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[22px] hidden h-px bg-rgr-grey/60 md:block">
          <motion.span className="absolute inset-y-[-0.5px] left-0 block h-[2px] w-full origin-left bg-primary" animate={{ scaleX: progress }} initial={false} transition={lineT} />
        </div>
        {/* linea verticale (mobile) */}
        <div aria-hidden className="pointer-events-none absolute bottom-[28px] left-[22px] top-[28px] w-px bg-rgr-grey/60 md:hidden">
          <motion.span className="absolute inset-x-[-0.5px] top-0 block h-full w-[2px] origin-top bg-primary" animate={{ scaleY: progress }} initial={false} transition={lineT} />
        </div>

        <div role="tablist" aria-label={processCopy.listLabel} aria-orientation="horizontal" onKeyDown={onKey} className="relative flex flex-col md:flex-row">
          {processSteps.map((s, i) => {
            const selected = i === active;
            const done = i <= active;
            return (
              <button
                key={s.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`${uid}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(i)}
                className="group flex h-14 min-w-0 items-center gap-4 text-left md:h-auto md:flex-1 md:flex-col md:items-center md:gap-4 md:text-center"
              >
                <span
                  className={cn(
                    'relative z-[1] grid size-11 shrink-0 place-items-center rounded-full border bg-white font-nav text-xs tracking-[0.15em] transition-[border-color,color,background-color] duration-500',
                    selected ? 'border-primary bg-primary text-white' : done ? 'border-primary text-primary' : 'border-rgr-grey text-rgr-ink/70 group-hover:border-rgr-black group-hover:text-rgr-black',
                  )}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'font-nav text-xs md:text-[0.72rem] uppercase leading-snug tracking-[0.16em] transition-colors duration-300 md:max-w-[11ch] lg:max-w-none',
                    selected ? 'text-rgr-black' : 'text-muted-foreground group-hover:text-rgr-black',
                  )}
                >
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* tavola della tappa attiva */}
      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="grid overflow-hidden border border-border bg-white md:grid-cols-12"
      >
        <div className="paper-grid relative border-b border-border p-6 md:col-span-6 md:border-b-0 md:border-r lg:col-span-5 lg:p-10">
          <span className="label-tech absolute left-4 top-3 text-xs md:text-[0.62rem]">{processCopy.stepOf(active + 1, n)}</span>
          <StepDrawing key={step.id} icon={step.id} reduce={reduce} />
        </div>
        <div className="flex flex-col justify-between gap-8 p-6 md:col-span-6 lg:col-span-7 lg:p-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={{ duration: reduce ? 0 : 0.55, ease: EASE_EXPO }}
              aria-live="polite"
            >
              <p className="font-nav text-sm tracking-[0.2em] text-primary">{String(active + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-[clamp(1.6rem,3.4vw,2.8rem)] font-bold uppercase leading-[0.98]">{step.title}</h3>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-rgr-ink/85">{step.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="label-tech hidden text-xs md:text-[0.62rem] sm:block">{processCopy.hint}</p>
            <div className="ml-auto flex gap-2">
              <StepButton label={processCopy.prev} disabled={active === 0} onClick={() => go(active - 1)}>
                <ArrowLeft aria-hidden className="size-4" />
              </StepButton>
              <StepButton label={processCopy.next} disabled={active === n - 1} onClick={() => go(active + 1)}>
                <ArrowRight aria-hidden className="size-4" />
              </StepButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center border border-rgr-black/70 text-rgr-black transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ disegni a linee */
type Stroke = { d: string; red?: boolean; w?: number };

const DRAWINGS: Record<StepIcon, Stroke[]> = {
  // due fumetti che si parlano
  ascolto: [
    { d: 'M30 34 h56 a8 8 0 0 1 8 8 v22 a8 8 0 0 1 -8 8 h-34 l-12 12 v-12 h-10 a8 8 0 0 1 -8 -8 v-22 a8 8 0 0 1 8 -8 z' },
    { d: 'M44 48 h36 M44 58 h24' },
    { d: 'M108 54 h28 a7 7 0 0 1 7 7 v18 a7 7 0 0 1 -7 7 h-6 v10 l-10 -10 h-12 a7 7 0 0 1 -7 -7 v-6', red: true },
    { d: 'M116 66 h18 M116 74 h12', red: true },
  ],
  // schizzo a mano libera: profilo di una casa e tratti di matita
  idea: [
    { d: 'M24 98 C40 97 70 99 100 97 S140 98 152 97' },
    { d: 'M38 97 L37 62 L68 36 L99 61 L100 97' },
    { d: 'M33 66 L68 33 L104 65' },
    { d: 'M58 97 C58 86 59 80 60 76 L74 76 L75 97' },
    { d: 'M84 70 h10 v10 h-10 z' },
    { d: 'M118 44 c6 -10 18 -10 22 0 c4 10 -8 16 -14 10 c-5 -5 2 -12 8 -8', red: true },
    { d: 'M112 80 C122 74 132 86 146 78', red: true },
  ],
  // pianta semplice con porta e quota
  preliminare: [
    { d: 'M28 28 h104 v66 h-104 z', w: 2 },
    { d: 'M86 28 v28 M86 70 v24' },
    { d: 'M28 60 h36 M78 60 h8' },
    { d: 'M86 56 a14 14 0 0 1 14 14', red: true },
    { d: 'M64 60 a14 14 0 0 0 14 -14', red: true },
    { d: 'M28 106 h104 M28 102 v8 M132 102 v8', red: true },
    { d: 'M40 76 h20 v12 h-20 z' },
  ],
  // documento con timbro
  pratiche: [
    { d: 'M42 18 h56 l18 18 v74 h-74 z' },
    { d: 'M98 18 v18 h18' },
    { d: 'M54 46 h46 M54 56 h46 M54 66 h30' },
    { d: 'M54 96 c6 -8 10 4 16 -2 s8 -6 14 0' },
    { d: 'M124 78 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0', red: true },
    { d: 'M124 78 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0', red: true },
    { d: 'M117 78 l5 5 l9 -10', red: true },
  ],
  // dettaglio costruttivo: sezione di muro con strati, campitura e quota
  esecutivo: [
    { d: 'M50 16 v88 M70 16 v88 M78 16 v88 M86 16 v88' },
    { d: 'M50 26 l20 -10 M50 40 l20 -20 M50 54 l20 -20 M50 68 l20 -20 M50 82 l20 -20 M50 96 l20 -20 M56 104 l14 -14' },
    { d: 'M86 60 h46 v8 h-46', w: 2 },
    { d: 'M30 16 v88 M26 16 h8 M26 104 h8', red: true },
    { d: 'M100 40 l20 -14 h20', red: true },
  ],
  // gru da cantiere
  cantiere: [
    { d: 'M20 108 h124', w: 2 },
    { d: 'M52 108 v-86 M62 108 v-86' },
    { d: 'M52 100 l10 -10 M62 100 l-10 -10 M52 84 l10 -10 M62 84 l-10 -10 M52 68 l10 -10 M62 68 l-10 -10 M52 52 l10 -10 M62 52 l-10 -10' },
    { d: 'M24 30 h120 M24 38 h120 M57 14 L24 30 M57 14 L144 30' },
    { d: 'M28 38 h16 v12 h-16 z' },
    { d: 'M124 38 v34', red: true },
    { d: 'M118 72 h12 v4 c0 6 -8 6 -8 0', red: true },
    { d: 'M104 108 v-22 h30 v22 M104 96 h30', red: true },
  ],
};

function StepDrawing({ icon, reduce }: { icon: StepIcon; reduce: boolean }) {
  const strokes = DRAWINGS[icon];
  return (
    <svg viewBox="0 0 164 124" className="mx-auto mt-6 block h-auto w-full max-w-[420px]" fill="none" aria-hidden strokeLinecap="round" strokeLinejoin="round">
      {strokes.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          stroke={s.red ? 'var(--rgr-red)' : 'var(--rgr-black)'}
          strokeWidth={s.w ?? (s.red ? 1.4 : 1.2)}
          initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ pathLength: { duration: reduce ? 0 : 1.1, ease: EASE_DRAW, delay: reduce ? 0 : 0.1 + i * 0.14 }, opacity: { duration: 0.01, delay: reduce ? 0 : 0.1 + i * 0.14 } }}
        />
      ))}
    </svg>
  );
}
