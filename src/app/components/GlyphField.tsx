import { useEffect, useRef } from 'react';
import { oxx } from '../tokens';
import { OXX_PATTERN } from '../oxxPattern';

// A full-screen grid of O/X glyph cells driven by a density field.
// Density (0–1) picks a glyph from an 8-step ladder: · : \ + o ◎ ▣ (O family)
// or · : \ × ✖ ⊠ (X family). The OXX wordmark, the active lab system (mode)
// and a pointer trail all write into the same density value.

export type FieldMode = 'field' | 'selection-logic' | 'dense-field' | 'modular-fill' | 'layer-stack';
const MODES: FieldMode[] = ['field', 'selection-logic', 'dense-field', 'modular-fill', 'layer-stack'];

export interface Grid { cols: number; rows: number; cell: number; width: number; height: number }
export interface LogoPlacement { col: number; row: number; scale: number }

export function computeGrid(width: number, height: number): Grid {
  const cell = Math.max(12, Math.min(18, Math.round(width / 90)));
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
  colon: (g, c, u) => { g.fillRect(c - 1.1 * u, c - 4 * u, 2.2 * u, 2.2 * u); g.fillRect(c - 1.1 * u, c + 1.8 * u, 2.2 * u, 2.2 * u); },
  slash: (g, c, u) => { g.lineWidth = 1.3 * u; line(g, c - 4 * u, c - 4 * u, c + 4 * u, c + 4 * u); },
  plus: (g, c, u) => { g.lineWidth = 1.5 * u; line(g, c - 4 * u, c, c + 4 * u, c); line(g, c, c - 4 * u, c, c + 4 * u); },
  thinX: (g, c, u) => { g.lineWidth = 1.4 * u; cross(g, c, 3.5 * u); },
  ring: (g, c, u) => { g.lineWidth = 2 * u; circle(g, c, 4.2 * u); },
  boldX: (g, c, u) => { g.lineWidth = 2.8 * u; cross(g, c, 3.8 * u); },
  target: (g, c, u) => { g.lineWidth = 1.9 * u; circle(g, c, 5.6 * u); circle(g, c, 2.3 * u, true); },
  heavyX: (g, c, u) => { g.lineWidth = 3.6 * u; cross(g, c, 4.6 * u); },
  squareDot: (g, c, u) => {
    g.lineWidth = 2.1 * u; g.beginPath(); g.roundRect(c - 5.6 * u, c - 5.6 * u, 11.2 * u, 11.2 * u, 2.4 * u); g.stroke();
    g.fillRect(c - 1.8 * u, c - 1.8 * u, 3.6 * u, 3.6 * u);
  },
  squareX: (g, c, u) => {
    g.lineWidth = 2.1 * u; g.beginPath(); g.roundRect(c - 5.6 * u, c - 5.6 * u, 11.2 * u, 11.2 * u, 2.4 * u); g.stroke();
    g.lineWidth = 1.8 * u; cross(g, c, 2.6 * u);
  },
};

// Level 1–7 → [O family, X family]
const LADDER: [string, string][] = [
  ['', ''], ['dot', 'dot'], ['colon', 'colon'], ['slash', 'slash'], ['plus', 'thinX'],
  ['ring', 'boldX'], ['target', 'heavyX'], ['squareDot', 'squareX'],
];
const LEVEL_ALPHA = [0, 0.45, 0.5, 0.55, 0.75, 1, 1, 1];

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

export function GlyphField({ grid, logo, mode }: { grid: Grid; logo: LogoPlacement; mode: FieldMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

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
    const pad = 6;
    const c0 = Math.max(0, logo.col - pad), c1 = Math.min(cols - 1, logo.col + 17 * logo.scale + pad);
    const r0 = Math.max(0, logo.row - pad), r1 = Math.min(rows - 1, logo.row + 7 * logo.scale + pad);
    for (let row = r0; row <= r1; row++) for (let col = c0; col <= c1; col++) {
      let best = Infinity;
      for (const [lc, lr] of letterCells) best = Math.min(best, Math.hypot(col - lc, row - lr));
      logoDist[row * cols + col] = best;
    }

    const trail = new Float32Array(N);
    const weights = MODES.map(m => (m === modeRef.current ? 1 : 0));
    const start = performance.now();

    const stamp = (cx: number, cy: number) => {
      const R = 4;
      for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
        const col = Math.floor(cx) + dx, row = Math.floor(cy) + dy;
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
        const d2 = (col + 0.5 - cx) ** 2 + (row + 0.5 - cy) ** 2;
        const i = row * cols + col;
        trail[i] = Math.max(trail[i], Math.exp(-d2 / 8));
      }
    };

    let last: [number, number] | null = null;
    const onPointer = (e: PointerEvent) => {
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

      ctx.fillStyle = oxx.void;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const n = fbm(col * 0.05, row * 0.05, t * 0.05);
          const base = smoothstep(0.4, 0.72, n);

          let d = 0;
          if (wField > 0.01) d += wField * base;
          if (wSelect > 0.01) d += wSelect * (base > 0.45 ? 0.68 : 0.14);
          if (wDense > 0.01) d += wDense * smoothstep(0.26, 0.56, n);
          if (wModular > 0.01) {
            const edge = col % 5 === 4 || row % 3 === 2;
            const m = fbm(Math.floor(col / 5) * 0.25, Math.floor(row / 3) * 0.15, t * 0.05);
            d += wModular * (edge ? 0 : smoothstep(0.4, 0.62, m));
          }
          if (wLayer > 0.01) {
            const band = Math.floor((row + t * 1.5) / 5);
            d += wLayer * (0.45 * base + [0.12, 0.42, 0.78][((band % 3) + 3) % 3] * 0.6);
          }

          let fam = 0;
          const ld = logoDist[i];
          // wordmark: O in ◎, X in ✖ (level 6), with a few heavier cells for texture
          if (logoFam[i]) { d = hash(col, row, 5) < 0.12 ? 1 : 0.8; fam = logoFam[i] - 1; }
          else if (ld <= 1.5) d = 0;
          else if (ld <= 5.5) d = Math.max(d * 0.3, 0.52 * (1 - (ld - 1.5) / 4));

          const tr = trail[i];
          if (tr > d) d = tr;
          trail[i] = tr * 0.92;

          if (hash(col, row, 7) > intro * 1.15) continue; // staggered reveal
          if (d > 0.06 && !logoFam[i]) d += (hash(col, row, tick) - 0.5) * 0.1; // shimmer
          // a stable per-cell offset mixes ◎ / ▣ / ✖ inside dense clusters instead of saturating
          if (d > 0.5 && !logoFam[i]) d += (hash(col, row, 11) - 0.5) * 0.24;
          const level = Math.min(7, Math.floor(d * 7.6));
          if (level <= 0) continue;

          if (!logoFam[i]) fam = noise3(col * 0.09 + 50, row * 0.09, t * 0.03) + hash(col, row, 3) * 0.35 > 0.72 ? 1 : 0;
          ctx.drawImage(sprites[tr > 0.7 ? 1 : 0][level][fam], Math.round(col * cell * dpr), Math.round(row * cell * dpr));
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

    if (reduceMotion) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(loop);
      window.addEventListener('pointermove', onPointer);
      window.addEventListener('pointerout', onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerout', onLeave);
    };
  }, [grid, logo]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute top-0 left-0 block pointer-events-none"
      style={{ width: grid.width, height: grid.height }}
    />
  );
}
