import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal } from '@/components/motion/Reveal';
import { content } from '@/data/content';

export default function Stampa() {
  return (
    <>
      <Seo title="Rassegna stampa" description="Dicono di noi: i progetti di RGR Architetti pubblicati su Interni, Arketipo, Divisare e sulle riviste di settore." />
      <PageHeader kicker="Dicono di noi" title={['Rassegna', 'stampa']} crumbs={[{ to: '/', label: 'Home' }]} />

      <section className="pb-20 lg:pb-28">
        <div className="container-rgr">
          <p className="label-tech">Online</p>
          <ul className="mt-6 border-t border-rgr-ink">
            {content.press.map((p, i) => (
              <li key={p.url} className="border-b border-border">
                <Reveal delay={i * 0.06}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="group grid items-center gap-6 py-8 md:grid-cols-12">
                    <div className="overflow-hidden md:col-span-3">
                      {p.image && <img src={p.image.src} alt={p.title} loading="lazy" className="aspect-[3/2] w-full object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" />}
                    </div>
                    <div className="md:col-span-8">
                      <p className="label-tech !text-primary">{p.source}</p>
                      <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold text-rgr-black transition-colors group-hover:text-primary">{p.title}</h2>
                      <p className="mt-3 max-w-2xl text-rgr-ink/80">{p.excerpt}</p>
                    </div>
                    <ArrowUpRight className="size-8 text-rgr-black transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary md:col-span-1 md:justify-self-end" aria-hidden />
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="paper-grid border-t border-border py-20 lg:py-28">
        <div className="container-rgr">
          <p className="label-tech">Su rivista</p>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {content.pressPages.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <Link to={`/rassegna-stampa/${p.slug}`} className="group block bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
                  <div className="relative flex gap-3 overflow-hidden">
                    {p.scans.slice(0, 2).map((s, k) => (
                      <img
                        key={s.src}
                        src={s.thumb ?? s.src}
                        alt=""
                        loading="lazy"
                        className="aspect-[3/4] w-1/2 object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ transformOrigin: k ? 'left center' : 'right center' }}
                      />
                    ))}
                    <span className="absolute inset-y-0 left-1/2 w-px bg-rgr-ink/20" />
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-6">
                    <div>
                      <h2 className="font-display text-3xl font-bold text-rgr-black group-hover:text-primary">{p.title}</h2>
                      <p className="mt-2 text-sm text-rgr-ink/80">{p.excerpt}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 font-nav text-xs uppercase tracking-[0.18em]">
                      {p.scans.length} pagine <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
