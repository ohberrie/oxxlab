import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { CASES, EVAL_METRICS, CASE_RELATED_PROJECTS, CaseData } from './LabData';
import { DarkLabNav, DarkPageWrapper, Chip, RadarChart } from './LabShared';

function CaseDetail({ caseData }: { caseData: CaseData }) {
  const [caseTab, setCaseTab] = useState('snapshot');
  const navigate = useNavigate();
  const relatedProjects = CASE_RELATED_PROJECTS[caseData.id] || [];

  return (
    <div>
      <button onClick={() => navigate('/lab/cases')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 40, padding: 0 }}>← All Cases</button>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5, marginBottom: 8 }}>{caseData.domain} · {caseData.year}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 38, fontWeight: 600, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>{caseData.title}</h1>
          {relatedProjects.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {relatedProjects.map(p => (
                <Link key={p.label} to={p.path} style={{
                  padding: '6px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)',
                  borderRadius: 20, textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,30,0,0.3)'; e.currentTarget.style.color = '#FF1E00'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
                  → {p.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 600 }}>{caseData.desc}</p>
      </div>
      {/* Pill-style tab bar */}
      <div style={{ display: 'inline-flex', gap: 4, marginBottom: 40, padding: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 14 }}>
        {['snapshot', 'intent', 'rules', 'strategy', 'observation', 'evaluation'].map(tab => (
          <button key={tab} onClick={() => setCaseTab(tab)} style={{
            padding: '8px 18px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: caseTab === tab ? '#FF1E00' : 'rgba(255,255,255,0.35)',
            background: caseTab === tab ? 'rgba(255,30,0,0.08)' : 'transparent',
            border: 'none', cursor: 'pointer', borderRadius: 10,
            transition: 'all 0.25s ease',
            boxShadow: caseTab === tab ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
          }}>{tab}</button>
        ))}
      </div>

      {caseTab === 'snapshot' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {Object.entries(caseData.snapshot).map(([k, v]) => (
            <div key={k} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'intent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Emotional Tone</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{caseData.intents.map(t => <Chip key={t} label={t} active />)}</div>
          </div>
          <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Strategies</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{caseData.strategies.map(s => <Chip key={s} label={s} active />)}</div>
          </div>
        </div>
      )}

      {caseTab === 'rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {Object.entries(caseData.baseRules).map(([k, v]) => (
            <div key={k} style={{ padding: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FF1E00' }}>{Array.isArray(v) ? v.join(', ') : v}</div>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'strategy' && (
        <div>{Object.entries(caseData.strategyDetail).map(([k, v]) => (
          <div key={k} style={{ padding: 20, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,30,0,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{v}</div>
          </div>
        ))}</div>
      )}

      {caseTab === 'observation' && (
        <div>
          {[
            { key: 'worked', label: 'What Worked', bg: 'rgba(255,30,0,0.06)', shadow: 'rgba(255,30,0,0.08)' },
            { key: 'failed', label: 'What Failed', bg: 'rgba(255,60,60,0.04)', shadow: 'rgba(255,60,60,0.08)' },
            { key: 'mismatch', label: 'Mismatch Notes', bg: 'rgba(255,180,0,0.04)', shadow: 'rgba(255,180,0,0.08)' },
            { key: 'nextIteration', label: 'Next Iteration', bg: 'rgba(255,255,255,0.02)', shadow: 'rgba(255,255,255,0.04)' },
          ].map(item => (
            <div key={item.key} style={{ padding: 24, marginBottom: 16, background: item.bg, borderRadius: 12, boxShadow: `0 0 0 1px ${item.shadow}, 0 2px 8px rgba(0,0,0,0.1)` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: item.shadow.replace(/[\d.]+\)$/, '0.7)'), textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{item.label}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{caseData.observation[item.key]}</p>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'evaluation' && (
        <div style={{ padding: 28, background: 'rgba(255,255,255,0.03)', borderRadius: 16, boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>Intent vs Perceived</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}><RadarChart scores={caseData.scores} intentScores={caseData.intentScores} labels={EVAL_METRICS} size={300} /></div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 3, background: '#FF1E00', display: 'inline-block' }} /> Perceived</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}><span style={{ width: 10, height: 3, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} /> Intended</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function LabCasesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedCase = id ? CASES.find(c => c.id === Number(id)) : null;

  return (
    <DarkPageWrapper>
      <DarkLabNav />
      <div style={{ padding: '48px 58px', maxWidth: 1100, margin: '0 auto' }}>
        {selectedCase ? (
          <CaseDetail caseData={selectedCase} />
        ) : (
          <div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 34, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.03em', marginBottom: 8 }}>Cases</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 48 }}>Not a gallery. Each case is a data point where OXX operated.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {CASES.map(c => (
                <div key={c.id} onClick={() => navigate(`/lab/cases/${c.id}`)}
                  style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 16, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,30,0,0.15), 0 4px 16px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.15)'; }}>
                  <div style={{ height: 140, background: 'rgba(255,255,255,0.02)', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RadarChart scores={c.scores} labels={EVAL_METRICS.map(m => m.split(' ')[0])} size={120} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5, marginBottom: 6 }}>{c.domain} · {c.year}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: '#fff', fontWeight: 500, marginBottom: 8 }}>{c.title}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, marginBottom: 12 }}>{c.desc.slice(0, 80)}…</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.intents.map(t => <span key={t} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)', padding: '3px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 20 }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DarkPageWrapper>
  );
}
