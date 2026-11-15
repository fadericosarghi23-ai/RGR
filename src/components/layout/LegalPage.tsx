import { PageHeader } from './PageHeader';
import { Seo } from './Seo';
import { Reveal } from '@/components/motion/Reveal';
import { updated, type LegalSection } from '@/data/legal';

export function LegalPage({ title, description, sections }: { title: string; description: string; sections: LegalSection[] }) {
  return (
    <>
      <Seo title={title} description={description} />
      <PageHeader kicker={`Aggiornata al ${updated}`} title={[title]} crumbs={[{ to: '/', label: 'Home' }]} />
      <section className="pb-28">
        <div className="container-rgr grid gap-12 lg:grid-cols-12">
          <nav aria-label="Indice" className="lg:col-span-3">
            <ol className="label-tech space-y-2 lg:sticky lg:top-28">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`} className="hover:text-primary">
                    {String(i + 1).padStart(2, '0')} · {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-14 lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <Reveal key={s.title}>
                <section id={`s${i + 1}`} className="scroll-mt-28 border-t border-border pt-6">
                  <h2 className="font-display text-2xl font-bold uppercase">
                    <span className="mr-3 text-primary">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  {s.body.map((p) => (
                    <p key={p} className="mt-4 leading-relaxed text-rgr-ink/85">
                      {p}
                    </p>
                  ))}
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
