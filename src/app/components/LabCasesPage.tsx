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
      <button onClick={() => navigate('/lab/cases')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 32, padding: 0 }}>← All Cases</button>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5, marginBottom: 8 }}>{caseData.domain} · {caseData.year}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 38, fontWeight: 600, color: '#fff', letterSpacing: '-0.04em', margin: 0 }}>{caseData.title}</h1>
          {relatedProjects.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {relatedProjects.map(p => (
                <Link key={p.label} to={p.path} style={{
                  padding: '5px 12px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                  color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, textDecoration: 'none',
                  transition: 'border-color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,30,0,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  → {p.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 600 }}>{caseData.desc}</p>
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['snapshot', 'intent', 'rules', 'strategy', 'observation', 'evaluation'].map(tab => (
          <button key={tab} onClick={() => setCaseTab(tab)} style={{
            padding: '10px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: caseTab === tab ? '#FF1E00' : 'rgba(255,255,255,0.3)',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: caseTab === tab ? '2px solid #FF1E00' : '2px solid transparent', marginBottom: -1,
          }}>{tab}</button>
        ))}
      </div>

      {caseTab === 'snapshot' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {Object.entries(caseData.snapshot).map(([k, v]) => (
            <div key={k} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'intent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Emotional Tone</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{caseData.intents.map(t => <Chip key={t} label={t} active />)}</div>
          </div>
          <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Strategies</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{caseData.strategies.map(s => <Chip key={s} label={s} active />)}</div>
          </div>
        </div>
      )}

      {caseTab === 'rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {Object.entries(caseData.baseRules).map(([k, v]) => (
            <div key={k} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FF1E00' }}>{Array.isArray(v) ? v.join(', ') : v}</div>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'strategy' && (
        <div>{Object.entries(caseData.strategyDetail).map(([k, v]) => (
          <div key={k} style={{ padding: 16, marginBottom: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,30,0,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>{k}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{v}</div>
          </div>
        ))}</div>
      )}

      {caseTab === 'observation' && (
        <div>
          {[
            { key: 'worked', label: 'What Worked', bg: 'rgba(255,30,0,0.06)', bc: 'rgba(255,30,0,0.15)' },
            { key: 'failed', label: 'What Failed', bg: 'rgba(255,60,60,0.04)', bc: 'rgba(255,60,60,0.12)' },
            { key: 'mismatch', label: 'Mismatch Notes', bg: 'rgba(255,180,0,0.04)', bc: 'rgba(255,180,0,0.12)' },
            { key: 'nextIteration', label: 'Next Iteration', bg: 'rgba(255,255,255,0.02)', bc: 'rgba(255,255,255,0.08)' },
          ].map(item => (
            <div key={item.key} style={{ padding: 20, marginBottom: 12, background: item.bg, border: `1px solid ${item.bc}`, borderRadius: 3 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: item.bc.replace(/[\d.]+\)$/, '0.7)'), textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>{item.label}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{caseData.observation[item.key]}</p>
            </div>
          ))}
        </div>
      )}

      {caseTab === 'evaluation' && (
        <div style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
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
      <div style={{ padding: '40px', maxWidth: 1100, margin: '0 auto' }}>
        {selectedCase ? (
          <CaseDetail caseData={selectedCase} />
        ) : (
          <div>
            <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 34, fontWeight: 600, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>Cases</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', marginBottom: 40 }}>Not a gallery. Each case is a data point where OXX operated.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {CASES.map(c => (
                <div key={c.id} onClick={() => navigate(`/lab/cases/${c.id}`)}
                  style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, cursor: 'pointer', transition: 'border-color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,30,0,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                  <div style={{ height: 140, background: 'rgba(255,255,255,0.03)', borderRadius: 2, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RadarChart scores={c.scores} labels={EVAL_METRICS.map(m => m.split(' ')[0])} size={120} />
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5, marginBottom: 6 }}>{c.domain} · {c.year}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: '#fff', fontWeight: 500, marginBottom: 8 }}>{c.title}</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, marginBottom: 12 }}>{c.desc.slice(0, 80)}…</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {c.intents.map(t => <span key={t} style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 1 }}>{t}</span>)}
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