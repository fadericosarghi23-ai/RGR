import { Link } from 'react-router-dom';
import { categoryBySlug, coverOf, projectUrl, srcSetOf, type Project } from '@/data/content';
import { cn } from '@/lib/utils';

type Props = { project: Project; className?: string; ratio?: string; showCategory?: boolean; sizes?: 'thumb' | 'full'; headingLevel?: 'h2' | 'h3' };

export function ProjectCard({ project, className, ratio = 'aspect-[4/5]', showCategory = true, sizes = 'thumb', headingLevel = 'h3' }: Props) {
  const img = coverOf(project);
  const H = headingLevel;
  return (
    <Link to={projectUrl(project)} className={cn('group block', className)}>
      <div className={cn('crop-marks relative', ratio)}>
        <div className="absolute inset-0 overflow-hidden bg-rgr-paper-2">
          {img && (
            <img
              src={sizes === 'thumb' ? img.thumb ?? img.src : img.src}
              srcSet={sizes === 'full' ? srcSetOf(img) : undefined}
              sizes={sizes === 'full' ? '(min-width: 1024px) 60vw, 100vw' : undefined}
              alt={`${project.title}, ${project.year}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
          )}
          <span className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <span className="font-nav text-sm tabular-nums text-primary">{project.year}</span>
        <div className="min-w-0">
          <H className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-rgr-black transition-colors group-hover:text-primary">{project.title}</H>
          {showCategory && <p className="label-tech mt-1 text-xs md:text-[0.62rem]">{categoryBySlug(project.category)?.title}</p>}
        </div>
      </div>
    </Link>
  );
}
