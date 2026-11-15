import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { ParallaxImage } from '@/components/motion/Parallax';
import { Reveal, RevealImage } from '@/components/motion/Reveal';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { categories, categoryBySlug, coverOf, projectsOf, srcSetOf } from '@/data/content';
import NotFound from './NotFound';

export default function Categoria() {
  const { categoria } = useParams();
  const cat = categoryBySlug(categoria);
  if (!cat) return <NotFound />;
  const list = projectsOf(cat.slug);
  const head = cat.header ?? (list[0] ? coverOf(list[0]) : null);
  const others = categories.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <Seo title={`Progetti ${cat.title}`} description={`${list.length} progetti ${cat.title.toLowerCase()} di RGR Architetti, studio di architettura a Bergamo.`} image={head?.src} />
      <PageHeader
        kicker={`Progetti · ${String(list.length).padStart(2, '0')}`}
        title={[cat.title]}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/progetti', label: 'Progetti' },
        ]}
      />
      {head && (
        <div className="container-rgr">
          <RevealImage>
            <ParallaxImage src={head.src} srcSet={srcSetOf(head)} alt={`Progetti ${cat.title}`} className="aspect-[21/8] max-sm:aspect-[4/3]" eager />
          </RevealImage>
        </div>
      )}

      <section className="py-20 lg:py-28">
        <div className="container-rgr grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            return (
              <Reveal key={p.slug} delay={(i % 3) * 0.06}>
                <ProjectCard project={p} ratio="aspect-[4/3]" showCategory={false} headingLevel="h2" />
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="paper-grid border-t border-border py-20">
        <div className="container-rgr">
          <p className="label-tech">Altri ambiti</p>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {others.map((c) => (
              <li key={c.slug}>
                <Link to={`/progetti/${c.slug}`} className="group flex items-center justify-between py-6">
                  <span className="font-display text-[clamp(1.8rem,4vw,3.5rem)] font-bold uppercase text-rgr-black transition-all duration-500 group-hover:translate-x-3 group-hover:text-primary">{c.title}</span>
                  <span className="flex items-center gap-4 font-nav text-sm text-muted-foreground">
                    {String(c.projects.length).padStart(2, '0')}
                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
