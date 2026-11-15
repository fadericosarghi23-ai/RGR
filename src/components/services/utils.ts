import { projectBySlug, projects, displayTitle, type Img, type Project } from '@/data/content';
import type { Service } from '@/data/services';

/** Titolo leggibile: il sito originale usa "_" al posto dell'apostrofo negli slug importati. */
export const projTitle = (p: Project) => displayTitle(p.title).replace(/_/g, '’').replace(/'/g, '’');

/** Progetti reali collegati al servizio (solo quelli esistenti e con foto). */
export const serviceProjects = (s: Service): Project[] =>
  s.photoProjects.map((slug) => projectBySlug(slug)).filter((p): p is Project => !!p && p.images.length > 0);

/** Prima foto orizzontale del progetto (utile per riquadri larghi), altrimenti la prima. */
export const landscapeOf = (p: Project): { img: Img; index: number } => {
  const i = p.images.findIndex((im) => im.w > im.h * 1.15);
  const index = i >= 0 ? i : 0;
  return { img: p.images[index], index };
};

export const altOf = (p: Project, index: number) => `${projTitle(p)}, foto ${index + 1}`;

export const thumbOf = (img: Img) => img.thumb ?? img.src;

/* ------------------------------------------------------------------ classificazione per ambiente */
export type Ambient = 'casa' | 'ristorazione' | 'uffici' | 'commerciale' | 'outdoor';
export const ambients: { id: Ambient; label: string }[] = [
  { id: 'casa', label: 'Casa' },
  { id: 'ristorazione', label: 'Ristorazione' },
  { id: 'uffici', label: 'Uffici' },
  { id: 'commerciale', label: 'Commerciale' },
  { id: 'outdoor', label: 'Outdoor' },
];

const RULES: [Ambient, RegExp][] = [
  ['outdoor', /\bOUTDOOR\b/],
  ['ristorazione', /\b(RISTORANTE|BISTROT|MENSA|PASTICCERIA|RISTOBIO)\b/],
  ['uffici', /\bUFFICI\b/],
  ['commerciale', /\b(NEGOZIO|GUEST HOUSE|RADICIFILL)\b/],
  ['casa', /\b(APPARTAMENT[OI]|VILLETTA|VILLA|CASA|PALAZZO|RECUPERO|ATTICO|LOFT)\b/],
];

/** Classifica un progetto in base al titolo; in mancanza di parole chiave usa la categoria. */
export const ambientOf = (p: Project): Ambient => {
  const t = p.title.toUpperCase();
  for (const [a, re] of RULES) if (re.test(t)) return a;
  return p.category === 'commerciale' ? 'commerciale' : 'casa';
};

/** Progetti di interni e commerciali, cioè quelli dell'area Interior design e allestimenti. */
export const interiorProjects = projects.filter((p) => (p.category === 'interior-design' || p.category === 'commerciale') && p.images.length > 0);

/** true su dispositivi con puntatore preciso e hover reale */
export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
