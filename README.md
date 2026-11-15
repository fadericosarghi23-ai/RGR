# RGR Architetti, nuovo sito

Proposta di rifacimento del sito di RGR Architetti (Bergamo), a cura di Altalogik.

Stack: Vite, React, TypeScript, Tailwind v4, struttura shadcn (`components/ui`, alias `@/`, `components.json`), framer-motion, GSAP e Lenis.

## Comandi

```bash
npm ci
npm run dev          # sviluppo
npm run build        # tsc + build di produzione in dist/
npm run preview      # anteprima della build
```

## Contenuti

- `npm run import:content` rilegge il sito attuale (rgrarchitetti.it) e rigenera `src/data/content.json` e le foto WebP in `public/img` (cache in `.import-cache`).
- `node scripts/trace-logo.mjs` vettorializza il logo originale (PNG) in `src/components/brand/logo-paths.ts`.
- `node scripts/gen-netlify.mjs` rigenera `netlify.toml` con i redirect 301 dai vecchi indirizzi Joomla.

## Testi da far confermare al cliente

- `src/data/services.ts` e `src/components/services/copy.ts`: testi dei servizi scritti da Altalogik.
- `src/data/legal.ts`: privacy e cookie policy.

## Pubblicazione

Netlify: comando `npm run build`, cartella `dist`, Node 22 (vedi `netlify.toml`). Il modulo contatti usa Netlify Forms: attivare le notifiche email dal pannello Netlify.
