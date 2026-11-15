// Importa i contenuti reali di https://www.rgrarchitetti.it
// Testi completi, gallerie, foto (convertite in WebP < 300 KB).
// Uso: npm run import:content   (idempotente, cache in .import-cache)
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const BASE = 'https://www.rgrarchitetti.it';
const ROOT = path.resolve(import.meta.dirname, '..');
const CACHE = path.join(ROOT, '.import-cache');
const PUB = path.join(ROOT, 'public', 'img');
const OUT_JSON = path.join(ROOT, 'src', 'data', 'content.json');
const MAX_KB = 300;

await fs.mkdir(CACHE, { recursive: true });

/* ---------- utilità ---------- */
const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&rsquo;|&#8217;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&agrave;/g, 'à')
    .replace(/&egrave;/g, 'è')
    .replace(/&eacute;/g, 'é')
    .replace(/&igrave;/g, 'ì')
    .replace(/&ograve;/g, 'ò')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&Agrave;/g, 'À')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

// Regola agenzia: niente trattini lunghi o medi nei testi del sito.
// " – testo – " diventa ", testo, ". Ogni sostituzione viene annotata.
const dashLog = [];
const noDash = (s, where) => {
  if (!/[–—]/.test(s)) return s;
  dashLog.push(where);
  return s.replace(/\s*[–—]\s*/g, ', ').replace(/,\s*,/g, ',');
};

const clean = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').replace(/\s+([,.;:])/g, '$1').trim();

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’_]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|\s)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());

async function get(url) {
  const key = crypto.createHash('md5').update(url).digest('hex');
  const file = path.join(CACHE, key + '.bin');
  if (existsSync(file)) return fs.readFile(file);
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Altalogik import)' } });
      if (!r.ok) throw new Error(r.status + ' ' + url);
      const b = Buffer.from(await r.arrayBuffer());
      await fs.writeFile(file, b);
      return b;
    } catch (e) {
      if (i === 3) throw e;
      await new Promise((res) => setTimeout(res, 800 * (i + 1)));
    }
  }
}
const html = async (p) => (await get(BASE + p)).toString('utf8');

// Contenuto principale (senza header/footer/debugbar)
const stripCode = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const main = (h) => {
  let a = h.indexOf('id="sp-main-body"');
  a = a > 0 ? h.indexOf('>', a) + 1 : 0;
  const b = h.indexOf('<section id="sp-bottom"');
  return stripCode(h.slice(a, b > a ? b : undefined));
};
const lines = (h) =>
  decode(
    h
      .replace(/<(br|\/p|\/h\d|\/li|\/div|\/a)[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

/* ---------- immagini ---------- */
const jobs = [];
const imgMeta = {};
function image(url, outRel, { max = 1600, thumb = 0 } = {}) {
  const abs = url.startsWith('http') ? url : BASE + encodeURI(decodeURI(url));
  jobs.push({ abs, outRel, max, thumb });
  return outRel;
}
async function encode(buf, max, q0) {
  let q = q0;
  let size = max;
  for (let i = 0; i < 6; i++) {
    const out = await sharp(buf).rotate().resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toBuffer({ resolveWithObject: true });
    if (out.data.length <= MAX_KB * 1024 || i === 5) return out;
    if (q > 62) q -= 8;
    else size = Math.round(size * 0.85);
  }
}
async function runJobs() {
  let done = 0;
  const queue = [...jobs];
  const worker = async () => {
    while (queue.length) {
      const j = queue.shift();
      const out = path.join(PUB, j.outRel);
      const thumbOut = out.replace(/\.webp$/, '-t.webp');
      try {
        if (!existsSync(out) || (j.thumb && !existsSync(thumbOut))) {
          const buf = await get(j.abs);
          await fs.mkdir(path.dirname(out), { recursive: true });
          const big = await encode(buf, j.max, 78);
          await fs.writeFile(out, big.data);
          if (j.thumb) {
            const t = await encode(buf, j.thumb, 72);
            await fs.writeFile(thumbOut, t.data);
          }
        }
        const m = await sharp(out).metadata();
        const tm = j.thumb ? await sharp(thumbOut).metadata() : null;
        imgMeta[j.outRel] = { w: m.width, h: m.height, ...(tm ? { tw: tm.width } : {}) };
      } catch (e) {
        console.warn('  ! immagine non importata', j.abs, e.message);
        imgMeta[j.outRel] = null;
      }
      if (++done % 50 === 0) console.log(`  immagini ${done}/${jobs.length}`);
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
}

/* ---------- HOME ---------- */
console.log('Home');
const homeRaw = await html('/');
const home = main(homeRaw);
const homeLines = lines(home);
const qStart = homeLines.findIndex((l) => l.startsWith('Chi progetta'));
const quote = homeLines.slice(qStart, qStart + 3);
const quoteAuthor = homeLines[qStart + 3].replace(/["“”]/g, '').trim().replace('Exupery', 'Exupéry');
const intro = homeLines.find((l) => l.startsWith('Lo studio RGR nasce'));
const services = [...new Set([...home.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => clean(m[1])).filter(Boolean))];

const heroSlides = [...new Set([...homeRaw.matchAll(/background-image:\s*url\((https:\/\/www\.rgrarchitetti\.it\/images\/2021\/12\/21\/[^)]+)\)/g)].map((m) => m[1]))].map((u, i) =>
  image(u, `home/slide-${i + 1}.webp`, { max: 1920 }),
);
const studioPhoto = image('/images/2021/11/17/ufficio.jpg', 'home/studio.webp', { max: 1600, thumb: 900 });

// "Dicono di noi": ogni articolo è un blocco <h2><a>titolo</a></h2> <img> testo <a>Leggi tutto</a>
const press = [];
for (const seg of home.split(/<h2[^>]*>/).slice(1)) {
  if (!/Leggi tutto/.test(seg)) continue;
  const t = seg.match(/^\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
  const img = seg.match(/<img[^>]+src="([^"]+)"/);
  const more = [...seg.matchAll(/<a[^>]*href="([^"]+)"[^>]*>\s*(Leggi tutto[\s\S]*?)<\/a>/g)][0];
  if (!t || !img || !more) continue;
  const body = seg.slice(seg.indexOf('>', seg.indexOf(img[0])) + 1, seg.indexOf(more[0]));
  const i = press.length + 1;
  // Il sito attuale ha due link incoerenti (titolo verso Interni, "Leggi tutto" verso Arketipo):
  // teniamo il link del "Leggi tutto", che corrisponde al testo citato.
  const url = more[1];
  press.push({
    title: clean(t[2]),
    excerpt: noDash(clean(body), `Rassegna stampa: ${clean(t[2])}`),
    url,
    source: new URL(url).hostname.replace(/^www\./, ''),
    image: image(img[1], `stampa/articolo-${i}.webp`, { max: 1000 }),
  });
}

/* ---------- PAGINE STAMPA INTERNE (scansioni riviste) ---------- */
console.log('Rassegna stampa interna');
const pressPages = [];
for (const m of home.matchAll(/background-image:\s*url\(([^)]+)\);"[^>]*aria-label="([^"]+)"[\s\S]*?<h6[^>]*>([\s\S]*?)<\/h6>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<a[^>]*href="https?:\/\/(?:www\.)?rgrarchitetti\.it(\/[^"]+)"/g)) {
  const oldPath = m[5];
  const slug = oldPath.replace(/^\//, '');
  const page = main(await html(oldPath));
  const scans = [...new Set([...page.matchAll(/src="(\/media\/widgetkit\/[^"]+\.(?:jpe?g|png))"/g)].map((x) => x[1]))].map((u, i) =>
    image(u, `stampa/${slug}/pagina-${String(i + 1).padStart(2, '0')}.webp`, { max: 1800, thumb: 600 }),
  );
  pressPages.push({
    slug,
    oldPath,
    title: clean(m[3]),
    excerpt: clean(m[4]),
    cover: image(m[1], `stampa/${slug}/copertina.webp`, { max: 1200 }),
    scans,
  });
}

/* ---------- CHI SIAMO ---------- */
console.log('Chi siamo');
const chi = main(await html('/chi-siamo.html'));
const teamPhotos = [...chi.matchAll(/src="(\/images\/2021\/(?:08|03)\/\d+\/[^"]+\.(?:jpe?g|png))"/g)].map((m) => m[1]).filter((u) => !/rgr_log/.test(u));
const chiLines = lines(chi);
const team = [];
let group = 'socie';
for (const l of chiLines.slice(chiLines.indexOf('Incontra il team') + 1)) {
  if (/^Collaboratori$/i.test(l)) { group = 'collaboratori'; continue; }
  if (/^[“"]/.test(l)) { team.at(-1).quote = l.replace(/^[“"]|[”"]$/g, ''); continue; }
  if (/[<>{}]/.test(l)) continue;
  if (l.split(' ').length <= 3 && !/\./.test(l)) { team.push({ name: titleCase(l), group, bio: '', quote: '' }); continue; }
  if (team.length) team.at(-1).bio += (team.at(-1).bio ? ' ' : '') + l;
}
team.forEach((p, i) => {
  p.slug = slugify(p.name);
  p.photo = p.group === 'socie' && teamPhotos[i] ? image(teamPhotos[i], `studio/${p.slug}.webp`, { max: 900 }) : null;
  p.bio = noDash(p.bio, `Studio: ${p.name}`);
  p.quote = noDash(p.quote, `Studio: ${p.name}`);
});

/* ---------- CONTATTI + FOOTER ---------- */
console.log('Contatti');
const contRaw = await html('/contatti.html');
const contLines = lines(main(contRaw));
const email = (contRaw.match(/mailto:(info@[^"]+)"/) || [])[1];
const phone = contLines.find((l) => /^\+39[\d\s]+$/.test(l));
const footLines = lines(stripCode(homeRaw.slice(homeRaw.indexOf('<section id="sp-bottom"'), homeRaw.indexOf('phpdebugbar') > 0 ? homeRaw.indexOf('phpdebugbar') : undefined)));
const partners = [];
for (let i = 0; i < footLines.length; i++) {
  const m = footLines[i].match(/^P\.IVA:\s*(\d+)/);
  if (m) partners.push({ name: titleCase(footLines[i - 1]), piva: m[1], cf: footLines[i + 1].replace(/^CF:\s*/, ''), email: footLines[i + 2].replace(/^Email:\s*/, '') });
}
const address = { street: 'Via Teodoro Frizzoni, 22', cap: '24121', city: 'Bergamo' };
if (!footLines.includes(address.street)) console.warn('  ! indirizzo cambiato sul sito, verificare');

/* ---------- PROGETTI ---------- */
const CATS = [
  { slug: 'residenziale', oldPath: '/progetti-residenziali', title: 'Residenziale' },
  { slug: 'interior-design', oldPath: '/progetti-interior-design', title: 'Interior Design' },
  { slug: 'commerciale', oldPath: '/progetti-commerciale-e-direzione', title: 'Commerciale' },
  { slug: 'industriale', oldPath: '/progetti-industriali-rgr', title: 'Industriale' },
];
const projects = [];
const categories = [];
for (const c of CATS) {
  console.log('Categoria', c.title);
  const raw = await html(c.oldPath);
  const header = (raw.match(/sp-page-title"style="background-image: url\(([^)]+)\)/) || [])[1];
  const body = main(raw);
  // Ogni scheda: un'immagine di copertina seguita da un pulsante-link al progetto
  // ("2006 <BR/> TITOLO" oppure solo "Titolo" nelle pagine più vecchie).
  const list = [];
  let prevEnd = 0;
  for (const m of body.matchAll(/<a[^>]*href="https?:\/\/(?:www\.)?rgrarchitetti\.it(\/progetti-[a-z-]+\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const before = body.slice(prevEnd, m.index);
    prevEnd = m.index + m[0].length;
    const imgs = [...before.matchAll(/<img[^>]+src="([^"]+)"/g)];
    const oldPath = m[1];
    if (list.some((p) => p.oldPath === oldPath)) continue; // doppioni nell'elenco originale
    const label = m[2].split(/<br\s*\/?>/i).map(clean);
    const year = /^\d{4}$/.test(label[0]) ? Number(label[0]) : null;
    list.push({ cover: imgs.at(-1)?.[1] ?? null, oldPath, year, shortTitle: year ? label.slice(1).join(' ') : label.join(' ') });
  }
  const slugs = [];
  for (const item of list) {
    const raw2 = await html(item.oldPath);
    const heading = (raw2.match(/sp-page-title-heading">([\s\S]*?)<\/h2>/) || [])[1];
    const pageTitle = (raw2.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    const full = clean(heading || pageTitle || item.shortTitle);
    const title = full.replace(/^\d{4}\s*-\s*/, '').trim();
    item.year ??= Number((full.match(/^(\d{4})/) || [])[1]) || null;
    let slug = slugify(`${title}-${item.year}`);
    if (projects.some((p) => p.slug === slug)) slug = `${slug}-${c.slug}`;
    const pb = main(raw2);
    const gallery = [...pb.matchAll(/class="event-thumbnail[^"]*"\s+href="([^"]+)"[^>]*data-width="(\d+)"\s+data-height="(\d+)"/g)].map((g) => decode(g[1]));
    const uniq = [...new Set(gallery)];
    const text = lines(pb.replace(/<div class="eventgallery[\s\S]*$/, '')).filter((l) => l !== full && l !== heading);
    const images = uniq.map((u, i) => image(u, `progetti/${slug}/${String(i + 1).padStart(2, '0')}.webp`, { max: 1600, thumb: 720 }));
    projects.push({
      slug,
      category: c.slug,
      oldPath: item.oldPath,
      year: item.year,
      title,
      shortTitle: item.shortTitle,
      description: text.length ? noDash(text.join('\n'), `Progetto ${title}`) : '',
      cover: item.cover ? image(item.cover, `progetti/${slug}/copertina.webp`, { max: 1000 }) : null,
      images,
    });
    slugs.push(slug);
  }
  categories.push({ ...c, header: header ? image(header, `progetti/categoria-${c.slug}.webp`, { max: 1920, thumb: 900 }) : null, projects: slugs });
}

/* ---------- LOGO (raster originale, per confronto con l'SVG ridisegnato) ---------- */
await fs.mkdir(path.join(ROOT, 'scripts', 'reference'), { recursive: true });
for (const u of ['/images/2021/03/25/rgr_log_90.png', '/images/2021/rgr70test.png']) {
  await fs.writeFile(path.join(ROOT, 'scripts', 'reference', path.basename(u)), await get(BASE + u));
}

/* ---------- conversione immagini ---------- */
console.log(`Conversione di ${jobs.length} immagini in WebP...`);
await runJobs();

const withMeta = (rel) => (rel && imgMeta[rel] ? { src: '/img/' + rel, ...imgMeta[rel] } : null);
const withThumb = (rel) => {
  const m = withMeta(rel);
  return m ? { ...m, thumb: m.src.replace(/\.webp$/, '-t.webp') } : null;
};

const content = {
  importedAt: new Date().toISOString().slice(0, 10),
  source: BASE,
  site: { quote, quoteAuthor, intro, services, address, email, phone, partners },
  home: { slides: heroSlides.map(withMeta).filter(Boolean), studioPhoto: withThumb(studioPhoto) },
  team: team.map((p) => ({ ...p, photo: withMeta(p.photo) })),
  press: press.map((p) => ({ ...p, image: withMeta(p.image) })),
  pressPages: pressPages.map((p) => ({ ...p, cover: withMeta(p.cover), scans: p.scans.map(withThumb).filter(Boolean) })),
  categories: categories.map((c) => ({ ...c, header: withThumb(c.header) })),
  projects: projects.map((p) => ({ ...p, cover: withMeta(p.cover), images: p.images.map(withThumb).filter(Boolean) })),
};
await fs.mkdir(path.dirname(OUT_JSON), { recursive: true });
await fs.writeFile(OUT_JSON, JSON.stringify(content, null, 2));

const nImg = content.projects.reduce((n, p) => n + p.images.length, 0);
console.log(`\nFatto: ${content.projects.length} progetti, ${nImg} foto di galleria, ${content.team.length} persone, ${content.press.length} articoli, ${content.pressPages.length} pagine stampa.`);
if (dashLog.length) console.log('Trattini lunghi/medi sostituiti con virgole in:', [...new Set(dashLog)].join('; '));
