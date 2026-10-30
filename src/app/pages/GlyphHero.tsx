import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GlyphField, computeGrid, type FieldMode, type Grid, type LogoPlacement, type Rect, type Rule } from '../components/GlyphField';

// The two phrases are the two ways in: intention → form is the Engine, practice → possibility the Cases.
const PATHS: { to: string; num: string; name: string; phrase: string; eyebrow: string; desc: string; mode: FieldMode }[] = [
  { to: '/engine/layering', num: '01', name: 'Engine', phrase: 'From intention to form.', eyebrow: 'EXPERIMENT / COMPOSE', desc: 'Select a spatial strategy. Transform it. Combine it with another.', mode: 'dense' },
  { to: '/field', num: '02', name: 'Cases', phrase: 'From practice to new possibilities.', eyebrow: 'OBSERVE / EXTRACT', desc: 'See how formal decisions emerge from real spatial work.', mode: 'modular' },
];

// Phrase type size, matched by the clamp() on the phrase; the longer phrase is about 15.2em wide.
const phraseSize = (width: number) => Math.min(22, Math.max(15, width * 0.013));
const PHRASE_EM = 15.2;

interface Layout { grid: Grid; logo: LogoPlacement; plate: Rect; rule?: Rule; cards: Rect[]; labels: Rect[]; compact: boolean }

// Wide: the wordmark sits centred on its plate, a rule runs through it, and each phrase waits at
// one end of the rule inside the (hidden) card it opens. Compact: plate on top, cards stacked.
function layoutHero(width: number, height: number): Layout {
  let grid = computeGrid(width, height);
  const { cols, rows, cell } = grid;
  const navRows = Math.ceil((width <= 650 ? 70 : 88) / cell);
  const scale = cols >= 150 ? 3 : cols >= 64 ? 2 : 1;
  const logoW = 17 * scale, logoH = 7 * scale;
  const padTop = scale + 4, padBottom = 2 * scale;
  const plateH = padTop + logoH + padBottom;
  let plateW = logoW + 4 * scale;
  const margin = Math.max(3, Math.round(cols * 0.04));
  const room = Math.floor((cols - plateW - 2 * margin - 4) / 2); // per side, between margin and plate
  const w = Math.min(Math.ceil(270 / cell), room);
  const h = Math.ceil(270 / cell);
  // Each phrase runs outward from its end of the rule; the longer one sets how far out the cards sit.
  const reach = Math.max(w, Math.ceil((PHRASE_EM * phraseSize(width)) / cell) + 1);

  if (w * cell >= 200 && reach <= room && rows - navRows >= Math.max(plateH, h) + 6) {
    const mid = navRows + Math.floor((rows - navRows) / 2);
    const logo = { col: Math.floor((cols - logoW) / 2), row: mid - Math.floor(logoH / 2), scale };
    const plate = { col: logo.col - 2 * scale, row: logo.row - padTop, w: plateW, h: plateH };
    const top = mid - Math.floor(h / 2);
    const cards = [{ col: margin + reach - w, row: top, w, h }, { col: cols - margin - reach, row: top, w, h }];
    // the band each phrase sits in is kept clear of glyphs, on cell boundaries
    const band = { row: mid - Math.ceil(44 / cell), h: Math.ceil(44 / cell) + Math.ceil(48 / cell) + 1 };
    // phrases can run past the card's outer edge, so the bands reach out to the page edge
    const labels = [{ ...band, col: 1, w: margin + reach - 1 }, { ...band, col: cols - margin - reach, w: margin + reach - 1 }];
    return { grid, compact: false, logo, plate, rule: { row: mid, col0: margin + reach, col1: cols - margin - reach }, cards, labels };
  }

  plateW = Math.min(cols - 4, logoW + 8 * scale); // room for the label on one line
  const logo = { col: Math.floor((cols - logoW) / 2), row: navRows + padTop + 2, scale };
  const plate = { col: Math.floor((cols - plateW) / 2), row: logo.row - padTop, w: plateW, h: plateH };
  const ch = Math.ceil(150 / cell);
  const start = plate.row + plateH + 4;
  const cards = PATHS.map((_, i) => ({ col: 3, row: start + i * (ch + 2), w: cols - 6, h: ch }));
  const needRows = cards[1].row + ch + 5;
  if (needRows > rows) grid = { ...grid, rows: needRows, height: needRows * cell };
  return { grid, compact: true, logo, plate, cards, labels: cards };
}

// At rest a card shows only its phrase on the rule; when active the canvas fills it with white
// cells and the card's own content appears on top, in ink.
const CSS = `
.oxx-door { color: #fff; }
.oxx-door .door-rest, .oxx-door .door-open { position: absolute; inset: 0; display: flex; flex-direction: column; }
.oxx-door .door-rest { justify-content: center; white-space: nowrap; transition: opacity 0s linear 180ms; }
.oxx-door .door-open { justify-content: space-between; padding: 16px 18px; color: #141414; opacity: 0; transition: opacity 0s linear 0s; }
.oxx-door[data-active='true'] .door-rest { opacity: 0; transition-delay: 0s; }
.oxx-door[data-active='true'] .door-open { opacity: 1; transition-delay: 160ms; }
.oxx-door:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
@keyframes oxx-door-in { from { opacity: 0 } to { opacity: 1 } }
.oxx-door .door-rest > * { animation: oxx-door-in 500ms steps(5,end) both; animation-delay: inherit; }
@media(prefers-reduced-motion:reduce){ .oxx-door .door-rest > * { animation: none } }
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
  // Touch screens can't hover, so the cards open in turn.
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const values: FieldMode[] = ['field', 'dense', 'modular']; let i = 0;
    const timer = window.setInterval(() => { i = (i + 1) % values.length; setMode(values[i]); }, 3400);
    return () => clearInterval(timer);
  }, []);
  const layout = useMemo(() => layoutHero(size.w, size.h), [size]);
  const { grid, compact } = layout;
  const box = (r: Rect) => ({ left: r.col * grid.cell, top: r.row * grid.cell, width: r.w * grid.cell, height: r.h * grid.cell });
  const active = PATHS.findIndex(p => p.mode === mode);
  const { plate, labels } = layout;

  return <section className="relative w-full overflow-hidden bg-void" style={{ height: grid.height }} aria-label="OXX / From intention to form">
    <style>{CSS}</style>
    <GlyphField grid={grid} logo={layout.logo} mode={mode} panels={layout.cards} clear={labels} plate={plate} rule={layout.rule} active={active} />
    <span className="absolute flex items-center justify-center whitespace-nowrap font-mono text-[10px] tracking-[0.2em] text-white/45 max-md:text-[9px] max-md:tracking-[0.12em]"
      style={{ ...box({ ...plate, h: plate.row >= 0 ? layout.logo.row - plate.row : 0 }) }}>
      OXX LAB / FORMAL REASONING SYSTEM
    </span>
    <nav aria-label="Explore OXX">
      {PATHS.map((s, i) => {
        const inner = !compact && i === 0; // phrases hug the ends of the rule
        return <Link
          key={s.num} to={s.to} data-active={active === i} aria-label={`${s.name}: ${s.desc}`}
          className="oxx-door absolute"
          style={{ ...box(layout.cards[i]), animationDelay: `${500 + i * 160}ms` }}
          onMouseEnter={() => setMode(s.mode)}
          onMouseLeave={() => setMode('field')}
          onFocus={() => setMode(s.mode)}
          onBlur={() => setMode('field')}>
          <span className={`door-rest ${inner ? 'items-end text-right' : 'items-start'} ${compact ? 'px-1' : ''}`}>
            {/* the phrase is centred on the rule; its label floats above it */}
            <span className={`relative font-body text-[clamp(15px,1.3vw,22px)] font-medium leading-[1.15] tracking-[-0.03em] ${i === 0 ? 'text-white' : 'text-white/55'}`}>
              <span className={`absolute bottom-full mb-2 font-mono text-[10px] font-normal tracking-[.14em] text-white/45 ${inner ? 'right-0' : 'left-0'}`}>{s.num} / {s.name.toUpperCase()} ↗</span>
              {s.phrase}
            </span>
          </span>
          <span className="door-open">
            <span className="flex items-center justify-between font-mono text-[10px] tracking-[.12em] text-ink/55"><span>{s.num} / {s.eyebrow}</span><span className="text-base text-ink">↗</span></span>
            <span>
              <span className="block font-mono text-[clamp(28px,2.6vw,42px)] font-bold uppercase leading-[.9] tracking-[-.06em]">{s.name}</span>
              <span className="mt-3 block max-w-[240px] font-body text-[12px] leading-[1.45] text-ink/60">{s.desc}</span>
            </span>
          </span>
        </Link>;
      })}
    </nav>
  </section>;
}
