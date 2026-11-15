import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal, RevealImage } from '@/components/motion/Reveal';
import { ParallaxImage } from '@/components/motion/Parallax';
import { SplitTitle } from '@/components/motion/SplitTitle';
import { ButtonLink } from '@/components/ui/button-link';
import { projectUrl, type Project } from '@/data/content';
import { services, type Service } from '@/data/services';
import { EASE_DRAW, EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { serviceCopy } from './copy';
import { altOf, landscapeOf, projTitle, thumbOf } from './utils';

/* ------------------------------------------------------------------ titolo di sezione */
export function SectionHead({ label, title, intro, className }: { label: string; title: string[]; intro?: string; className?: string }) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <div className="mb-5 flex items-center gap-4">
        <motion.span
          aria-hidden
          className="block h-px w-10 origin-left bg-primary"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE_DRAW }}
        />
        <p className="label-tech">{label}</p>
      </div>
      <SplitTitle lines={title} className="text-[clamp(2rem,5vw,4.2rem)] font-bold uppercase leading-[0.95]" />
      {intro && (
        <Reveal delay={0.15} y={20}>
          <p className="mt-6 text-lg leading-relaxed text-rgr-ink/80">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ testo + "Comprende" */
export function ServiceBody({ service }: { service: Service }) {
  return (
    <section className="container-rgr grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
      <div className="lg:col-span-7">
        <p className="label-tech mb-6">{serviceCopy.bodyLabel}</p>
        <div className="space-y-6 text-lg leading-relaxed text-rgr-ink/90 lg:text-xl">
          {service.body.map((p, i) => (
            <Reveal key={i} delay={i * 0.08} y={24}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
      <aside className="lg:col-span-4 lg:col-start-9">
        <Reveal y={24} className="border-t border-rgr-black/80 pt-6">
          <p className="label-tech mb-5">{serviceCopy.itemsLabel}</p>
          <ul className="space-y-0">
            {service.items.map((it, i) => (
              <li key={it} className="flex items-baseline gap-4 border-b border-border py-4">
                <span className="font-nav text-xs tracking-[0.2em] text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-lg font-medium leading-snug text-rgr-black">{it}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </aside>
    </section>
  );
}

/* ------------------------------------------------------------------ foto reali dai progetti */
export function ServicePhotos({ projects }: { projects: Project[] }) {
  const [a, b] = projects;
  if (!a) return null;
  const la = landscapeOf(a);
  const lb = b ? landscapeOf(b) : null;
  return (
    <section className="container-rgr pb-20 lg:pb-28" aria-label={serviceCopy.photosLabel}>
      <p className="label-tech mb-6">{serviceCopy.photosLabel}</p>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <figure className={cn(lb ? 'lg:col-span-8' : 'lg:col-span-12')}>
          <Link to={projectUrl(a)} className="group block" aria-label={`${serviceCopy.photoLink}: ${projTitle(a)}`}>
            <RevealImage>
              <ParallaxImage
                src={la.img.src}
                alt={altOf(a, la.index)}
                width={la.img.w}
                height={la.img.h}
                className="aspect-[4/3] bg-rgr-paper-2 lg:aspect-[16/10]"
                imgClassName="transition-[filter] duration-700 group-hover:brightness-[0.92]"
              />
            </RevealImage>
            <PhotoCaption p={a} />
          </Link>
        </figure>
        {b && lb && (
          <figure className="lg:col-span-4">
            <Link to={projectUrl(b)} className="group block" aria-label={`${serviceCopy.photoLink}: ${projTitle(b)}`}>
              <RevealImage delay={0.15} className="overflow-hidden bg-rgr-paper-2">
                <img
                  src={b.images[0].src}
                  alt={altOf(b, 0)}
                  width={b.images[0].w}
                  height={b.images[0].h}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </RevealImage>
              <PhotoCaption p={b} />
            </Link>
          </figure>
        )}
      </div>
    </section>
  );
}

function PhotoCaption({ p }: { p: Project }) {
  return (
    <figcaption className="mt-4 flex items-start justify-between gap-4 border-t border-border pt-3">
      <span>
        <span className="label-tech block">{p.year}</span>
        <span className="mt-1 block font-display font-bold uppercase leading-tight text-rgr-black">{projTitle(p)}</span>
      </span>
      <span className="label-tech link-draw flex shrink-0 items-center gap-1 pb-0.5 !text-rgr-black group-hover:!text-primary">
        {serviceCopy.photoLink}
        <ArrowUpRight aria-hidden className="size-3.5" />
      </span>
    </figcaption>
  );
}

/* ------------------------------------------------------------------ progetti correlati */
export function RelatedProjects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section className="container-rgr py-20 lg:py-28">
      <SectionHead label={serviceCopy.relatedLabel} title={serviceCopy.relatedTitle} />
      <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p, i) => (
          <motion.li
            key={p.slug}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 1.1, ease: EASE_EXPO, delay: i * 0.07 }}
          >
              <Link to={projectUrl(p)} className="group block">
                <div className="crop-marks">
                  <div className="overflow-hidden bg-rgr-paper-2">
                    <img
                      src={thumbOf(p.images[0])}
                      alt={altOf(p, 0)}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                </div>
                <p className="label-tech mt-4">{p.year}</p>
                <h3 className="mt-1 text-lg font-bold uppercase leading-tight transition-colors duration-300 group-hover:text-primary">{projTitle(p)}</h3>
              </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ precedente / successivo */
export function ServicePager({ service }: { service: Service }) {
  const i = services.findIndex((s) => s.slug === service.slug);
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];
  return (
    <nav aria-label="Altri servizi" className="border-y border-border">
      <div className="container-rgr grid sm:grid-cols-2">
        <PagerLink to={prev} label={serviceCopy.prevLabel} dir="prev" />
        <PagerLink to={next} label={serviceCopy.nextLabel} dir="next" />
      </div>
    </nav>
  );
}

function PagerLink({ to, label, dir }: { to: Service; label: string; dir: 'prev' | 'next' }) {
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <Link
      to={`/servizi/${to.slug}`}
      rel={dir}
      className={cn(
        'group relative flex min-h-[44px] flex-col gap-2 overflow-hidden py-8 lg:py-12',
        dir === 'next' ? 'border-t border-border sm:items-end sm:border-l sm:border-t-0 sm:pl-8 sm:text-right' : 'sm:pr-8',
      )}
    >
      <span className="label-tech flex items-center gap-2">
        {dir === 'prev' && <Icon aria-hidden className="size-3.5 transition-transform duration-500 group-hover:-translate-x-1" />}
        {label}
        {dir === 'next' && <Icon aria-hidden className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />}
      </span>
      <span className="flex items-baseline gap-3 font-display text-2xl font-bold uppercase leading-tight text-rgr-black transition-colors duration-300 group-hover:text-primary lg:text-4xl">
        <span className="font-nav text-sm font-normal tracking-[0.2em] text-primary">{to.n}</span>
        {to.title}
      </span>
      <span
        aria-hidden
        className={cn(
          'absolute bottom-0 h-px w-full scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100',
          dir === 'prev' ? 'left-0 origin-left' : 'right-0 origin-right',
        )}
      />
    </Link>
  );
}

/* ------------------------------------------------------------------ chiamata all'azione */
export function ServiceCta({ kicker, title, text, button, to }: { kicker: string; title: string[]; text: string; button: string; to: string }) {
  return (
    <section className="paper-grid relative overflow-hidden py-24 lg:py-32">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <motion.line
          x1="0" y1="85%" x2="100%" y2="85%" stroke="var(--rgr-grey)" strokeWidth="1"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE_DRAW }}
        />
        <motion.line
          x1="92%" y1="0" x2="92%" y2="100%" stroke="var(--rgr-grey)" strokeWidth="1"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE_DRAW, delay: 0.2 }}
        />
      </svg>
      <div className="container-rgr relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="label-tech mb-5 !text-primary">{kicker}</p>
          <SplitTitle lines={title} className="text-[clamp(2.2rem,6vw,5.5rem)] font-bold uppercase leading-[0.92]" />
        </div>
        <Reveal className="lg:col-span-4" y={24}>
          <p className="text-lg leading-relaxed text-rgr-ink/85">{text}</p>
          <ButtonLink to={to} className="mt-8">
            {button}
            <ArrowRight aria-hidden className="transition-transform duration-500 group-hover/btn:translate-x-1" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ cornice delle sezioni interattive */
export function InteractiveFrame({ label, title, intro, children }: { label: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section className="relative border-t border-border bg-rgr-paper-2/60 py-20 lg:py-28">
      <div className="container-rgr">
        <SectionHead label={label} title={[title]} intro={intro} />
        <div className="mt-12 lg:mt-16">{children}</div>
      </div>
    </section>
  );
}
