import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/ui/button-link';
import { EASE_DRAW, EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { quizCopy, quizQuestions, quizResults, type QuizDocs, type QuizNeed, type QuizResult, type QuizWho } from './copy';

type Answers = { who?: QuizWho; need?: QuizNeed; docs?: QuizDocs };

/** Regole di orientamento: portano sempre a una delle voci originali del sito. */
function resultOf(a: Answers): QuizResult {
  if (a.need === 'causa') return 'tribunale';
  if (a.who === 'legale' && a.need === 'valore') return 'tribunale';
  if (a.need === 'catasto') return 'catasto';
  if (a.need === 'valore') return 'perizie';
  return 'progettuale';
}

/**
 * 05 Consulenze e perizie: "Quale consulenza Le serve?".
 * Tre domande a scelta, barra di avanzamento, risultato con CTA verso i contatti.
 */
export function ConsultQuiz({ slug }: { slug: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion() ?? false;
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const total = quizQuestions.length;
  const done = step >= total;

  // sposta il focus sul titolo della nuova schermata (non al primo caricamento)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = window.setTimeout(() => heading.current?.focus({ preventScroll: true }), reduce ? 0 : 380);
    return () => window.clearTimeout(t);
  }, [step, reduce]);

  const choose = (key: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  };
  const restart = () => {
    setDir(-1);
    setAnswers({});
    setStep(0);
  };

  const progress = Math.min(step, total) / total;
  const offset = reduce ? 0 : 40;
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * offset }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -offset }),
  };

  const q = quizQuestions[step];
  const result = done ? resultOf(answers) : null;

  return (
    <div className="grid overflow-hidden border border-border bg-white lg:grid-cols-12">
      {/* colonna laterale: avanzamento */}
      <div className="paper-grid border-b border-border p-6 sm:p-8 lg:col-span-4 lg:border-b-0 lg:border-r lg:p-10">
        <p className="label-tech">{done ? quizCopy.resultLabel : quizCopy.questionOf(step + 1, total)}</p>
        <div
          role="progressbar"
          aria-label={quizCopy.progress}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={Math.min(step, total)}
          className="relative mt-5 h-[3px] bg-rgr-grey/35"
        >
          <motion.span
            className="absolute inset-y-0 left-0 block w-full origin-left bg-primary"
            initial={false}
            animate={{ scaleX: progress }}
            transition={{ duration: reduce ? 0 : 0.8, ease: EASE_DRAW }}
          />
        </div>
        <ol className="mt-8 hidden space-y-3 lg:block">
          {quizQuestions.map((qq, i) => {
            const value = answers[qq.key];
            const label = qq.options.find((o) => o.value === value)?.label;
            return (
              <li key={qq.key} className={cn('flex gap-3 text-sm leading-snug', i === step ? 'text-rgr-black' : 'text-muted-foreground')}>
                <span className={cn('font-nav text-xs tracking-[0.15em]', (i < step || done) && 'text-primary')}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  {qq.q}
                  {label && i < step && <span className="mt-0.5 block font-semibold text-rgr-black">{label}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* schermata corrente */}
      <div className="relative min-h-[420px] p-6 sm:p-8 lg:col-span-8 lg:p-12">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={done ? 'result' : `q-${step}`}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE_EXPO }}
          >
            {!done && q ? (
              <fieldset>
                <legend className="w-full">
                  <h3 ref={heading} tabIndex={-1} className="text-[clamp(1.6rem,3.2vw,2.6rem)] font-bold uppercase leading-[0.98] outline-none">
                    {q.q}
                  </h3>
                </legend>
                <div className="mt-8 grid gap-3">
                  {q.options.map((o, i) => {
                    const on = answers[q.key] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => choose(q.key, o.value)}
                        className={cn(
                          'group relative flex min-h-[56px] w-full items-center gap-4 overflow-hidden border px-5 py-3 text-left transition-colors duration-300',
                          on ? 'border-primary' : 'border-border hover:border-rgr-black',
                        )}
                      >
                        <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100" />
                        <span className="font-nav text-xs tracking-[0.15em] text-primary">{String.fromCharCode(65 + i)}</span>
                        <span className="flex-1 font-display text-lg font-medium leading-snug text-rgr-black">{o.label}</span>
                        <ArrowRight aria-hidden className="size-4 shrink-0 text-rgr-ink/40 transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary" />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : result ? (
              <div aria-live="polite">
                <p className="label-tech !text-primary">{quizCopy.resultLabel}</p>
                <h3 ref={heading} tabIndex={-1} className="mt-3 text-[clamp(1.7rem,3.6vw,3rem)] font-bold uppercase leading-[0.96] outline-none">
                  {quizResults[result].title}
                </h3>
                <motion.span
                  aria-hidden
                  className="mt-6 block h-px w-24 origin-left bg-primary"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE_DRAW, delay: 0.2 }}
                />
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-rgr-ink/85">{quizResults[result].text}</p>
                {answers.docs && <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{quizCopy.docs[answers.docs]}</p>}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <ButtonLink to={`/contatti?servizio=${slug}`}>
                    {quizCopy.cta}
                    <ArrowRight aria-hidden className="transition-transform duration-500 group-hover/btn:translate-x-1" />
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-[44px] items-center gap-2 px-2 font-nav text-[0.78rem] uppercase tracking-[0.2em] text-rgr-black transition-colors duration-300 hover:text-primary"
                  >
                    <RotateCcw aria-hidden className="size-4" />
                    {quizCopy.restart}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {!done && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex min-h-[44px] items-center gap-2 font-nav text-xs md:text-[0.72rem] uppercase tracking-[0.2em] text-rgr-black transition-colors duration-300 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft aria-hidden className="size-4" />
              {quizCopy.back}
            </button>
            {step > 0 && (
              <button
                type="button"
                onClick={restart}
                className="inline-flex min-h-[44px] items-center gap-2 font-nav text-xs md:text-[0.72rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-300 hover:text-primary"
              >
                <RotateCcw aria-hidden className="size-4" />
                {quizCopy.restart}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
