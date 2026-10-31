import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { GlyphField, computeGrid, type FieldMode, type Grid, type LogoPlacement, type Rect, type Rule } from '../components/GlyphField';

// The two phrases are the two ways in: intention → form is the Engine, practice → possibility the Cases.
const PATHS: { to: string; num: string; name: string; phrase: string; eyebrow: string; desc: string; mode: FieldMode }[] = [
  { to: '/engine/layering', num: '01', name: 'Engine', phrase: 'From intention to form.', eyebrow: 'EXPERIMENT / COMPOSE', desc: 'Select a spatial strategy. Transform it. Combine it with another.', mode: 'dense' },
  { to: '/field', num: '02', name: 'Cases', phrase: 'From practice to new possibilities.', eyebrow: 'OBSERVE / EXTRACT', desc: 'See how formal decisions emerge from real spatial work.', mode: 'modular' },
];
const PANEL_MODES = PATHS.map(p => p.mode);

// Phrase type size, matched by the clamp() on the phrase; the longer phrase is about 15.2em wide.
const phraseSize = (width: number) => Math.min(22, Math.max(15, width * 0.013));
const PHRASE_EM = 15.2;

// Intro: each phrase is read in turn, then both give way to their cards.
// 0 = nothing lit, 1 = left phrase, 2 = right phrase, 3 = cards.
const STAGE_AT = [250, 1500, 2800];
let introPlayed = false; // once per page load, so coming back to the landing skips it

interface Layout { grid: Grid; logo: LogoPlacement; label: Rect; rule?: Rule; cards: Rect[]; compact: boolean }

// Wide: the wordmark sits centred with a rule running through it; each phrase ends at one end of
// the rule, and its square card later opens from that same point. Compact: wordmark on top,
// cards stacked below.
function layoutHero(width: number, height: number): Layout {
  let grid = computeGrid(width, height);
  const { cols, rows, cell } = grid;
  const navRows = Math.ceil((width <= 650 ? 70 : 88) / cell);
  const scale = cols >= 150 ? 3 : cols >= 64 ? 2 : 1;
  const logoW = 17 * scale, logoH = 7 * scale;
  const labelRows = scale + 3; // the system label above the wordmark
  const margin = Math.max(3, Math.round(cols * 0.04));
  const gap = 2 * scale + 2;   // rule visible between a phrase and the wordmark
  const side = Math.ceil(240 / cell);
  const reach = Math.max(side, Math.ceil((PHRASE_EM * phraseSize(width)) / cell) + 1);

  if (cols - logoW - 2 * margin - 2 * reach >= 2 * gap && rows - navRows >= Math.max(logoH + labelRows, side) + 6) {
    const mid = navRows + Math.floor((rows - navRows) / 2);
    const logo = { col: Math.floor((cols - logoW) / 2), row: mid - Math.floor(logoH / 2), scale };
    const label = { col: logo.col, row: logo.row - labelRows, w: logoW, h: labelRows - 1 };
    const top = mid - Math.floor(side / 2);
    const cards = [{ col: margin + reach - side, row: top, w: side, h: side }, { col: cols - margin - reach, row: top, w: side, h: side }];
    return { grid, compact: false, logo, label, rule: { row: mid, col0: margin + reach, col1: cols - margin - reach }, cards };
  }

  const logo = { col: Math.floor((cols - logoW) / 2), row: navRows + labelRows + 3, scale };
  const label = { col: 2, row: logo.row - labelRows, w: cols - 4, h: labelRows - 1 };
  const ch = Math.ceil(150 / cell);
  const start = logo.row + logoH + 5;
  const cards = PATHS.map((_, i) => ({ col: 3, row: start + i * (ch + 2), w: cols - 6, h: ch }));
  const needRows = cards[1].row + ch + 5;
  if (needRows > rows) grid = { ...grid, rows: needRows, height: needRows * cell };
  return { grid, compact: true, logo, label, cards };
}

// Cards open from their end of the rule in stepped cell-like bands. When active the canvas
// fills the card with white cells and its text turns to ink.
const CSS = `
.oxx-phrase { position: absolute; transform: translateY(-50%); white-space: nowrap; color: #fff; opacity: 0; transition: opacity 700ms ease; }
.oxx-phrase[data-lit='dim'] { opacity: .2; }
.oxx-phrase[data-lit='on'] { opacity: 1; }
.oxx-phrase[data-lit='gone'] { opacity: 0; transition-duration: 200ms; }
.oxx-card { display: flex; flex-direction: column; justify-content: space-between; padding: 14px 16px; color: #fff;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.42); visibility: hidden;
  transition: color 0s linear 90ms, box-shadow 0s linear 90ms; }
.oxx-card .card-sub { color: rgba(255,255,255,.55); transition: color 0s linear 90ms; }
.oxx-card[data-open='true'] { visibility: visible; animation: oxx-card-in 420ms steps(7,end) both; }
.oxx-card[data-from='right'][data-open='true'] { animation-name: oxx-card-in-r; }
@keyframes oxx-card-in { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
@keyframes oxx-card-in-r { from { clip-path: inset(0 0 0 100%) } to { clip-path: inset(0 0 0 0) } }
.oxx-card[data-active='true'] { color: #141414; box-shadow: inset 0 0 0 1px transparent; }
.oxx-card[data-active='true'] .card-sub { color: rgba(20,20,20,.6); }
.oxx-card .card-arrow { transition: transform 240ms steps(4,end); }
.oxx-card[data-active='true'] .card-arrow { transform: translate(4px,-4px); }
.oxx-card:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
@media(prefers-reduced-motion:reduce){ .oxx-card[data-open='true'] { animation: none } .oxx-phrase { transition: none } }
`;

export function GlyphHero() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [stage, setStage] = useState(() => (introPlayed || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3 : 0));
  const [active, setActive] = useState(-1);
  useEffect(() => {
    let timer = 0;
    const resize = () => { clearTimeout(timer); timer = window.setTimeout(() => setSize({ w: window.innerWidth, h: window.innerHeight }), 120); };
    window.addEventListener('resize', resize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', resize); };
  }, []);
  useEffect(() => {
    if (stage === 3) { introPlayed = true; return; }
    const timers = STAGE_AT.map((ms, i) => window.setTimeout(() => setStage(s => Math.max(s, i + 1)), ms));
    return () => timers.forEach(clearTimeout);
  }, [stage === 3]); // eslint-disable-line react-hooks/exhaustive-deps
  // Touch screens can't hover, so once the cards are out they open in turn.
  useEffect(() => {
    if (stage < 3 || !window.matchMedia('(hover: none)').matches) return;
    let i = 0;
    const timer = window.setInterval(() => { i = (i + 1) % 3; setActive(i - 1); }, 3400);
    return () => clearInterval(timer);
  }, [stage]);

  const layout = useMemo(() => layoutHero(size.w, size.h), [size]);
  const { grid, compact, cards } = layout;
  const clear = useMemo(() => [...layout.cards, layout.label], [layout]);
  const box = (r: Rect) => ({ left: r.col * grid.cell, top: r.row * grid.cell, width: r.w * grid.cell, height: r.h * grid.cell });
  const lit = (i: number) => (stage === 3 ? 'gone' : stage === i + 1 ? 'on' : stage > 0 ? 'dim' : 'off');
  // each phrase is centred on the rule, a cell short of where it ends; the card later meets the rule there
  const phraseAt = (i: number) => {
    const c = cards[i], y = (c.row + c.h / 2) * grid.cell;
    if (compact) return { left: (c.col + 1) * grid.cell, top: y };
    return i === 0 ? { right: grid.width - (c.col + c.w - 1) * grid.cell, top: y } : { left: (c.col + 1) * grid.cell, top: y };
  };

  return <section className="relative w-full overflow-hidden bg-void" style={{ height: grid.height }} aria-label="OXX / From intention to form">
    <style>{CSS}</style>
    <GlyphField grid={grid} logo={layout.logo} mode="field" ambient={false} panels={cards} panelModes={PANEL_MODES}
      clear={clear} rule={layout.rule} active={stage === 3 ? active : -1} />
    <span className="absolute flex items-center justify-center whitespace-nowrap font-mono text-[10px] tracking-[0.2em] text-white/45 max-md:text-[9px] max-md:tracking-[0.12em]"
      style={box(layout.label)}>
      OXX LAB / FORMAL REASONING SYSTEM
    </span>
    {PATHS.map((s, i) => (
      <span key={s.num} aria-hidden="true" data-lit={lit(i)} style={phraseAt(i)}
        className="oxx-phrase font-body text-[clamp(15px,1.3vw,22px)] font-medium leading-[1.15] tracking-[-0.03em]">
        {s.phrase}
      </span>
    ))}
    <nav aria-label="Explore OXX">
      {PATHS.map((s, i) => (
        <Link
          key={s.num} to={s.to} aria-label={`${s.name}: ${s.desc}`}
          data-open={stage === 3} data-active={stage === 3 && active === i} data-from={!compact && i === 0 ? 'right' : 'left'}
          className="oxx-card absolute" style={{ ...box(cards[i]), animationDelay: `${i * 90}ms` }}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(-1)}
          onFocus={() => { setStage(3); setActive(i); }}
          onBlur={() => setActive(-1)}>
          <span className="card-sub flex items-center justify-between font-mono text-[10px] tracking-[.12em]">
            <span>{s.num} / {s.eyebrow}</span><span className="card-arrow text-base">↗</span>
          </span>
          <span>
            <span className="block font-mono text-[clamp(26px,2.4vw,38px)] font-bold uppercase leading-[.9] tracking-[-.06em]">{s.name}</span>
            <span className="card-sub mt-3 block max-w-[240px] font-body text-[12px] leading-[1.45]">{s.desc}</span>
          </span>
        </Link>
      ))}
    </nav>
  </section>;
}
