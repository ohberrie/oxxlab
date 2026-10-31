import { useEffect, useRef } from 'react';
import { oxx } from '../tokens';
import { OXX_PATTERN } from '../oxxPattern';

// A full-screen grid of O/X glyph cells driven by a density field.
// Density (0–1) picks a glyph from a 5-step ladder: · / + then o ◎ (O family)
// or x ✖ (X family). The active lab system (mode) and a pointer trail shape the
// field. The OXX wordmark sits in a quiet zone as solid cell-sized blocks; the pointer
// scatters it (blocks flip to the other letter's glyph or break into / + debris) and it
// reassembles into solid blocks as the disturbance fades.
// A hairline rule can run behind the wordmark. Panels (the entry cards) are hidden at rest;
// the active one replaces the field cell by cell, sweeping outward from the wordmark, with no
// gaps between cells so it reads as one sheet, while its own field pattern (panelModes) spreads
// out from it and the stretch of rule joining it to the wordmark lights up.
// Rects in `clear` are kept empty of field glyphs. With `ambient` off there is no resting field
// and no pointer trail: only the wordmark reacts until a panel's pattern is called up.

export type FieldMode = 'field' | 'select' | 'dense' | 'modular' | 'layer';
const MODES: FieldMode[] = ['field', 'select', 'dense', 'modular', 'layer'];

export interface Grid { cols: number; rows: number; cell: number; width: number; height: number }
export interface LogoPlacement { col: number; row: number; scale: number }
export interface Rect { col: number; row: number; w: number; h: number }

export function computeGrid(width: number, height: number): Grid {
  const cell = Math.max(10, Math.min(15, Math.round(width / 110)));
  return { cell, cols: Math.ceil(width / cell), rows: Math.ceil(height / cell), width, height };
}

// ─── NOISE ──────────────────────────────────────────────────────

function hash(x: number, y: number, z: number) {
  let h = Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const fade = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, v: number) => fade(Math.min(1, Math.max(0, (v - a) / (b - a))));

function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), xf), lerp(c(0, 1, 0), c(1, 1, 0), xf), yf),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), xf), lerp(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  );
}

const fbm = (x: number, y: number, z: number) => 0.65 * noise3(x, y, z) + 0.35 * noise3(x * 2 + 17, y * 2 + 31, z * 1.7);

// ─── GLYPHS ─────────────────────────────────────────────────────

type DrawGlyph = (g: CanvasRenderingContext2D, c: number, u: number) => void;

const line = (g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
};
const cross = (g: CanvasRenderingContext2D, c: number, r: number) => {
  line(g, c - r, c - r, c + r, c + r); line(g, c + r, c - r, c - r, c + r);
};
const circle = (g: CanvasRenderingContext2D, c: number, r: number, fill = false) => {
  g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); if (fill) g.fill(); else g.stroke();
};

// Drawn in an s×s box; c = centre, u = s/16.
const GLYPHS: Record<string, DrawGlyph> = {
  dot: (g, c, u) => g.fillRect(c - 1.2 * u, c - 1.2 * u, 2.4 * u, 2.4 * u),
  slash: (g, c, u) => { g.lineWidth = 1.4 * u; line(g, c - 4 * u, c + 4 * u, c + 4 * u, c - 4 * u); },
  plus: (g, c, u) => { g.lineWidth = 1.5 * u; line(g, c - 4 * u, c, c + 4 * u, c); line(g, c, c - 4 * u, c, c + 4 * u); },
  ring: (g, c, u) => { g.lineWidth = 2 * u; circle(g, c, 4.2 * u); },
  smallX: (g, c, u) => { g.lineWidth = 2.4 * u; cross(g, c, 3.6 * u); },
  target: (g, c, u) => { g.lineWidth = 1.9 * u; circle(g, c, 5.6 * u); circle(g, c, 2.3 * u, true); },
  heavyX: (g, c, u) => { g.lineWidth = 3.6 * u; cross(g, c, 4.6 * u); },
};

// Level 1–5 → [O family, X family]. Levels 1–3 are shared "debris" marks.
const LADDER: [string, string][] = [
  ['', ''], ['dot', 'dot'], ['slash', 'slash'], ['plus', 'plus'], ['ring', 'smallX'], ['target', 'heavyX'],
];
const LEVEL_ALPHA = [0, 0.4, 0.55, 0.7, 0.9, 1];
const TOP = LADDER.length - 1;

// sprites[tone][level][family]
function buildSprites(size: number) {
  return [oxx.paper, oxx.accent].map(color => LADDER.map((pair, level) => pair.map(name => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    if (!name) return canvas;
    const g = canvas.getContext('2d')!;
    g.globalAlpha = LEVEL_ALPHA[level];
    g.fillStyle = g.strokeStyle = color;
    GLYPHS[name](g, size / 2, size / 16);
    return canvas;
  })));
}

// ─── COMPONENT ──────────────────────────────────────────────────

const FRAME_MS = 50; // ~20fps: a stepped, digital cadence rather than smooth motion
const INTRO_MS = 1400;
const QUIET = 3;          // cells around the wordmark kept clear of the field
const FADE = 9;           // the field fades back in between QUIET and FADE
const SCATTER_DECAY = 0.955; // ~2s for a scattered letter to fully reassemble

const PANEL_EASE = 0.3;

export interface Rule { row: number; col0: number; col1: number }
const FOCUS_EASE = 0.07; // the panel's pattern spreads over about a second

export function GlyphField({ grid, logo, mode, panels = [], panelModes = [], clear = [], rule, active = -1, ambient = true }: {
  grid: Grid; logo: LogoPlacement; mode: FieldMode; panels?: Rect[]; panelModes?: FieldMode[];
  clear?: Rect[]; rule?: Rule; active?: number; ambient?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { cols, rows, cell, width, height } = grid;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = Math.round(cell * dpr);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const sprites = buildSprites(S);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wordmark: logoFam marks letter cells (1 = O, 2 = X); logoDist = distance to nearest letter cell.
    const N = cols * rows;
    const logoFam = new Uint8Array(N);
    const logoDist = new Float32Array(N).fill(Infinity);
    const letterCells: [number, number][] = [];
    OXX_PATTERN.forEach((line, pr) => [...line].forEach((bit, pc) => {
      if (bit !== '1') return;
      for (let sy = 0; sy < logo.scale; sy++) for (let sx = 0; sx < logo.scale; sx++) {
        const col = logo.col + pc * logo.scale + sx, row = logo.row + pr * logo.scale + sy;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        logoFam[row * cols + col] = pc <= 4 ? 1 : 2;
        letterCells.push([col, row]);
      }
    }));
    const pad = FADE + 1;
    const c0 = Math.max(0, logo.col - pad), c1 = Math.min(cols - 1, logo.col + 17 * logo.scale + pad);
    const r0 = Math.max(0, logo.row - pad), r1 = Math.min(rows - 1, logo.row + 7 * logo.scale + pad);
    for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) {
      let best = Infinity;
      for (const [lc, lr] of letterCells) best = Math.min(best, Math.hypot(col - lc, row - lr));
      logoDist[row * cols + col] = best;
    }

    // One block per cell on the glyph grid, with a thin gap (1/8 of a cell) between neighbours.
    const blockInset = Math.max(1, Math.round(S / 16)), blockSize = S - 2 * blockInset;
    const solid = (col: number, row: number) => {
      ctx.fillRect(Math.round(col * cell * dpr) + blockInset, Math.round(row * cell * dpr) + blockInset, blockSize, blockSize);
    };
    const full = (col: number, row: number) => {
      const x = Math.round(col * cell * dpr), y = Math.round(row * cell * dpr);
      ctx.fillRect(x, y, Math.round((col + 1) * cell * dpr) - x, Math.round((row + 1) * cell * dpr) - y);
    };

    // panel[i]: index of the panel covering the cell, or -1. sweep[i]: the fill level at which
    // that cell turns solid, rising away from the wordmark. quiet[i]: no field glyphs here.
    const panel = new Int8Array(N).fill(-1);
    const sweep = new Float32Array(N);
    const quiet = new Uint8Array(N);
    const each = (r: Rect, pad: number, fn: (i: number, col: number, row: number) => void) => {
      for (let row = r.row - pad; row < r.row + r.h + pad; row++) for (let col = r.col - pad; col < r.col + r.w + pad; col++) {
        if (col >= 0 && col < cols && row >= 0 && row < rows) fn(row * cols + col, col, row);
      }
    };
    panels.forEach((r, k) => {
      const outward = r.col + r.w / 2 < cols / 2; // left of centre: sweep from its right edge
      each(r, 0, (i, col, row) => {
        const x = (col - r.col + 0.5) / r.w;
        panel[i] = k;
        sweep[i] = 0.04 + 0.72 * (outward ? 1 - x : x) + 0.2 * hash(col, row, 31);
      });
    });
    clear.forEach(r => each(r, 1, i => { quiet[i] = 1; }));
    const centres = panels.map(r => [r.col + r.w / 2, r.row + r.h / 2]);
    const focus = new Float32Array(panels.length);
    const spread = cols * 0.6;
    const fills = new Float32Array(panels.length);

    const trail = new Float32Array(N);
    const scatter = new Float32Array(N);
    const weights = MODES.map(m => (m === modeRef.current ? 1 : 0));
    const start = performance.now();

    const stamp = (cx: number, cy: number) => {
      const R = 5;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const col = Math.floor(cx) + dx, row = Math.floor(cy) + dy;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        const d2 = (col + 0.5 - cx) ** 2 + (row + 0.5 - cy) ** 2;
        const i = row * cols + col;
        if (logoDist[i] <= QUIET) scatter[i] = Math.max(scatter[i], Math.exp(-d2 / 14));
        else if (ambient) trail[i] = Math.max(trail[i], Math.exp(-d2 / 8));
      }
    };

    let last: [number, number] | null = null;
    const onPointer = (e: PointerEvent) => {
      // UI that overlays the field (the header) keeps its labels clear of the trail
      if (e.target instanceof Element && e.target.closest('[data-glyph-quiet]')) { last = null; return; }
      const rect = canvas.getBoundingClientRect();
      const p: [number, number] = [(e.clientX - rect.left) / cell, (e.clientY - rect.top) / cell];
      // stamp along the segment so fast strokes stay continuous
      const steps = last ? Math.min(40, Math.ceil(Math.hypot(p[0] - last[0], p[1] - last[1]))) : 1;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        stamp(last ? lerp(last[0], p[0], t) : p[0], last ? lerp(last[1], p[1], t) : p[1]);
      }
      last = p;
    };
    const onLeave = (e: PointerEvent) => { if (!e.relatedTarget) last = null; };

    const draw = (now: number) => {
      const t = reduceMotion ? 0 : (now - start) / 1000;
      const intro = reduceMotion ? 1 : Math.min(1, (now - start) / INTRO_MS);
      const tick = Math.floor(t * 8);
      MODES.forEach((m, k) => { weights[k] += ((m === modeRef.current ? 1 : 0) - weights[k]) * 0.14; });
      const [wField, wSelect, wDense, wModular, wLayer] = weights;
      fills.forEach((f, k) => {
        const target = k === activeRef.current ? 1 : 0;
        fills[k] = reduceMotion ? target : f + (target - f) * PANEL_EASE;
        focus[k] = reduceMotion ? target : focus[k] + (target - focus[k]) * FOCUS_EASE;
      });

      ctx.fillStyle = oxx.void;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const px = (v: number) => Math.round(v * cell * dpr);
      const hair = Math.max(1, Math.round(dpr));
      if (rule) {
        const y = px(rule.row + 0.5);
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.fillRect(px(rule.col0), y, px(rule.col1) - px(rule.col0), hair);
        ctx.fillRect(px(rule.col0), y - px(0.5), hair, px(1)); // drafting ticks at both ends
        ctx.fillRect(px(rule.col1) - hair, y - px(0.5), hair, px(1));
        // the stretch joining the active panel to the wordmark brightens with it
        const logoEnd = logo.col + 17 * logo.scale;
        panels.forEach((r, k) => {
          if (fills[k] < 0.02) return;
          const [x0, x1] = centres[k][0] < cols / 2 ? [rule.col0, logo.col] : [logoEnd, rule.col1];
          ctx.fillStyle = `rgba(255,255,255,${0.7 * fills[k]})`;
          ctx.fillRect(px(x0), y, px(x1) - px(x0), hair);
        });
      }
      ctx.fillStyle = oxx.paper; // for the wordmark and panel blocks

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const ld = logoDist[i];
          const pk = panel[i];
          if (pk >= 0 && fills[pk] > sweep[i]) { trail[i] = 0; full(col, row); continue; }
          if (quiet[i] && ld > QUIET) { trail[i] = 0; continue; }
          let level = 0, fam = 0, red = false, block = false;

          if (ld <= QUIET) {
            // Wordmark zone. Each cell has its own threshold, so cells break and
            // reassemble at different moments as the scatter value rises and fades.
            const sc = scatter[i];
            scatter[i] = sc * SCATTER_DECAY;
            const lf = logoFam[i];
            if (lf) {
              const th = 0.25 + 0.4 * hash(col, row, 21);
              if (sc > th + 0.35) level = hash(col, row, tick) < 0.5 ? 2 : 3; // broken into / +
              else if (sc > th) { level = TOP; fam = 2 - lf; }                  // flipped to the other letter's glyph
              else block = true;                                                // at rest: a solid block
              red = sc > 0.5;
            } else if (sc > 0.15 && hash(col, row, 24) < 1 - ld / (QUIET + 1)) {
              const th = 0.2 + 0.5 * hash(col, row, 23);                      // debris spilling between letters
              if (sc > th) level = sc > th + 0.3 ? (hash(col, row, tick) < 0.5 ? 2 : 3) : 1;
            }
          } else {
            const n = fbm(col * 0.05, row * 0.05, t * 0.05);
            const base = smoothstep(0.4, 0.72, n);

            const pattern = (m: FieldMode) => {
              switch (m) {
                case 'field': return ambient ? base * 0.5 : 0; // at rest the field stays a faint texture
                case 'select': return base > 0.45 ? 0.7 : 0.1;
                case 'dense': return smoothstep(0.26, 0.56, n);
                case 'modular': { // 3×3 cell squares with one-cell gutters
                  if (col % 4 === 3 || row % 4 === 3) return 0;
                  return smoothstep(0.4, 0.62, fbm(Math.floor(col / 4) * 0.22, Math.floor(row / 4) * 0.22, t * 0.05));
                }
                case 'layer': {
                  const band = Math.floor((row + t * 1.5) / 5);
                  return 0.45 * base + [0.12, 0.42, 0.78][((band % 3) + 3) % 3] * 0.6;
                }
              }
            };
            let d = 0;
            if (wField > 0.01) d += wField * pattern('field');
            if (wSelect > 0.01) d += wSelect * pattern('select');
            if (wDense > 0.01) d += wDense * pattern('dense');
            if (wModular > 0.01) d += wModular * pattern('modular');
            if (wLayer > 0.01) d += wLayer * pattern('layer');
            // an active panel's pattern spreads out from it, ragged at the front
            panelModes.forEach((m, k) => {
              if (focus[k] < 0.01) return;
              const dist = Math.hypot(col - centres[k][0], (row - centres[k][1]) * 1.4) + hash(col, row, 41) * 4;
              const reach = spread * focus[k];
              const f = 1 - smoothstep(reach * 0.55, reach, dist);
              if (f > 0) d += (pattern(m) - d) * f;
            });
            const near = ld < FADE;
            if (near) d *= smoothstep(QUIET, FADE, ld);

            const tr = trail[i];
            if (tr > d) d = tr;
            trail[i] = tr * 0.92;
            red = tr > 0.7;

            if (d > 0.06 && !near) d += (hash(col, row, tick) - 0.5) * 0.1; // shimmer, kept away from the wordmark
            // a stable per-cell offset mixes o/◎ and x/✖ inside dense clusters
            if (d > 0.5) d += (hash(col, row, 11) - 0.5) * 0.2;
            level = Math.min(TOP, Math.floor(d * 6));
            fam = noise3(col * 0.09 + 50, row * 0.09, t * 0.03) + hash(col, row, 3) * 0.35 > 0.72 ? 1 : 0;
          }

          if ((level <= 0 && !block) || hash(col, row, 7) > intro * 1.15) continue; // staggered reveal
          if (block) { solid(col, row); continue; }
          ctx.drawImage(sprites[red ? 1 : 0][level][fam], Math.round(col * cell * dpr), Math.round(row * cell * dpr));
        }
      }
    };

    let raf = 0, prev = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - prev < FRAME_MS) return;
      prev = now;
      draw(now);
    };

    raf = requestAnimationFrame(loop); // reduced motion still redraws, so the active panel can fill
    if (!reduceMotion) {
      window.addEventListener('pointermove', onPointer);
      window.addEventListener('pointerout', onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerout', onLeave);
    };
  }, [grid, logo, panels, panelModes, clear, rule, ambient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute top-0 left-0 block pointer-events-none"
      style={{ width: grid.width, height: grid.height }}
    />
  );
}
