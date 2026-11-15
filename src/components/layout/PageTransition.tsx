import { motion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const CURTAIN = [0.77, 0, 0.175, 1] as const;
let firstPaint = true;

/**
 * Transizione tra pagine: un foglio millimetrato copre la pagina mentre una linea rossa
 * (la linea del logo) la attraversa, poi si solleva sulla pagina nuova.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [skipEnter] = useState(() => {
    const v = firstPaint;
    firstPaint = false;
    return v;
  });
  const reduced = prefersReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <motion.div initial="initial" animate="enter" exit="exit">
      {children}
      {/* entra coprendo (uscita della pagina vecchia) */}
      <motion.div
        aria-hidden
        className="paper-grid pointer-events-none fixed inset-0 z-[80]"
        variants={{ initial: { clipPath: 'inset(100% 0 0 0)' }, enter: { clipPath: 'inset(100% 0 0 0)' }, exit: { clipPath: 'inset(0% 0 0 0)' } }}
        transition={{ duration: 0.65, ease: CURTAIN }}
      >
        <motion.span
          className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-primary"
          variants={{ initial: { scaleX: 0 }, enter: { scaleX: 0 }, exit: { scaleX: 1 } }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.div>
      {/* si solleva sulla pagina nuova */}
      {!skipEnter && (
        <motion.div
          aria-hidden
          className="paper-grid pointer-events-none fixed inset-0 z-[80]"
          variants={{ initial: { clipPath: 'inset(0% 0 0% 0)' }, enter: { clipPath: 'inset(0% 0 100% 0)' }, exit: { clipPath: 'inset(0% 0 100% 0)' } }}
          transition={{ duration: 0.75, ease: CURTAIN, delay: 0.1 }}
        >
          <motion.span
            className="absolute left-0 top-1/2 h-[2px] w-full origin-right bg-primary"
            variants={{ initial: { scaleX: 1 }, enter: { scaleX: 0 }, exit: { scaleX: 0 } }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
