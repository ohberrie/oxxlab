import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GlyphField, computeGrid, type FieldMode, type Grid, type LogoPlacement, type Rect } from '../components/GlyphField';

const PATHS: { to: string; num: string; name: string; eyebrow: string; desc: string; mode: FieldMode }[] = [
  { to: '/engine/layering', num: '01', name: 'Engine', eyebrow: 'EXPERIMENT / COMPOSE', desc: 'Select a spatial strategy. Transform it. Combine it with another.', mode: 'dense' },
  { to: '/field', num: '02', name: 'Cases', eyebrow: 'OBSERVE / EXTRACT', desc: 'See how formal decisions emerge from real spatial work.', mode: 'modular' },
];
interface Layout { grid: Grid; logo: LogoPlacement; cards: Rect[]; tagline: Rect; compact: boolean }

// Wide: the wordmark + statement and the two entries form one block whose columns share
// a top and bottom edge. Everything sits on glyph cells, so the cards are cut from the field.
function layoutHero(width: number, height: number): Layout {
  let grid = computeGrid(width, height);
  const { cols, rows, cell } = grid;
  const navRows = Math.ceil((width <= 650 ? 70 : 88) / cell);
  const scale = cols >= 120 ? 3 : cols >= 64 ? 2 : 1;
  const logoW = 17 * scale, logoH = 7 * scale;
  const left = Math.max(3, Math.round(cols * 0.075));
  const split = left + logoW + Math.max(6, Math.round(cols * 0.07));
  const tagH = Math.ceil(124 / cell);
  const blockH = logoH + 3 + tagH;
  const cardH = Math.floor((blockH - 1) / 2);
  const wide = cols - left - split >= Math.ceil(300 / cell) && cardH * cell >= 128 && rows - navRows >= blockH + 6;
  if (wide) {
    const top = navRows + Math.max(3, Math.floor((rows - navRows - blockH) / 2));
    const w = Math.min(cols - left - split, Math.ceil(640 / cell));
    const cards = [0, 1].map(i => ({ col: split, row: top + i * (cardH + 1), w, h: cardH }));
    return { grid, compact: false, logo: { col: left, row: top, scale }, tagline: { col: left, row: top + logoH + 3, w: split - left - 3, h: tagH }, cards };
  }
  const logo = { col: Math.max(3, Math.floor((cols - logoW) / 2)), row: navRows + 4, scale };
  const tagline = { col: 3, row: logo.row + logoH + 4, w: cols - 6, h: Math.ceil(110 / cell) };
  const h = Math.ceil(132 / cell);
  const start = tagline.row + tagline.h + 3;
  const cards = PATHS.map((_, i) => ({ col: 3, row: start + i * (h + 1), w: cols - 6, h }));
  const needRows = cards[1].row + h + 5;
  if (needRows > rows) grid = { ...grid, rows: needRows, height: needRows * cell };
  return { grid, compact: true, logo, tagline, cards };
}

// Cards are outlines until active; then the canvas fills them with wordmark blocks and the text inverts.
const CSS = `
@keyframes oxx-entry-in { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
.oxx-entry { animation: oxx-entry-in 620ms steps(10,end) both; color: #fff; box-shadow: inset 0 0 0 1px rgba(255,255,255,.3);
  transition: color 0s linear 90ms, box-shadow 0s linear 90ms; }
.oxx-entry .entry-sub { color: rgba(255,255,255,.55); transition: color 0s linear 90ms; }
.oxx-entry[data-active='true'] { color: #141414; box-shadow: inset 0 0 0 1px transparent; }
.oxx-entry[data-active='true'] .entry-sub { color: rgba(20,20,20,.6); }
.oxx-entry:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.oxx-entry .entry-arrow { transition: transform 250ms steps(4,end); }
.oxx-entry[data-active='true'] .entry-arrow { transform: translate(5px,-5px); }
@media(prefers-reduced-motion:reduce){ .oxx-entry { animation: none } }
`;

export function GlyphHero() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [mode, setMode] = useState<FieldMode>('field');
  useEffect(() => {
    let timer = 0;
    const resize = () => { clearTimeout(timer); timer = window.setTimeout(() => setSize({ w: window.innerWidth, h: window.innerHeight }), 120); };
    window.addEventListener('resize', resize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', resize); };
  }, []);
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const values: FieldMode[] = ['field', 'dense', 'modular']; let i = 0;
    const timer = window.setInterval(() => { i = (i + 1) % values.length; setMode(values[i]); }, 3400);
    return () => clearInterval(timer);
  }, []);
  const layout = useMemo(() => layoutHero(size.w, size.h), [size]);
  const { grid } = layout;
  const box = (r: Rect) => ({ left: r.col * grid.cell, top: r.row * grid.cell, width: r.w * grid.cell, height: r.h * grid.cell });
  const active = PATHS.findIndex(p => p.mode === mode);
  const clear = useMemo(() => [layout.tagline], [layout]);
  return <section className="relative w-full overflow-hidden bg-void" style={{ height: grid.height }} aria-label="OXX / From intention to form">
    <style>{CSS}</style>
    <GlyphField grid={grid} logo={layout.logo} mode={mode} panels={layout.cards} clear={clear} active={active} />
    <div className="absolute flex flex-col items-start justify-end gap-3" style={box(layout.tagline)}>
      <span className="font-mono text-[10px] tracking-[0.18em] text-white/45">OXX LAB / FORMAL REASONING SYSTEM</span>
      <p className="font-body text-[clamp(22px,2.4vw,34px)] font-medium leading-[1.12] tracking-[-0.035em] text-white">
        From intention to form.<br /><span className="text-white/40">From practice to new possibilities.</span>
      </p>
    </div>
    <nav aria-label="Explore OXX">
      {PATHS.map((s, i) => <Link
        key={s.num} to={s.to} data-active={active === i}
        className="oxx-entry absolute flex flex-col justify-between px-5 py-4 text-left"
        style={{ ...box(layout.cards[i]), animationDelay: `${420 + i * 165}ms` }}
        onMouseEnter={() => setMode(s.mode)}
        onMouseLeave={() => setMode('field')}
        onFocus={() => setMode(s.mode)}
        onBlur={() => setMode('field')}>
        <span className="entry-sub flex items-center justify-between font-mono text-[10px] tracking-[.12em]"><span>{s.num} / {s.eyebrow}</span><span className="entry-arrow text-base">↗</span></span>
        <span className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-start max-md:gap-2">
          <span className="block font-mono text-[clamp(30px,3.6vw,52px)] font-bold uppercase leading-[.9] tracking-[-.06em]">{s.name}</span>
          <span className="entry-sub block max-w-[260px] font-body text-[12px] leading-[1.45]">{s.desc}</span>
        </span>
      </Link>)}
    </nav>
  </section>;
}
