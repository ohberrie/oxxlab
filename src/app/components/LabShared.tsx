import { useState } from 'react';
import { GLOSSARY, STEPS } from './LabData';
import { NavBar } from './NavBar';

// Backward-compat wrapper
export function DarkLabNav() {
  return <NavBar mode="lab" dark />;
}

// ─── UTILITY COMPONENTS ─────────────────────────────────────────

export function Chip({ label, active, onClick, dim }: {
  label: string; active?: boolean; onClick?: () => void; dim?: boolean;
}) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.03em',
      border: active ? '1px solid #FF1E00' : '1px solid rgba(255,255,255,0.12)', borderRadius: 2,
      background: active ? 'rgba(255,30,0,0.08)' : 'transparent',
      color: dim ? 'rgba(255,255,255,0.2)' : active ? '#FF1E00' : 'rgba(255,255,255,0.55)',
      cursor: dim ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      textDecoration: dim ? 'line-through' : 'none', pointerEvents: dim ? 'none' : 'auto',
    }}>{label}</button>
  );
}

export function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF1E00', opacity: 0.6 }}>{num}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em' }}>{label}</span>
    </div>
  );
}

export function GlossaryTerm({ term, children, expert }: {
  term: string; children?: React.ReactNode; expert?: boolean;
}) {
  const [show, setShow] = useState(false);
  if (expert) return <>{children || term}</>;
  return (
    <span style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: '1px dotted rgba(255,30,0,0.3)', cursor: 'help' }}>{children || term}</span>
      {show && GLOSSARY[term] && (
        <span style={{
          position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)',
          background: '#141414', border: '1px solid rgba(255,30,0,0.2)', padding: '8px 12px',
          fontSize: 11, color: 'rgba(255,255,255,0.65)', width: 260, lineHeight: 1.5,
          borderRadius: 3, zIndex: 99, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'normal',
          pointerEvents: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#FF1E00', opacity: 0.5, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{term}</span>
          {GLOSSARY[term]}
        </span>
      )}
    </span>
  );
}

export function ExampleButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em',
      color: 'rgba(255,30,0,0.5)', background: 'rgba(255,30,0,0.03)',
      border: '1px dashed rgba(255,30,0,0.15)', borderRadius: 2, cursor: 'pointer',
    }}>↳ {label}</button>
  );
}

// ─── RADAR CHART ────────────────────────────────────────────────

export function RadarChart({ scores, intentScores, labels, size = 220 }: {
  scores: number[]; intentScores?: number[]; labels: string[]; size?: number;
}) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = labels.length;
  const angleStep = (Math.PI * 2) / n;
  const pt = (i: number, val: number): [number, number] => {
    const a = -Math.PI / 2 + i * angleStep;
    return [cx + r * val * Math.cos(a), cy + r * val * Math.sin(a)];
  };
  const poly = (vals: number[], color: string, op: number) => {
    const pts = vals.map((v, i) => pt(i, v).join(',')).join(' ');
    return <polygon points={pts} fill={color} fillOpacity={op} stroke={color} strokeWidth={1.2} />;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.25, 0.5, 0.75, 1].map((s, i) => (
        <polygon key={i} points={Array.from({ length: n }, (_, j) => pt(j, s).join(',')).join(' ')} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
      ))}
      {labels.map((l, i) => {
        const [x, y] = pt(i, 1.22);
        return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.4)" fontSize={8} fontFamily="'JetBrains Mono', monospace">
          {l.split(' ').map((w, wi) => <tspan key={wi} x={x} dy={wi === 0 ? 0 : 10}>{w}</tspan>)}
        </text>;
      })}
      {intentScores && poly(intentScores, '#555', 0.15)}
      {poly(scores, '#FF1E00', 0.12)}
      {scores.map((v, i) => { const [x, y] = pt(i, v); return <circle key={i} cx={x} cy={y} r={3} fill="#FF1E00" />; })}
      {intentScores && intentScores.map((v, i) => { const [x, y] = pt(i, v); return <circle key={`i${i}`} cx={x} cy={y} r={2.5} fill="rgba(255,255,255,0.3)" />; })}
    </svg>
  );
}

// ─── COMPARE BAR ────────────────────────────────────────────────

export function CompareBar({ label, values, colors }: {
  label: string; values: number[]; colors: string[];
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {values.map((v, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${v * 100}%`, background: colors[i], borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: colors[i], marginTop: 3, textAlign: 'center' }}>{Math.round(v * 100)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CONSTRAINT ZONE ────────────────────────────────────────────

export function ConstraintZone({ baseRules, intents }: {
  baseRules: { domain: string | null; constraints: string[] };
  intents: { tones: string[] };
}) {
  const strategies = [
    { label: 'Centered Hierarchy', x: 25, y: 22 }, { label: 'Distributed Field', x: 70, y: 17 },
    { label: 'Immersive Envelope', x: 15, y: 58 }, { label: 'Fragmented Array', x: 75, y: 53 },
    { label: 'Linear Sequence', x: 50, y: 37 }, { label: 'Radial Focus', x: 35, y: 73 },
    { label: 'Layered Depth', x: 60, y: 76 }, { label: 'Minimal Void', x: 85, y: 42 },
    { label: 'Parametric Surface', x: 45, y: 88 },
  ];
  const getZone = (s: { label: string }) => {
    if (!baseRules.domain && intents.tones.length === 0) return 'neutral';
    let score = 0;
    if (baseRules.domain === 'Stage' && s.label.includes('Hierarchy')) score += 2;
    if (baseRules.domain === 'Exhibition' && s.label.includes('Distributed')) score += 2;
    if (baseRules.domain === 'Object' && s.label.includes('Parametric')) score += 2;
    if (intents.tones.includes('Tension') && s.label.includes('Fragment')) score += 1;
    if (intents.tones.includes('Stillness') && s.label.includes('Minimal')) score += 2;
    if (intents.tones.includes('Monumentality') && s.label.includes('Centered')) score += 1;
    if (intents.tones.includes('Fluidity') && s.label.includes('Parametric')) score += 2;
    if (baseRules.constraints.includes('Hard') && s.label.includes('Fragmented')) score -= 1;
    return score >= 2 ? 'allowed' : score >= 0 ? 'risky' : 'blocked';
  };
  const zc: Record<string, { bg: string; border: string; text: string }> = {
    allowed: { bg: 'rgba(255,30,0,0.12)', border: 'rgba(255,30,0,0.4)', text: '#FF1E00' },
    risky: { bg: 'rgba(93,255,217,0.08)', border: 'rgba(93,255,217,0.3)', text: 'rgba(93,255,217,0.7)' },
    blocked: { bg: 'rgba(255,60,60,0.06)', border: 'rgba(255,60,60,0.2)', text: 'rgba(255,60,60,0.4)' },
    neutral: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)', text: 'rgba(255,255,255,0.3)' },
  };
  return (
    <div style={{ position: 'relative', width: '100%', height: 380, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ position: 'absolute', top: 12, left: 14, display: 'flex', gap: 16, fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>
        {(['allowed', 'risky', 'blocked'] as const).map(z => (
          <span key={z} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: 1, background: zc[z].border }} />
            <span style={{ color: zc[z].text }}>{z}</span>
          </span>
        ))}
      </div>
      {strategies.map((s, i) => {
        const zone = getZone(s); const c = zc[zone];
        return (
          <div key={i} style={{
            position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)',
            padding: '8px 14px', background: c.bg, border: `1px solid ${c.border}`, borderRadius: 2,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: c.text,
            transition: 'all 0.4s', cursor: zone === 'blocked' ? 'not-allowed' : 'pointer',
          }}>
            {s.label}{zone === 'blocked' && <span style={{ marginLeft: 6, fontSize: 9, opacity: 0.5 }}>✕</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─── PIPELINE DIAGRAM ───────────────────────────────────────────

export function PipelineDiagram({ currentStep }: { currentStep: string }) {
  const nodes = [
    { id: 'base', label: 'Base Rules', x: 60 }, { id: 'intent', label: 'Intent', x: 190 },
    { id: 'constraint', label: 'Constraints', x: 320 }, { id: 'strategy', label: 'Strategy', x: 450 },
    { id: 'implementation', label: 'Implement', x: 575 }, { id: 'evaluation', label: 'Evaluation', x: 700 },
  ];
  const si = STEPS.findIndex(s => s.id === currentStep);
  return (
    <svg width="100%" height={100} viewBox="0 0 760 100" style={{ overflow: 'visible' }}>
      {nodes.map((n, i) => {
        if (i < nodes.length - 1) {
          const nx = nodes[i + 1]; const active = i < si;
          return <line key={`l${i}`} x1={n.x + 34} y1={50} x2={nx.x - 34} y2={50}
            stroke={active ? 'rgba(255,30,0,0.4)' : 'rgba(255,255,255,0.08)'} strokeWidth={1.5}
            strokeDasharray={active ? 'none' : '4 4'} />;
        }
        return null;
      })}
      {nodes.map((n, i) => {
        const isA = STEPS[i]?.id === currentStep; const isP = i < si;
        return (
          <g key={n.id}>
            <rect x={n.x - 34} y={32} width={68} height={36} rx={3}
              fill={isA ? 'rgba(255,30,0,0.15)' : isP ? 'rgba(255,30,0,0.05)' : 'rgba(255,255,255,0.02)'}
              stroke={isA ? '#FF1E00' : isP ? 'rgba(255,30,0,0.3)' : 'rgba(255,255,255,0.08)'} strokeWidth={1.2} />
            <text x={n.x} y={51} textAnchor="middle" dominantBaseline="middle"
              fill={isA ? '#FF1E00' : isP ? 'rgba(255,30,0,0.6)' : 'rgba(255,255,255,0.2)'}
              fontSize={9} fontFamily="'JetBrains Mono', monospace" fontWeight={isA ? 600 : 400}>{n.label}</text>
            {isP && <circle cx={n.x + 26} cy={40} r={4} fill="#FF1E00" fillOpacity={0.6} />}
          </g>
        );
      })}
    </svg>
  );
}

// ─── DARK PAGE WRAPPER ──────────────────────────────────────────

export function DarkPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .dark-lab-page ::-webkit-scrollbar { width: 4px; }
        .dark-lab-page ::-webkit-scrollbar-track { background: transparent; }
        .dark-lab-page ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .dark-lab-page ::selection { background: rgba(255,30,0,0.2); color: #fff; }
        .dark-lab-page input[type=range] { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; appearance: auto; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      `}</style>
      <div className="dark-lab-page">
        {children}
      </div>
    </div>
  );
}
