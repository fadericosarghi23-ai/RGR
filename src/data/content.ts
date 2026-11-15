// Accesso tipizzato ai contenuti importati dal sito attuale (scripts/import-content.mjs).
import raw from './content.json';

export type Img = { src: string; w: number; h: number; thumb?: string; tw?: number };

/** srcset: miniatura per schermi piccoli, originale per quelli grandi */
export const srcSetOf = (i?: Img | null) => (i?.thumb && i.tw && i.tw < i.w ? `${i.thumb} ${i.tw}w, ${i.src} ${i.w}w` : undefined);
export type Partner = { name: string; piva: string; cf: string; email: string };
export type Person = { name: string; slug: string; group: 'socie' | 'collaboratori' | string; bio: string; quote: string; photo: Img | null };
export type PressItem = { title: string; excerpt: string; url: string; source: string; image: Img | null };
export type PressPage = { slug: string; oldPath: string; title: string; excerpt: string; cover: Img | null; scans: Img[] };
export type CategorySlug = 'residenziale' | 'interior-design' | 'commerciale' | 'industriale';
export type Category = { slug: CategorySlug; oldPath: string; title: string; header: Img | null; projects: string[] };
export type Project = {
  slug: string;
  category: CategorySlug;
  oldPath: string;
  year: number;
  title: string;
  shortTitle: string;
  description: string;
  cover: Img | null;
  images: Img[];
};

type Content = {
  importedAt: string;
  site: {
    quote: string[];
    quoteAuthor: string;
    intro: string;
    services: string[];
    address: { street: string; cap: string; city: string };
    email: string;
    phone: string;
    partners: Partner[];
  };
  home: { slides: Img[]; studioPhoto: Img | null };
  team: Person[];
  press: PressItem[];
  pressPages: PressPage[];
  categories: Category[];
  projects: Project[];
};

export const content = raw as unknown as Content;
export const site = content.site;
export const team = content.team;
export const categories = content.categories;
export const projects = content.projects;

export const phoneHref = 'tel:' + site.phone.replace(/\s+/g, '');
export const mapsQuery = encodeURIComponent(`${site.address.street}, ${site.address.cap} ${site.address.city}`);

export const categoryBySlug = (slug?: string) => categories.find((c) => c.slug === slug);
export const projectBySlug = (slug?: string) => projects.find((p) => p.slug === slug);
export const projectsOf = (cat: CategorySlug) => projects.filter((p) => p.category === cat);
export const projectUrl = (p: Project) => `/progetti/${p.category}/${p.slug}`;
export const coverOf = (p: Project): Img | null => p.images[0] ?? p.cover;

/** Il sito originale scrive i titoli in maiuscolo: li mostriamo in maiuscoletto tipografico. */
export const displayTitle = (t: string) => t.replace(/\s+/g, ' ').trim();

export const yearsRange = (() => {
  const ys = projects.map((p) => p.year).filter(Boolean);
  return { from: Math.min(...ys), to: Math.max(...ys) };
})();
