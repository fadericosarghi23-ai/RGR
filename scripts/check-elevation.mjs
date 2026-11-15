// Sovrappone il prospetto SVG alla foto per controllarne l'allineamento.
import sharp from 'sharp';
import { buildElevation, ELEV_W, ELEV_H } from '../src/components/hero/elevation.ts';
const e = buildElevation();
const col = { ground: '#00f', struct: '#f0f', roofs: '#0a0', openings: '#f80', hatch: '#06c', ctx: '#555', dims: '#f00' };
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ELEV_W}" height="${ELEV_H}">`;
for (const [k, arr] of Object.entries(e)) for (const d of arr) svg += `<path d="${d}" fill="none" stroke="${col[k]}" stroke-width="${k === 'hatch' ? 1 : 2}"/>`;
svg += '</svg>';
await sharp('public/img/home/slide-1.webp').modulate({ brightness: 1.15, saturation: 0.3 }).composite([{ input: Buffer.from(svg) }]).png().toFile('scripts/reference/elevation-check.png');
let solo = `<svg xmlns="http://www.w3.org/2000/svg" width="${ELEV_W}" height="${ELEV_H}"><rect width="100%" height="100%" fill="#fff"/>`;
for (const [k, arr] of Object.entries(e)) for (const d of arr) solo += `<path d="${d}" fill="none" stroke="${k === 'dims' ? '#F4171C' : '#252525'}" stroke-width="${k === 'hatch' || k === 'ctx' ? 0.6 : 1.2}"/>`;
await sharp(Buffer.from(solo + '</svg>')).png().toFile('scripts/reference/elevation-solo.png');
console.log('paths', Object.fromEntries(Object.entries(e).map(([k, v]) => [k, v.length])));
