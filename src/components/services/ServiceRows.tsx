import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '@/data/services';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { indexCopy } from './copy';
import { altOf, serviceProjects, thumbOf } from './utils';

const photos = services.map((s) => {
  const p = serviceProjects(s)[0];
  return p ? { src: thumbOf(p.images[0]), alt: altOf(p, 0) } : null;
});

/**
 * Elenco delle aree a righe grandi. Ogni riga ha la sua foto in una colonna fissa:
 * in grigio a riposo, a colori all'hover, mentre la riga scorre e una linea rossa si traccia.
 */
export function ServiceRows() {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className="relative">
      <p className="label-tech mb-4">{indexCopy.rowsLabel}</p>
      <ul className="border-t border-rgr-black/80">
        {services.map((s, i) => {
          const ph = photos[i];
          return (
            <motion.li
              key={s.slug}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1, ease: EASE_EXPO, delay: i * 0.06 }}
              className="relative border-b border-border"
            >
              <Link to={`/servizi/${s.slug}`} className="group relative block py-6 outline-offset-[-2px] lg:py-8">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8">
                  <span className="self-start pt-2 font-nav text-sm tracking-[0.2em] text-primary lg:col-span-1 lg:self-center lg:pt-0">{s.n}</span>

                  <div
                    className={cn(
                      'min-w-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:col-span-5',
                      !reduce && 'group-hover:translate-x-3 group-focus-visible:translate-x-3',
                    )}
                  >
                    <h2 className="text-[clamp(1.35rem,4.2vw,3.4rem)] font-bold uppercase leading-[0.95] transition-colors duration-300 hyphens-auto [overflow-wrap:anywhere] group-hover:text-primary">
                      {s.title}
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground lg:hidden">{s.items.join(' · ')}</p>
                  </div>

                  <ul className="hidden lg:col-span-3 lg:block">
                    {s.items.map((it) => (
                      <li key={it} className="label-tech text-xs md:text-[0.66rem] leading-relaxed">
                        {it}
                      </li>
                    ))}
                  </ul>

                  {/* foto in posizione fissa */}
                  <div className="hidden lg:col-span-2 lg:block">
                    {ph && (
                      <div className="crop-marks aspect-[4/3]">
                        <div className="relative h-full overflow-hidden bg-rgr-paper-2">
                          <img
                            src={ph.src}
                            alt={ph.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full scale-110 object-cover grayscale transition-[scale,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:grayscale-0 group-focus-visible:scale-100 group-focus-visible:grayscale-0"
                          />
                          <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="col-start-3 row-start-1 grid size-11 place-items-center self-center border border-rgr-black/20 text-rgr-black transition-colors duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-white lg:col-span-1 lg:col-start-12 lg:justify-self-end">
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
                    <span className="sr-only">{indexCopy.rowCta}</span>
                  </span>
                </div>
                {/* linea rossa che si traccia */}
                <span
                  aria-hidden
                  className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
