import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GlyphField, computeGrid, type FieldMode, type Grid, type LogoPlacement } from '../components/GlyphField';
import { useOs } from '../os/Shell';

const PATHS: { to: string; num: string; name: string; eyebrow: string; desc: string; mode: FieldMode }[] = [
  { to: '/engine/layering', num: '01', name: 'Engine', eyebrow: 'EXPERIMENT / COMPOSE', desc: 'Select a spatial strategy. Transform it. Combine it with another.', mode: 'dense' },
  { to: '/field', num: '02', name: 'Cases', eyebrow: 'OBSERVE / EXTRACT', desc: 'See how formal decisions emerge from real spatial work.', mode: 'modular' },
];
interface Rect { col: number; row: number; w: number; h: number }
interface Layout { grid: Grid; logo: LogoPlacement; cards: Rect[]; tagline: Rect; compact: boolean }
function layoutHero(width: number, height: number): Layout {
  let grid = computeGrid(width, height);
  const { cols, rows, cell } = grid;
  const navRows = Math.ceil((width <= 650 ? 70 : 88) / cell);
  const scale = cols >= 120 ? 3 : cols >= 64 ? 2 : 1;
  const logoW = 17 * scale, logoH = 7 * scale;
  const left = Math.max(3, Math.round(cols * 0.075));
  const split = Math.max(left + logoW + 7, Math.round(cols * 0.53));
  const wide = cols - split >= Math.ceil(290 / cell) && rows >= navRows + Math.ceil(420 / cell);
  if (wide) {
    const cardH = Math.ceil(142 / cell);
    const gap = Math.ceil(18 / cell);
    const start = Math.max(navRows + 4, Math.round(rows * 0.36));
    const w = Math.min(cols - split - 3, Math.max(Math.ceil(330 / cell), Math.round(cols * 0.38)));
    const cards = [
      { col: split, row: start, w, h: cardH },
      { col: split + Math.round(w * 0.10), row: start + cardH + gap, w: Math.min(w, cols - split - Math.round(w * 0.10)), h: cardH },
    ];
    const logoRow = Math.max(navRows + 4, Math.round(rows * 0.39));
    return { grid, compact: false, logo: { col: left, row: logoRow, scale }, tagline: { col: left, row: logoRow + logoH + 4, w: Math.min(logoW + 18, split - left - 2), h: 7 }, cards };
  }
  const logo = { col: Math.max(3, Math.floor((cols - logoW) / 2)), row: navRows + 4, scale };
  const tagline = { col: 3, row: logo.row + logoH + 4, w: cols - 6, h: 8 };
  const cardH = Math.ceil(135 / cell);
  const start = tagline.row + 11;
  const cards = PATHS.map((_, i) => ({ col: 3 + i, row: start + i * (cardH + 3), w: cols - 7, h: cardH }));
  const needRows = cards[1].row + cardH + 7;
  if (needRows > rows) grid = { ...grid, rows: needRows, height: needRows * cell };
  return { grid, compact: true, logo, tagline, cards };
}
const CSS = `
@keyframes oxx-slab-in { from { clip-path: inset(0 100% 0 0); opacity: .3 } to { clip-path: inset(0 0 0 0); opacity: 1 } }
.oxx-entry { animation: oxx-slab-in 620ms steps(10,end) both; transition: transform 240ms ease; }
.oxx-entry:hover { transform: translateY(-3px); }
.oxx-entry .entry-arrow { transition: transform 250ms steps(4,end); }
.oxx-entry:hover .entry-arrow { transform: translate(5px,-5px); }
@media(prefers-reduced-motion:reduce){.oxx-entry{animation:none;transition:none}}
`;

export function GlyphHero() {
  const { openDialog } = useOs();
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
  return <section className="relative w-full overflow-hidden bg-void" style={{ height: grid.height }} aria-label="OXX / From intention to form">
    <style>{CSS}</style>
    <GlyphField grid={grid} logo={layout.logo} mode={mode} />
    <div className="absolute flex flex-col items-start gap-2" style={box(layout.tagline)}>
      <span className="bg-void pr-2 font-mono text-[10px] tracking-[0.18em] text-white/55">OXX LAB / FORMAL REASONING SYSTEM</span>
      <p className="max-w-[410px] bg-void pr-2 font-body text-[clamp(15px,1.45vw,21px)] leading-[1.35] tracking-[-0.025em] text-white">
        From intention to form.<br/><span className="text-white/50">From practice to new possibilities.</span>
      </p>
      <button onClick={() => openDialog('method')} className="mt-2 bg-void pr-2 font-mono text-[10px] tracking-[.08em] text-white/55 hover:text-white">HOW OXX WORKS ↗</button>
    </div>
    <nav aria-label="Explore OXX">
      {PATHS.map((s, i) => <Link
        key={s.num} to={s.to}
        className="oxx-entry absolute flex flex-col justify-between rounded-[3px] bg-white px-5 py-4 text-left text-ink"
        style={{ ...box(layout.cards[i]), animationDelay: `${420 + i * 165}ms` }}
        onMouseEnter={() => setMode(s.mode)}
        onMouseLeave={() => setMode('field')}
        onFocus={() => setMode(s.mode)}
        onBlur={() => setMode('field')}>
        <span className="flex items-center justify-between font-mono text-[10px] tracking-[.1em] text-ink/50"><span>{s.num} / {s.eyebrow}</span><span className="entry-arrow text-base text-ink">↗</span></span>
        <span><span className="block font-mono text-[clamp(23px,2.6vw,38px)] font-bold uppercase tracking-[-.055em] leading-none">{s.name}</span><span className="mt-2 block max-w-[290px] font-body text-[12px] leading-[1.45] text-ink/60">{s.desc}</span></span>
      </Link>)}
    </nav>
    <div className="absolute bottom-7 left-[7.5%] bg-void font-mono text-[9px] uppercase tracking-[.13em] text-white/30">Observe → Extract → Compose → Select</div>
  </section>;
}
