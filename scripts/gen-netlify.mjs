// Genera netlify.toml: build, Node, 301 dai vecchi URL Joomla, fallback SPA.
import fs from 'node:fs';
const c = JSON.parse(fs.readFileSync('src/data/content.json', 'utf8'));
const r = [];
const add = (from, to) => r.push(`[[redirects]]\n  from = "${from}"\n  to = "${to}"\n  status = 301\n  force = true\n`);
add('/index.php', '/');
add('/home', '/');
add('/chi-siamo.html', '/studio');
add('/chi-siamo', '/studio');
add('/progetti.html', '/progetti');
add('/contatti.html', '/contatti');
for (const cat of c.categories) add(cat.oldPath, `/progetti/${cat.slug}`);
add('/progetti-industriali', '/progetti/industriale');
for (const p of c.projects) add(p.oldPath, `/progetti/${p.category}/${p.slug}`);
for (const p of c.pressPages) add(p.oldPath, `/rassegna-stampa/${p.slug}`);
// varianti con .html e slash finale prodotte da Joomla
const extra = [];
for (const line of r.join('').matchAll(/from = "([^"]+)"\n  to = "([^"]+)"/g)) {
  const [, from, to] = line;
  if (from === '/contatti' || from.endsWith('.html') || from === '/') continue;
  extra.push(`[[redirects]]\n  from = "${from}/"\n  to = "${to}"\n  status = 301\n  force = true\n`);
}
const toml = `# Generato da scripts/gen-netlify.mjs
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/img/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Frame-Options = "SAMEORIGIN"

# ---- 301 dai vecchi indirizzi del sito Joomla ----
${r.join('\n')}
${extra.join('\n')}
# ---- pagine del sito (single page app) ----
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
fs.writeFileSync('netlify.toml', toml);
console.log('redirect 301:', r.length + extra.length);

// ---- sitemap.xml e robots.txt ----
const SITE = 'https://www.rgrarchitetti.it';
const services = ['progettazione', 'ristrutturazione-e-recupero', 'interior-design', 'direzione-lavori', 'consulenze'];
const urls = [
  '/', '/studio', '/servizi', ...services.map((s) => `/servizi/${s}`),
  '/progetti', ...c.categories.map((x) => `/progetti/${x.slug}`),
  ...c.projects.map((p) => `/progetti/${p.category}/${p.slug}`),
  '/rassegna-stampa', ...c.pressPages.map((p) => `/rassegna-stampa/${p.slug}`),
  '/contatti', '/privacy', '/cookie',
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync('public/sitemap.xml', sitemap);
fs.writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('sitemap:', urls.length, 'indirizzi');
