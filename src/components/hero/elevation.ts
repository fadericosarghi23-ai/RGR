/* ============================================================
   PROSPETTO, Casa di montagna in Valseriana (RGR Architetti)
   Ricalcato in coordinate pixel sulla foto originale dello slider
   del sito (public/img/home/slide-1.webp, 1320 x 700):
   il disegno combacia con la foto.
   Ogni gruppo è un array di "d" SVG, animati con pathLength = 1.
   ============================================================ */

export const ELEV_W = 1320;
export const ELEV_H = 700;

type Rect = [number, number, number, number]; // x1, y1, x2, y2

const r = (n: number) => Math.round(n * 10) / 10;
const line = (x1: number, y1: number, x2: number, y2: number) => `M${r(x1)} ${r(y1)}L${r(x2)} ${r(y2)}`;
const poly = (pts: number[][], close = false) => 'M' + pts.map((p) => `${r(p[0])} ${r(p[1])}`).join('L') + (close ? 'Z' : '');
const rect = ([x1, y1, x2, y2]: Rect) => poly([[x1, y1], [x2, y1], [x2, y2], [x1, y2]], true);
const inset = ([x1, y1, x2, y2]: Rect, d: number): Rect => [x1 + d, y1 + d, x2 - d, y2 - d];
const circle = (cx: number, cy: number, rr: number) => `M${cx - rr} ${cy}a${rr} ${rr} 0 1 0 ${rr * 2} 0a${rr} ${rr} 0 1 0 ${-rr * 2} 0`;

// generatore pseudo casuale deterministico (stesso disegno a ogni visita)
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

/* --- geometria delle falde --- */
// falda bassa: intradosso sinistro e destro
const lowUnderL = (x: number) => 448 - (x - 155) * (166 / 297);
const lowUnderR = (x: number) => 285 + (x - 470) * 0.213;
const lowTop = (x: number) => 258 + (x - 470) * 0.2202;
// falda alta: intradosso
const highUnder = (x: number) => 190 + (x - 600) * 0.1636;

/* --- aperture --- */
const W1: Rect = [385, 357, 470, 462];
const W2: Rect = [530, 345, 632, 447];
const W3: Rect = [381, 512, 468, 592];
const W4: Rect = [530, 498, 632, 585];
const DOOR: Rect = [697, 474, 720, 618];
const PORCH_GLASS: Rect = [880, 478, 928, 625];
const W_RIGHT: Rect = [1098, 480, 1146, 568];
const W_UP: Rect = [1040, 330, 1086, 398];
const PIL_L: Rect = [232, 460, 268, 632];
const PIL_P: Rect = [928, 432, 985, 640];
const PIL_R: Rect = [1185, 490, 1222, 650];
const holes: Rect[] = [W1, W2, W3, W4, DOOR, PORCH_GLASS, W_RIGHT];

const hitsHole = (x1: number, x2: number, y: number, list: Rect[], m = 7) =>
  list.find((h) => y > h[1] - m && y < h[3] + m && x2 > h[0] - m && x1 < h[2] + m);

/** corsi di pietra: segmenti orizzontali spezzati che saltano le aperture */
function stoneCourses(xa: number, xb: number, top: (x: number) => number, bottom: number, seed: number, list: Rect[] = holes, step = 12) {
  const rand = rng(seed);
  const out: string[] = [];
  const yMin = Math.min(top(xa), top(xb));
  for (let y = Math.ceil(yMin / step) * step + 4; y < bottom - 3; y += step) {
    let x = xa + rand() * 18;
    let d = '';
    while (x < xb - 6) {
      const len = 14 + rand() * 34;
      let x2 = Math.min(x + len, xb - 2);
      const okTop = top(x) + 5 < y && top(x2) + 5 < y;
      const hole = hitsHole(x, x2, y, list);
      if (hole) {
        x2 = Math.min(x2, hole[0] - 8);
      }
      if (okTop && x2 - x > 6) d += `M${r(x)} ${y}H${r(x2)}`;
      x = hole && x2 <= hole[0] - 8 ? hole[2] + 8 + rand() * 6 : x2 + 4 + rand() * 7;
    }
    if (d) out.push(d);
  }
  return out;
}

export function buildElevation() {
  /* 1. linea di terra e tratteggio del terreno */
  const ground: string[] = [line(0, 630, 1320, 630)];
  for (let x = 22; x < 1305; x += 15) ground.push(line(x, 634, x - 10, 646));

  /* 2. struttura: muri, pilastri, basamenti */
  const struct: string[] = [
    line(325, 628, 325, lowUnderL(325)),
    line(665, 628, 665, lowUnderR(665)),
    line(325, 628, 928, 628),
    line(985, 640, 1232, 640),
    rect(PIL_L),
    rect(PIL_P),
    rect(PIL_R),
    line(1232, 640, 1232, 470),
    line(612, 203, 612, 284),
    line(1120, 412, 1120, 330),
    line(190, 462, 325, 462),
  ];

  /* 3. coperture e camino */
  const roofs: string[] = [
    // falda bassa
    poly([[150, 432], [455, 252], [1015, 375], [1286, 468], [1279, 489], [1010, 400], [470, 285], [452, 282], [158, 452]], true),
    // falda alta
    poly([[512, 214], [598, 162], [1045, 238], [1197, 322], [1190, 343], [1040, 258], [600, 186], [520, 232]], true),
    // camino
    rect([707, 156, 770, 190]),
    line(700, 151, 777, 151),
    // teste delle travi sotto la falda sinistra
    ...[205, 255, 305, 355, 405].map((x) => line(x, lowUnderL(x), x, lowUnderL(x) + 11)),
    // mensole del volume in legno
    rect([805, 240, 835, 274]),
    rect([965, 266, 995, 296]),
  ];

  /* 4. aperture */
  const openings: string[] = [];
  for (const w of [W1, W2, W3, W4]) {
    openings.push(rect(w), rect(inset(w, 6)), line(w[0] - 12, w[3] + 6, w[2] + 5, w[3] + 6));
  }
  openings.push(
    rect(DOOR),
    rect(PORCH_GLASS),
    line(904, 478, 904, 625),
    rect(W_RIGHT),
    rect(inset(W_RIGHT, 5)),
    line(1095, 572, 1158, 572),
    rect(W_UP),
    line(1063, 330, 1063, 398),
    circle(848, 443, 22),
    line(848, 421, 848, 400),
    line(985, 418, 985, 640),
  );

  /* 5. retini: pietra a corsi e doghe di legno */
  const hatch: string[] = [
    ...stoneCourses(328, 662, (x) => (x <= 455 ? lowUnderL(x) : lowUnderR(x)), 626, 7),
    ...stoneCourses(668, 926, lowUnderR, 626, 11, [DOOR, PORCH_GLASS, [826, 421, 870, 465]]),
    ...stoneCourses(988, 1183, (x) => 400 + (x - 1010) * 0.332 + 6, 638, 23, [W_RIGHT]),
    ...stoneCourses(PIL_L[0] + 2, PIL_L[2] - 2, () => PIL_L[1], PIL_L[3], 31, [], 11),
    ...stoneCourses(PIL_P[0] + 2, PIL_P[2] - 2, () => PIL_P[1], PIL_P[3], 37, [], 11),
    ...stoneCourses(PIL_R[0] + 2, PIL_R[2] - 2, () => PIL_R[1], PIL_R[3], 41, [], 11),
  ];
  for (let y = 198; y < 352; y += 10) {
    const xs = Math.max(614, 470 + (y + 4 - 258) / 0.2202);
    const xe = Math.min(1118, 600 + (y - 4 - 190) / 0.1636);
    if (xe - xs < 8) continue;
    if (y > W_UP[1] - 4 && y < W_UP[3] + 4 && xe > W_UP[0]) {
      if (W_UP[0] - 6 > xs) hatch.push(line(xs, y, W_UP[0] - 6, y));
      if (xe > W_UP[2] + 6) hatch.push(line(W_UP[2] + 6, y, xe, y));
    } else hatch.push(line(xs, y, xe, y));
  }
  void highUnder;
  void lowTop;

  /* 6. contesto: crinale dei monti, alberi, antenna */
  const ctx: string[] = [
    poly([[0, 92], [40, 80], [70, 62], [100, 52], [140, 48], [170, 52], [190, 70], [198, 110], [215, 140], [250, 120], [300, 90], [340, 62], [380, 40], [410, 10], [430, 2], [455, 4], [480, 14], [520, 30], [560, 24], [600, 28], [640, 40], [690, 50], [730, 58], [790, 74], [850, 78], [890, 84], [940, 92], [1000, 104], [1060, 124], [1120, 148], [1180, 166], [1250, 182], [1320, 196]]),
    poly([[200, 250], [260, 236], [330, 228], [420, 232], [500, 226]]),
    poly([[930, 210], [1010, 222], [1100, 240], [1190, 262], [1320, 286]]),
    line(64, 625, 72, 130),
    line(110, 610, 118, 170),
    line(140, 570, 146, 250),
    line(72, 260, 30, 230),
    line(70, 330, 112, 300),
    line(116, 330, 160, 300),
    line(118, 240, 150, 205),
    poly([[1214, 452], [1246, 330], [1298, 452]]),
    line(641, 162, 641, 12),
    line(628, 22, 654, 22),
  ];

  /* 7. quote (in rosso), senza numeri: solo il segno grafico */
  const dims: string[] = [];
  const dy = 672;
  const ticks = [232, 325, 665, 928, 985, 1222];
  dims.push(line(ticks[0], dy, ticks[ticks.length - 1], dy));
  for (const x of ticks) dims.push(line(x - 6, dy + 6, x + 6, dy - 6), line(x, 646, x, dy + 8));
  const dx = 1296;
  dims.push(line(dx, 630, dx, 322));
  for (const y of [630, 468, 322]) dims.push(line(dx - 6, y + 6, dx + 6, y - 6), line(dx - 14, y, dx + 8, y));

  return { ground, struct, roofs, openings, hatch, ctx, dims };
}

export type Elevation = ReturnType<typeof buildElevation>;
