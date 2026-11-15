import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { EASE_EXPO } from '@/lib/motion';

type Crumb = { to: string; label: string };
type Props = { kicker?: string; title: string[]; lead?: ReactNode; crumbs?: Crumb[]; children?: ReactNode };

/**
 * Testata di pagina "da tavola": foglio millimetrato, linee di costruzione che si tracciano,
 * titolo che sale dalla maschera.
 */
export function PageHeader({ kicker, title, lead, crumbs, children }: Props) {
  return (
    <header className="paper-grid relative overflow-hidden pb-14 pt-[130px] lg:pb-20 lg:pt-[170px]">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <motion.line
          x1="0" y1="99.5%" x2="100%" y2="99.5%"
          stroke="var(--rgr-grey)" strokeWidth="1" strokeDasharray="1 0"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
        />
        <motion.line
          x1="8%" y1="0" x2="8%" y2="100%"
          stroke="var(--rgr-grey)" strokeWidth="1"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
        />
        <motion.line
          x1="0" y1="99.5%" x2="34%" y2="99.5%"
          stroke="var(--rgr-red)" strokeWidth="2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.9 }}
        />
      </svg>
      <div className="container-rgr relative">
        {crumbs && (
          <motion.nav aria-label="Percorso" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-4">
            <ol className="label-tech flex flex-wrap gap-x-2 items-center">
              {crumbs.map((c) => (
                <li key={c.to} className="after:ml-2 after:content-['/']">
                  <Link to={c.to} className="inline-block py-2.5 hover:text-primary">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </motion.nav>
        )}
        {kicker && (
          <motion.p className="label-tech mb-5 !text-primary" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.2 }}>
            {kicker}
          </motion.p>
        )}
        <SplitTitle as="h1" lines={title} inView={false} delay={0.25} className="max-w-5xl text-[clamp(2.6rem,8vw,7.5rem)] font-bold uppercase leading-[0.92]" />
        {lead && (
          <motion.div
            className="mt-8 max-w-2xl text-lg leading-relaxed text-rgr-ink/85 lg:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_EXPO, delay: 0.55 }}
          >
            {lead}
          </motion.div>
        )}
        {children}
      </div>
    </header>
  );
}
