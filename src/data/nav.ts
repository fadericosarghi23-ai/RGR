import { categories, projectsOf, coverOf, projects } from './content';
import { services } from './services';

export type NavChild = { to: string; label: string; meta?: string; image?: string };
export type NavItem = { to: string; label: string; children?: NavChild[] };

const firstImage = (slug: string) => {
  const p = projects.find((x) => x.slug === slug);
  return p ? coverOf(p)?.thumb ?? coverOf(p)?.src : undefined;
};

export const nav: NavItem[] = [
  { to: '/studio', label: 'Studio' },
  {
    to: '/servizi',
    label: 'Servizi',
    children: services.map((s) => ({ to: `/servizi/${s.slug}`, label: s.title, meta: s.n, image: firstImage(s.photoProjects[0]) })),
  },
  {
    to: '/progetti',
    label: 'Progetti',
    children: categories.map((c) => {
      const list = projectsOf(c.slug);
      return { to: `/progetti/${c.slug}`, label: c.title, meta: String(list.length).padStart(2, '0'), image: list[0] ? coverOf(list[0])?.thumb : undefined };
    }),
  },
  { to: '/rassegna-stampa', label: 'Rassegna stampa' },
];
