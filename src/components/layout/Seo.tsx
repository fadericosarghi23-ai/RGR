import { useEffect } from 'react';

type Props = { title: string; description?: string; image?: string };

const SUFFIX = ' | RGR Architetti Bergamo';

/** Titolo e meta description per pagina (il sito attuale li ha identici ovunque). */
export function Seo({ title, description, image }: Props) {
  useEffect(() => {
    document.title = title.includes('RGR') ? title : title + SUFFIX;
    const set = (sel: string, attr: string, val?: string) => {
      if (!val) return;
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = attr.split('=');
        el.setAttribute(k, v);
        document.head.appendChild(el);
      }
      el.content = val;
    };
    set('meta[name="description"]', 'name=description', description);
    set('meta[property="og:title"]', 'property=og:title', document.title);
    set('meta[property="og:description"]', 'property=og:description', description);
    set('meta[property="og:image"]', 'property=og:image', image);
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement('link');
      canon.rel = 'canonical';
      document.head.appendChild(canon);
    }
    canon.href = 'https://www.rgrarchitetti.it' + window.location.pathname;
  }, [title, description, image]);
  return null;
}
