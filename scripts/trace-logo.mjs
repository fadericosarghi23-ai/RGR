// Vettorializza il logo originale (solo PNG sul sito attuale) in SVG fedele.
// Separa il grigio (RGR) dal rosso (ARCHITETTI + linea) e li traccia con potrace.
// Uscita: src/components/brand/logo-paths.ts
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import potrace from 'potrace';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'scripts/reference/rgr_log_90.png');
const SCALE = 8;

const { data, info } = await sharp(SRC).ensureAlpha().resize({ width: 251 * SCALE, kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;

function mask(test) {
  const out = Buffer.alloc(W * H * 3, 255);
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    if (a > 110 && test(r, g, b)) out.fill(0, i * 3, i * 3 + 3);
  }
  return sharp(out, { raw: { width: W, height: H, channels: 3 } }).blur(5).png().toBuffer();
}
const isRed = (r, g, b) => r > 150 && g < 120 && b < 120;
const isGrey = (r, g, b) => !isRed(r, g, b) && Math.abs(r - b) < 40 && r < 225;

const trace = (buf) =>
  new Promise((res, rej) =>
    potrace.trace(buf, { turdSize: 40, optTolerance: 1.2, alphaMax: 1.1, threshold: 128 }, (e, svg) => (e ? rej(e) : res(svg))),
  );

// riporta le coordinate alla scala originale (viewBox 251 x 90)
const rescale = (d) => d.replace(/-?\d+(\.\d+)?/g, (n) => String(Math.round((Number(n) / SCALE) * 100) / 100));
const pathsOf = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => rescale(m[1]));

const grey = pathsOf(await trace(await mask(isGrey)));
const red = pathsOf(await trace(await mask(isRed)));

const out = `// Generato da scripts/trace-logo.mjs a partire dal logo originale (PNG) di rgrarchitetti.it.
// viewBox 0 0 251 90. Non modificare a mano: rieseguire lo script.
export const LOGO_VIEWBOX = '0 0 251 90';
export const LOGO_GREY = ${JSON.stringify(grey, null, 2)};
export const LOGO_RED = ${JSON.stringify(red, null, 2)};
`;
await fs.mkdir(path.join(ROOT, 'src/components/brand'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'src/components/brand/logo-paths.ts'), out);
console.log('grigio:', grey.length, 'path; rosso:', red.length, 'path');
