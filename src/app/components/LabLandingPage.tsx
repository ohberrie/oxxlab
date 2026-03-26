import { useNavigate } from 'react-router';
import { CASES, EVAL_METRICS } from './LabData';
import { DarkPageWrapper, RadarChart, PipelineDiagram } from './LabShared';
import { NavBar } from './NavBar';

export function LabLandingPage() {
  const navigate = useNavigate();

  return (
    <DarkPageWrapper>
      {/* Unified Nav — floating gradient on landing */}
      <NavBar mode="lab" dark transparent />

      {/* HERO */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
          <svg width="100%" height="100%" viewBox="0 0 800 600">
            {Array.from({ length: 20 }, (_, i) => <line key={i} x1={40 * i} y1={0} x2={40 * i + 200} y2={600} stroke="#FF1E00" strokeWidth={0.5} />)}
            {Array.from({ length: 12 }, (_, i) => <circle key={`c${i}`} cx={100 + i * 60} cy={300 + Math.sin(i) * 100} r={2 + i * 3} fill="none" stroke="#FF1E00" strokeWidth={0.3} />)}
          </svg>
        </div>
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 600, color: '#fff', letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 20 }}>
            OXX<span style={{ color: '#FF1E00' }}>.</span>
          </h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(11px, 1.2vw, 14px)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', maxWidth: 520, margin: '0 auto 48px' }}>
            A decision interface for meaning, form, and perception
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/lab/systems')} style={{
              padding: '14px 32px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase', background: '#FF1E00',
              color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 600,
            }}>Explore System</button>
            <button onClick={() => navigate('/lab/cases')} style={{
              padding: '14px 32px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
              letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent',
              color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 2, cursor: 'pointer',
            }}>Explore Cases</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase', animation: 'pulse 2s infinite' }}>
          scroll to explore
        </div>
      </div>

      {/* 3-COLUMN: Meaning / Form / Perception */}
      <div style={{ padding: '120px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
          {[
            { num: '01', title: 'Meaning', desc: 'Design begins with structured intent — not mood, not style.' },
            { num: '02', title: 'Form Strategy', desc: 'Form is the spatial, material, structural translation of meaning under constraint.' },
            { num: '03', title: 'Perception', desc: 'The test is whether the perceived experience aligns with intended meaning.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '32px 24px', borderTop: '1px solid rgba(255,30,0,0.15)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5 }}>{item.num}</span>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 26, fontWeight: 600, color: '#fff', margin: '12px 0 16px', letterSpacing: '-0.03em' }}>{item.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PIPELINE OVERVIEW */}
      <div style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40 }}>Pipeline Overview</h2>
        <PipelineDiagram currentStep="base" />
      </div>

      {/* FEATURED CASES */}
      <div style={{ padding: '80px 40px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 40 }}>Featured Cases</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {CASES.map(c => (
            <div key={c.id} onClick={() => navigate(`/lab/cases/${c.id}`)}
              style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, cursor: 'pointer', transition: 'border-color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,30,0,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
              <div style={{ height: 120, background: 'rgba(255,255,255,0.03)', borderRadius: 2, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RadarChart scores={c.scores} labels={EVAL_METRICS.map(m => m.split(' ')[0])} size={110} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5, marginBottom: 6 }}>{c.domain} · {c.year}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: '#fff', fontWeight: 500, marginBottom: 8 }}>{c.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.intents.map(t => <span key={t} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1 }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STUDIO / CONTACT FOLD */}
      <div style={{ padding: '100px 40px 120px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>Studio</div>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 30, fontWeight: 600, color: '#fff', marginBottom: 16, letterSpacing: '-0.03em' }}>Collaboration & Inquiry</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 32 }}>
          OXX operates across stage design, exhibition, spatial installation, and computational object-making.
        </p>
        <button onClick={() => navigate('/projects')} style={{
          padding: '14px 32px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          letterSpacing: '0.06em', textTransform: 'uppercase', background: 'transparent',
          color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 2, cursor: 'pointer',
        }}>Studio →</button>
      </div>
    </DarkPageWrapper>
  );
}
