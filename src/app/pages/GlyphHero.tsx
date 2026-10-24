import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GlyphField, computeGrid, FieldMode, Grid, LogoPlacement } from '../components/GlyphField';

// Each section of OXX OS drives one behavior of the glyph field.
const SECTIONS: { to: string; num: string; name: string; desc: string; mode: FieldMode }[] = [
  { to: '/engine', num: '01', name: 'Engine', desc: 'Form finding: change a variable, keep the principle', mode: 'dense' },
  { to: '/field', num: '02', name: 'Field', desc: 'Built work read through formal decisions', mode: 'modular' },
  { to: '/tools', num: '03', name: 'Tools', desc: 'From selected form to identifiable parts', mode: 'layer' },
  { to: '/method', num: '04', name: 'Method', desc: 'Seven steps from a brief to a reusable rule', mode: 'select' },
];

interface Rect { col: number; row: number; w: number; h: number }
interface Layout { grid: Grid; logo: LogoPlacement; slabs: Rect[]; tagline: Rect; footer: Rect; compact: boolean }

// Everything is placed in grid cells so the white slabs cut the glyph field on cell boundaries.
function layoutHero(width: number, height: number): Layout {
  let grid = computeGrid(width, height);
  const { cols, rows, cell } = grid;
  const navRows = Math.ceil((width <= 650 ? 70 : 88) / cell);
  const slabH = Math.ceil(100 / cell);
  const slabMinW = Math.ceil(340 / cell);

  // Wide: wordmark left, slabs staggered down the right.
  const scale = cols >= 120 ? 3 : 2;
  const logoW = 17 * scale, logoH = 7 * scale;
  const logoCol = Math.max(3, Math.round(cols * 0.07));
  const slabsCol = logoCol + logoW + Math.max(6, Math.round(cols * 0.06));
  const avail = cols - slabsCol;
  const top = navRows + 3, space = rows - top - 4;
  if (avail >= slabMinW + 8 && space >= 4 * slabH + 3) {
    const gap = Math.min(4, Math.floor((space - 4 * slabH) / 3));
    const start = top + Math.floor((space - (4 * slabH + 3 * gap)) / 2);
    const w = Math.max(slabMinW, Math.round(avail * 0.6));
    const shifts = [0.08, 0.36, 0, 0.24].map(f => Math.round(avail * f));
    const slabs = shifts.map((dx, i) => {
      const col = Math.min(slabsCol + dx, cols - w - 1);
      // the last slab bleeds off the right edge
      return { col, row: start + i * (slabH + gap), w: i === 3 ? cols - col : w, h: slabH };
    });
    const logoRow = Math.max(top, Math.round((rows - logoH) / 2) - 2);
    return {
      grid, compact: false, slabs,
      logo: { col: logoCol, row: logoRow, scale },
      tagline: { col: logoCol, row: logoRow + logoH + 2, w: logoW, h: 3 },
      footer: { col: logoCol, row: rows - 4, w: logoW, h: 2 },
    };
  }

  // Compact: wordmark on top, slabs stacked below; the hero grows to fit.
  const s = cols >= 50 ? 2 : 1;
  const logo = { col: Math.floor((cols - 17 * s) / 2), row: navRows + 3, scale: s };
  const tagline = { col: 2, row: logo.row + 7 * s + 2, w: cols - 4, h: 3 };
  const w = cols - 5;
  const slabs = SECTIONS.map((_, i) => ({ col: i % 2 ? 3 : 2, row: tagline.row + 5 + i * (slabH + 2), w, h: slabH }));
  const footer = { col: 2, row: slabs[3].row + slabH + 3, w: cols - 4, h: 2 };
  const needRows = footer.row + 5;
  if (needRows > rows) grid = { ...grid, rows: needRows, height: needRows * cell };
  return { grid, compact: true, logo, slabs, tagline, footer };
}

const SLAB_CSS = `
  @keyframes hero-slab-in { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  .hero-slab { animation: hero-slab-in 520ms steps(8, end) both; }
  .hero-slab .hero-slab-arrow { transition: transform 0.25s steps(3, end); }
  .hero-slab[data-active='true'] .hero-slab-arrow { transform: translateX(6px); }
  @media (prefers-reduced-motion: reduce) { .hero-slab { animation: none; } }
`;

export function GlyphHero() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [mode, setMode] = useState<FieldMode>('field');

  useEffect(() => {
    let timer = 0;
    const onResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => setSize({ w: window.innerWidth, h: window.innerHeight }), 150);
    };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, []);

  // Touch screens can't hover, so cycle through the sections instead.
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const order: FieldMode[] = ['field', ...SECTIONS.map(s => s.mode)];
    let k = 0;
    const id = window.setInterval(() => { k = (k + 1) % order.length; setMode(order[k]); }, 3200);
    return () => clearInterval(id);
  }, []);

  const layout = useMemo(() => layoutHero(size.w, size.h), [size]);
  const { grid } = layout;
  const box = (r: Rect) => ({ left: r.col * grid.cell, top: r.row * grid.cell, width: r.w * grid.cell, height: r.h * grid.cell });

  return (
    <section className="relative w-full overflow-hidden bg-void" style={{ height: grid.height }} aria-label="OXX OS">
      <style>{SLAB_CSS}</style>
      <GlyphField grid={grid} logo={layout.logo} mode={mode} />

      <div className="absolute flex flex-col items-start gap-1.5" style={box(layout.tagline)}>
        <span className="bg-void pr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">OXX OS / Form engine</span>
        <span className="bg-void pr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/30">
          {layout.compact ? 'Practice → principle → possibility' : 'Move across the field · hover a section'}
        </span>
      </div>

      <nav aria-label="Sections">
        {SECTIONS.map((s, i) => {
          const active = mode === s.mode;
          return (
            <Link
              key={s.to}
              to={s.to}
              data-active={active}
              className="hero-slab absolute flex flex-col justify-between rounded-[3px] bg-white px-4 py-3 no-underline text-ink"
              style={{ ...box(layout.slabs[i]), animationDelay: `${450 + i * 130}ms` }}
              onMouseEnter={() => setMode(s.mode)}
              onMouseLeave={() => setMode('field')}
              onFocus={() => setMode(s.mode)}
              onBlur={() => setMode('field')}
            >
              <span className="flex items-center justify-between font-mono text-[11px] tracking-[0.08em]">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-[7px] w-[7px]" style={{ background: active ? 'var(--color-blue)' : 'rgba(20,20,20,0.18)' }} />
                  <span className={active ? 'text-blue' : 'text-ink/45'}>{s.num}</span>
                </span>
                <span className="hero-slab-arrow text-[14px]">→</span>
              </span>
              <span className="flex flex-col gap-1">
                <span className="font-mono text-[18px] font-bold uppercase leading-none tracking-[-0.01em] max-md:text-[16px]">{s.name}</span>
                <span className="font-body text-[12px] leading-[1.4] text-ink/55 line-clamp-2">{s.desc}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute flex items-end gap-6 font-mono text-[11px] uppercase tracking-[0.14em]" style={box(layout.footer)}>
        <a href="#form-thinks-forward" className="bg-void pr-2 no-underline text-white/50 transition-colors hover:text-white">Scroll ↓</a>
      </div>
    </section>
  );
}
