import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  STEPS, DOMAINS, WORLD_AXES, VISIBILITY, ACTORS, CONSTRAINT_TYPES,
  EMOTIONAL_TONES, IDENTITY_POSITIONS, NARRATIVE_FUNCTIONS,
  SPATIAL_GRAMMAR, FORM_GEN, MATERIAL,
  EVAL_METRICS, COMPARE_METRICS, EXAMPLE_PRESETS, CASES,
  BaseRules, Intents, StrategySelections, ImplSettings, SavedStrategy,
} from './LabData';
import {
  DarkLabNav, DarkPageWrapper, Chip, SectionTitle, GlossaryTerm,
  ExampleButton, RadarChart, CompareBar, ConstraintZone, PipelineDiagram,
} from './LabShared';

/* cache-bust */
export function LabSystemPage() {
  const navigate = useNavigate();
  const [systemStep, setSystemStep] = useState('intro');
  const [expertMode, setExpertMode] = useState(false);
  const [baseRules, setBaseRules] = useState<BaseRules>({ domain: null, world: [], visibility: null, actor: null, constraints: [] });
  const [intents, setIntents] = useState<Intents>({ tones: [], positions: [], narratives: [] });
  const [strategySelections, setStrategySelections] = useState<StrategySelections>({ spatial: {}, form: {}, material: {} });
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [evalScores, setEvalScores] = useState([0.7, 0.6, 0.8, 0.5, 0.65]);
  const [implSettings, setImplSettings] = useState<ImplSettings>({ complexity: 'medium', fabrication: true, camera: false, costSensitivity: 'moderate' });
  const [shareNotice, setShareNotice] = useState(false);

  const toggleArray = (arr: string[], item: string) => arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
  const stratColors = ['#FF1E00', '#5DFFD9', '#ff6b6b', '#ffd93d'];

  const getConstraintExplanation = () => {
    const lines: string[] = [];
    if (baseRules.domain === 'Stage' && baseRules.visibility === 'System-emphasis')
      lines.push('Stage domain conflicts with system-emphasis visibility — front-camera legibility may be compromised.');
    if (intents.tones.includes('Tension') && intents.tones.includes('Stillness'))
      lines.push('Intent conflict: Tension ↔ Stillness — contradictory spatial strategies narrow the design space.');
    if (baseRules.constraints.includes('Hard') && intents.tones.includes('Fluidity'))
      lines.push('Hard constraints limit Fluidity — organic form strategies become restricted.');
    if (intents.tones.length > 4)
      lines.push('Too many intent vectors — consider narrowing to 2–3 for formal coherence.');
    if (lines.length === 0) lines.push('Select base rules and intents to see constraint analysis.');
    return lines;
  };

  const saveCurrentStrategy = () => {
    if (savedStrategies.length >= 4) return;
    const idx = savedStrategies.length;
    setSavedStrategies([...savedStrategies, {
      id: Date.now(), label: `Strategy ${String.fromCharCode(65 + idx)}`, color: stratColors[idx],
      spatial: { ...strategySelections.spatial }, form: { ...strategySelections.form }, material: { ...strategySelections.material },
      scores: evalScores.map(s => Math.max(0, Math.min(1, s + (Math.random() * 0.2 - 0.1)))),
      compareScores: {
        meaningFit: 0.5 + Math.random() * 0.5, perceptualDensity: 0.3 + Math.random() * 0.6,
        fabrication: 0.2 + Math.random() * 0.7,
        stageSuit: baseRules.domain === 'Stage' ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.5,
        cameraSuit: baseRules.visibility === 'Human-emphasis' ? 0.6 + Math.random() * 0.4 : 0.3 + Math.random() * 0.4,
      },
    }]);
  };

  const handleShare = () => {
    const encoded = btoa(JSON.stringify({ b: baseRules, i: intents, s: strategySelections }));
    const url = `${window.location.origin}${window.location.pathname}?state=${encoded.slice(0, 60)}`;
    navigator.clipboard?.writeText(url).then(() => { setShareNotice(true); setTimeout(() => setShareNotice(false), 2000); });
  };

  // ═══ STEP RENDERERS ═══

  const renderBaseRules = () => (
    <div>
      <SectionTitle num="01" label="Base Rules" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 20 }}>
        {expertMode ? 'Define world-level premises. Domain, spatiotemporal axes, visibility emphasis, actor structure, constraint hardness.'
          : <>Define the world conditions. Hover any <GlossaryTerm term="Base Rules" expert={expertMode}>underlined term</GlossaryTerm> for a definition.</>}
      </p>
      <ExampleButton label={EXAMPLE_PRESETS.base.label} onClick={() => setBaseRules(EXAMPLE_PRESETS.base.data)} />
      <div style={{ marginTop: 20 }}>
        {[
          { label: 'Domain', opts: DOMAINS, val: baseRules.domain, set: (d: string) => setBaseRules({ ...baseRules, domain: d }) },
        ].map(({ label, opts, val, set }) => (
          <div key={label} style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{label}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{opts.map(o => <Chip key={o} label={o} active={val === o} onClick={() => set(o)} />)}</div>
          </div>
        ))}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>World Axes</div>
          <div style={{ display: 'flex', gap: 8 }}>{WORLD_AXES.map(w => <Chip key={w} label={w} active={baseRules.world.includes(w)} onClick={() => setBaseRules({ ...baseRules, world: toggleArray(baseRules.world, w) })} />)}</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Visibility Emphasis</div>
          <div style={{ display: 'flex', gap: 8 }}>{VISIBILITY.map(v => <Chip key={v} label={v} active={baseRules.visibility === v} onClick={() => setBaseRules({ ...baseRules, visibility: v })} />)}</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Main Actor</div>
          <div style={{ display: 'flex', gap: 8 }}>{ACTORS.map(a => <Chip key={a} label={a} active={baseRules.actor === a} onClick={() => setBaseRules({ ...baseRules, actor: a })} />)}</div>
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Constraint Type</div>
          <div style={{ display: 'flex', gap: 8 }}>{CONSTRAINT_TYPES.map(c => <Chip key={c} label={c} active={baseRules.constraints.includes(c)} onClick={() => setBaseRules({ ...baseRules, constraints: toggleArray(baseRules.constraints, c) })} />)}</div>
        </div>
      </div>
    </div>
  );

  const renderIntent = () => (
    <div>
      <SectionTitle num="02" label="Intent Vector" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 20 }}>
        {expertMode ? 'Structured meaning input. Emotional tone × identity positioning × narrative function.'
          : <>Not a mood board. Each <GlossaryTerm term="Intent Vector" expert={expertMode}>intent</GlossaryTerm> narrows the strategy space.</>}
      </p>
      <ExampleButton label={EXAMPLE_PRESETS.intent.label} onClick={() => setIntents(EXAMPLE_PRESETS.intent.data)} />
      <div style={{ marginTop: 20, marginBottom: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          <GlossaryTerm term="Emotional Tone" expert={expertMode}>Emotional Tone</GlossaryTerm>
          {intents.tones.length > 3 && <span style={{ color: 'rgba(255,180,0,0.7)', marginLeft: 8 }}>narrowing recommended</span>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{EMOTIONAL_TONES.map(t => <Chip key={t} label={t} active={intents.tones.includes(t)} onClick={() => setIntents({ ...intents, tones: toggleArray(intents.tones, t) })} />)}</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          <GlossaryTerm term="Identity Positioning" expert={expertMode}>Identity Positioning</GlossaryTerm>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{IDENTITY_POSITIONS.map(p => <Chip key={p} label={p} active={intents.positions.includes(p)} onClick={() => setIntents({ ...intents, positions: toggleArray(intents.positions, p) })} />)}</div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          <GlossaryTerm term="Narrative Function" expert={expertMode}>Narrative Function</GlossaryTerm> <span style={{ opacity: 0.5 }}>(1–2 max)</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {NARRATIVE_FUNCTIONS.map(n => <Chip key={n} label={n} active={intents.narratives.includes(n)}
            dim={!intents.narratives.includes(n) && intents.narratives.length >= 2}
            onClick={() => { if (intents.narratives.includes(n)) setIntents({ ...intents, narratives: intents.narratives.filter(x => x !== n) }); else if (intents.narratives.length < 2) setIntents({ ...intents, narratives: [...intents.narratives, n] }); }} />)}
        </div>
      </div>
    </div>
  );

  const renderConstraint = () => (
    <div>
      <SectionTitle num="03" label="Constraint Compiler" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
        {expertMode ? 'Base Rules + Intent → compressed strategy space.'
          : <><GlossaryTerm term="Constraint Compiler" expert={expertMode}>Rules + Intent</GlossaryTerm> compress the possible strategy space.</>}
      </p>
      <ConstraintZone baseRules={baseRules} intents={intents} />
    </div>
  );

  const renderStrategy = () => (
    <div>
      <SectionTitle num="04" label="Form Strategy Explorer" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 20 }}>
        {expertMode ? 'Three structural layers. Configure, snapshot, compare.'
          : <>Structural choices across three layers of <GlossaryTerm term="Form Strategy" expert={expertMode}>form strategy</GlossaryTerm>.</>}
      </p>
      {[
        { title: 'A. Spatial Grammar', data: SPATIAL_GRAMMAR, key: 'spatial' as const },
        { title: 'B. Form Generation', data: FORM_GEN, key: 'form' as const },
        { title: 'C. Material / Light / Media', data: MATERIAL, key: 'material' as const },
      ].map(layer => (
        <div key={layer.key} style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,30,0,0.5)', marginBottom: 14 }}>{layer.title}</div>
          {Object.entries(layer.data).map(([param, opts]) => (
            <div key={param} style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{param}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {opts.map(o => <Chip key={o} label={o} active={strategySelections[layer.key]?.[param] === o}
                  onClick={() => setStrategySelections({ ...strategySelections, [layer.key]: { ...strategySelections[layer.key], [param]: o } })} />)}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={saveCurrentStrategy} disabled={savedStrategies.length >= 4} style={{
          padding: '10px 24px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          background: savedStrategies.length >= 4 ? 'rgba(255,255,255,0.05)' : 'rgba(255,30,0,0.1)',
          color: savedStrategies.length >= 4 ? 'rgba(255,255,255,0.2)' : '#FF1E00',
          border: `1px solid ${savedStrategies.length >= 4 ? 'rgba(255,255,255,0.05)' : 'rgba(255,30,0,0.3)'}`, borderRadius: 2,
          cursor: savedStrategies.length >= 4 ? 'not-allowed' : 'pointer',
        }}>+ Save Snapshot ({savedStrategies.length}/4)</button>
        <button onClick={handleShare} style={{ padding: '10px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: 'transparent', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2, cursor: 'pointer' }}>
          {shareNotice ? '✓ Copied' : 'Share URL'}
        </button>
      </div>
      {savedStrategies.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Compare Strategies</div>
          <div style={{ marginBottom: 24, padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>
              {savedStrategies.map(s => <span key={s.id} style={{ color: s.color, marginRight: 14 }}>■ {s.label}</span>)}
            </div>
            {COMPARE_METRICS.map(m => <CompareBar key={m.key} label={m.label} values={savedStrategies.map(s => s.compareScores[m.key])} colors={savedStrategies.map(s => s.color)} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${savedStrategies.length}, 1fr)`, gap: 12 }}>
            {savedStrategies.map(s => (
              <div key={s.id} style={{ padding: 16, background: 'rgba(255,255,255,0.02)', border: `1px solid ${s.color}22`, borderRadius: 3 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: s.color, marginBottom: 12 }}>{s.label}</div>
                {Object.entries(s.spatial).map(([k, v]) => <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>{k}: <span style={{ color: 'rgba(255,255,255,0.6)' }}>{v}</span></div>)}
                <div style={{ marginTop: 10 }}><RadarChart scores={s.scores} labels={EVAL_METRICS.map(m => m.split(' ')[0])} size={130} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderImplementation = () => (
    <div>
      <SectionTitle num="05" label="Implementation Preview" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
        {expertMode ? 'Strategy → reality. Complexity, fabrication, camera, cost.'
          : <>Not a final render. Where your strategy meets real-world constraints.</>}
      </p>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Complexity Level</div>
        <div style={{ display: 'flex', gap: 8 }}>{['low', 'medium', 'high'].map(c => <Chip key={c} label={c} active={implSettings.complexity === c} onClick={() => setImplSettings({ ...implSettings, complexity: c })} />)}</div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Constraint Toggles</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[{ key: 'fabrication' as const, label: 'Fabrication Constraint' }, { key: 'camera' as const, label: 'Camera Emphasis' }].map(t => (
            <button key={t.key} onClick={() => setImplSettings({ ...implSettings, [t.key]: !implSettings[t.key] })} style={{
              padding: '8px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              background: implSettings[t.key] ? 'rgba(255,30,0,0.08)' : 'transparent',
              color: implSettings[t.key] ? '#FF1E00' : 'rgba(255,255,255,0.3)',
              border: `1px solid ${implSettings[t.key] ? 'rgba(255,30,0,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 2, cursor: 'pointer',
            }}>{implSettings[t.key] ? '●' : '○'} {t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Cost / Time Sensitivity</div>
        <div style={{ display: 'flex', gap: 8 }}>{['low', 'moderate', 'high'].map(c => <Chip key={c} label={c} active={implSettings.costSensitivity === c} onClick={() => setImplSettings({ ...implSettings, costSensitivity: c })} />)}</div>
      </div>
      {/* Massing Preview */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Diagrammatic Massing Preview</div>
        <svg width="100%" height={200} viewBox="0 0 600 200" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
          {(() => {
            const sym = strategySelections.spatial?.symmetry;
            const cent = strategySelections.spatial?.centrality;
            const curv = strategySelections.form?.curvature;
            const comp = implSettings.complexity;
            const count = comp === 'low' ? 3 : comp === 'medium' ? 6 : 10;
            const els: React.ReactNode[] = [];
            for (let i = 0; i < count; i++) {
              const x = cent === 'Centered' ? 250 + (i - count / 2) * 30 : 60 + i * (480 / count);
              const y = sym === 'Bilateral' ? 100 : 70 + Math.sin(i * 0.8) * 40;
              const w = comp === 'low' ? 40 : comp === 'medium' ? 28 : 18;
              const h = 40 + (i % 3) * 25;
              const op = 0.15 + (i / count) * 0.3;
              if (curv === 'Organic' || curv === 'Parametric')
                els.push(<ellipse key={i} cx={x} cy={y} rx={w * 0.7} ry={h * 0.5} fill="none" stroke="#FF1E00" strokeWidth={1} opacity={op} />);
              else
                els.push(<rect key={i} x={x - w / 2} y={y - h / 2} width={w} height={h} rx={curv === 'Angular' ? 0 : 2} fill="none" stroke="#FF1E00" strokeWidth={1} opacity={op} />);
              if (implSettings.camera)
                els.push(<line key={`cam${i}`} x1={300} y1={190} x2={x} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="2 4" />);
            }
            if (implSettings.fabrication) {
              els.push(<line key="fab" x1={20} y1={170} x2={580} y2={170} stroke="rgba(255,60,60,0.15)" strokeWidth={1} strokeDasharray="6 4" />);
              els.push(<text key="fabt" x={585} y={174} fill="rgba(255,60,60,0.3)" fontSize={8} fontFamily="'JetBrains Mono', monospace" textAnchor="end">fabrication limit</text>);
            }
            if (implSettings.camera) {
              els.push(<polygon key="camicon" points="290,185 300,175 310,185" fill="rgba(255,255,255,0.15)" />);
              els.push(<text key="camt" x={300} y={196} fill="rgba(255,255,255,0.2)" fontSize={7} fontFamily="'JetBrains Mono', monospace" textAnchor="middle">camera POV</text>);
            }
            return els;
          })()}
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Related Cases</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CASES.filter(c => c.domain === baseRules.domain || !baseRules.domain).slice(0, 2).map(c => (
            <button key={c.id} onClick={() => navigate(`/lab/cases/${c.id}`)} style={{
              padding: '8px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)', borderRadius: 2, cursor: 'pointer',
            }}>→ {c.title} ({c.domain})</button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEvaluation = () => (
    <div>
      <SectionTitle num="06" label="Evaluation" />
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 28 }}>
        {expertMode ? 'Perceptual metrics: saliency, density, clarity, flow, arousal.'
          : <>Reveals <GlossaryTerm term="Mismatch" expert={expertMode}>mismatches</GlossaryTerm> between intent and perception.</>}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <RadarChart scores={evalScores} intentScores={[0.85, 0.5, 0.9, 0.7, 0.75]} labels={EVAL_METRICS} size={280} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 3, background: '#FF1E00', display: 'inline-block' }} /> Perceived
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ width: 10, height: 3, background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} /> Intended
        </span>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Alignment Analysis</div>
        {EVAL_METRICS.map((m, i) => {
          const intended = [0.85, 0.5, 0.9, 0.7, 0.75][i]; const perceived = evalScores[i];
          const diff = Math.abs(intended - perceived);
          const status = diff < 0.1 ? 'aligned' : diff < 0.2 ? 'drift' : 'mismatch';
          const sc = status === 'aligned' ? 'rgba(255,30,0,0.6)' : status === 'drift' ? 'rgba(255,180,0,0.6)' : 'rgba(255,60,60,0.6)';
          return (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.5)', width: 140 }}>
                <GlossaryTerm term={m} expert={expertMode}>{m}</GlossaryTerm>
              </div>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${intended * 100}%`, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }} />
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${perceived * 100}%`, background: sc, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: sc, width: 70, textAlign: 'right', textTransform: 'uppercase' }}>{status}</div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 16, background: 'rgba(255,60,60,0.04)', border: '1px solid rgba(255,60,60,0.15)', borderRadius: 3, marginBottom: 28 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,60,60,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Diagnostic</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
          High visual saliency but moderate attention flow suggests spatial hierarchy may be competing with focal points.
        </p>
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Adjust Perceived Scores</div>
        {EVAL_METRICS.map((m, i) => (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 120 }}>{m}</div>
            <input type="range" min={0} max={100} value={evalScores[i] * 100}
              onChange={e => { const n = [...evalScores]; n[i] = Number(e.target.value) / 100; setEvalScores(n); }}
              style={{ flex: 1, accentColor: '#FF1E00' }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', width: 36, textAlign: 'right' }}>{Math.round(evalScores[i] * 100)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const stepRenderers: Record<string, () => React.ReactNode> = {
    base: renderBaseRules, intent: renderIntent, constraint: renderConstraint,
    strategy: renderStrategy, implementation: renderImplementation, evaluation: renderEvaluation,
  };

  // All steps including intro
  const ALL_STEPS = [{ id: 'intro', label: 'Systems', num: '—' }, ...STEPS];
  const allSi = ALL_STEPS.findIndex(s => s.id === systemStep);
  const isIntro = systemStep === 'intro';

  // ═══ RIGHT PANEL ═══
  const renderRightPanel = () => {
    if (systemStep === 'base') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Current Selection</div>
        {baseRules.domain && <div style={{ marginBottom: 10 }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Domain: </span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#FF1E00' }}>{baseRules.domain}</span></div>}
        {baseRules.world.length > 0 && <div style={{ marginBottom: 10 }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>World: </span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{baseRules.world.join(', ')}</span></div>}
        {baseRules.visibility && <div style={{ marginBottom: 10 }}><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Visibility: </span><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{baseRules.visibility}</span></div>}
        {baseRules.domain && (
          <div style={{ marginTop: 20, padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,30,0,0.4)', marginBottom: 8, textTransform: 'uppercase' }}>What this means</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
              {baseRules.domain === 'Stage' && 'Front-facing perception, camera legibility constraints, temporal sequencing within performance duration.'}
              {baseRules.domain === 'Exhibition' && 'Spatial circulation, multi-angle encounter, self-paced viewer engagement.'}
              {baseRules.domain === 'Object' && 'Haptic proximity, 360° legibility, material-first perception hierarchy.'}
              {baseRules.domain === 'Architecture' && 'Scale relationship with human body, structural integrity, environmental integration.'}
              {baseRules.domain === 'Interface' && 'Screen-mediated perception, interaction feedback loops, information hierarchy.'}
            </p>
          </div>
        )}
      </div>);
    }
    if (systemStep === 'intent') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Intent Constellation</div>
        <svg width="100%" height={200} viewBox="0 0 200 200">
          <circle cx={100} cy={100} r={80} fill="none" stroke="rgba(255,255,255,0.04)" />
          <circle cx={100} cy={100} r={50} fill="none" stroke="rgba(255,255,255,0.04)" />
          {intents.tones.map((t, i) => {
            const a = (i / Math.max(intents.tones.length, 1)) * Math.PI * 2 - Math.PI / 2;
            const rad = 45 + (i % 2) * 25;
            const x = 100 + rad * Math.cos(a), y = 100 + rad * Math.sin(a);
            return (<g key={t}>
              <circle cx={x} cy={y} r={4} fill="#FF1E00" fillOpacity={0.6} />
              <text x={x} y={y - 10} textAnchor="middle" fill="rgba(255,30,0,0.7)" fontSize={8} fontFamily="'JetBrains Mono', monospace">{t}</text>
              <line x1={100} y1={100} x2={x} y2={y} stroke="rgba(255,30,0,0.1)" strokeWidth={0.8} />
            </g>);
          })}
          {intents.tones.length === 0 && <text x={100} y={100} textAnchor="middle" fill="rgba(255,255,255,0.15)" fontSize={10} fontFamily="'JetBrains Mono', monospace">select tones</text>}
        </svg>
      </div>);
    }
    if (systemStep === 'constraint') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Constraint Analysis</div>
        {getConstraintExplanation().map((line, i) => (
          <div key={i} style={{ padding: 12, marginBottom: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 3 }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>{line}</p>
          </div>
        ))}
      </div>);
    }
    if (systemStep === 'strategy') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Current Configuration</div>
        {(['spatial', 'form', 'material'] as const).map(l => Object.entries(strategySelections[l] || {}).length > 0 && (
          <div key={l} style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,30,0,0.4)', marginBottom: 6, textTransform: 'uppercase' }}>{l}</div>
            {Object.entries(strategySelections[l]).map(([k, v]) => <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{k}: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</span></div>)}
          </div>
        ))}
      </div>);
    }
    if (systemStep === 'implementation') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Implementation Notes</div>
        <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
            Complexity: <span style={{ color: '#FF1E00' }}>{implSettings.complexity}</span>
          </p>
        </div>
      </div>);
    }
    if (systemStep === 'evaluation') {
      return (<div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Mismatch Notes</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>Mismatches are data points for iteration, not failures.</p>
        <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>Drag sliders to simulate different evaluation outcomes.</p>
        </div>
      </div>);
    }
    return null;
  };

  const si = STEPS.findIndex(s => s.id === systemStep);

  return (
    <DarkPageWrapper>
      <DarkLabNav />
      <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <div style={{ width: 210, borderRight: '1px solid rgba(255,255,255,0.06)', padding: '28px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 20px', marginBottom: 20 }}>System Pipeline</div>
          {/* Intro item */}
          <button onClick={() => setSystemStep('intro')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', background: isIntro ? 'rgba(255,30,0,0.04)' : 'transparent', border: 'none', borderLeft: isIntro ? '2px solid #FF1E00' : '2px solid transparent', cursor: 'pointer', marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: isIntro ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', fontWeight: isIntro ? 500 : 400 }}>Overview</span>
          </button>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px 8px' }} />
          {STEPS.map((s, i) => {
            const isA = systemStep === s.id; const isP = !isIntro && i < si;
            return (<button key={s.id} onClick={() => setSystemStep(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 20px', background: isA ? 'rgba(255,30,0,0.04)' : 'transparent', border: 'none', borderLeft: isA ? '2px solid #FF1E00' : '2px solid transparent', cursor: 'pointer' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: isA ? '#FF1E00' : isP ? 'rgba(255,30,0,0.3)' : 'rgba(255,255,255,0.15)' }}>{s.num}</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: isA ? 'rgba(255,255,255,0.9)' : isP ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)', fontWeight: isA ? 500 : 400 }}>{s.label}</span>
              {isP && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,30,0,0.4)' }} />}
            </button>);
          })}
          <div style={{ marginTop: 'auto', padding: '0 20px' }}>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 16 }}>
              <button onClick={() => setExpertMode(!expertMode)} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: expertMode ? '#FF1E00' : 'rgba(255,255,255,0.3)',
                background: expertMode ? 'rgba(255,30,0,0.04)' : 'transparent',
                border: `1px solid ${expertMode ? 'rgba(255,30,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                padding: '6px 12px', borderRadius: 2, cursor: 'pointer', width: '100%', textAlign: 'left',
              }}>{expertMode ? '● Expert' : '○ Beginner'} View</button>
            </div>
            <button onClick={() => navigate('/lab/cases')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>→ View Cases</button>
          </div>
        </div>

        {/* Center content */}
        <div style={{ flex: 1, overflow: 'auto', padding: isIntro ? '0' : '28px 36px' }}>
          {isIntro ? (
            /* ═══ INTRO / SEMI-LANDING ═══ */
            <div>
              {/* Title section */}
              <div style={{ padding: '60px 36px 0' }}>
                <h1 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 34, fontWeight: 600, color: '#fff', letterSpacing: '-0.03em', margin: 0, marginBottom: 8 }}>Systems</h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.35)', margin: 0, marginBottom: 0 }}>A decision interface for meaning, form, and perception</p>
              </div>

              {/* 3-Column: Meaning / Form / Perception */}
              <div style={{ padding: '60px 36px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                  {[
                    { num: '01', title: 'Meaning', desc: 'Design begins with structured intent — not mood, not style.' },
                    { num: '02', title: 'Form Strategy', desc: 'Form is the spatial, material, structural translation of meaning under constraint.' },
                    { num: '03', title: 'Perception', desc: 'The test is whether the perceived experience aligns with intended meaning.' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '24px 20px', borderTop: '1px solid rgba(255,30,0,0.15)' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#FF1E00', opacity: 0.5 }}>{item.num}</span>
                      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 600, color: '#fff', margin: '10px 0 12px', letterSpacing: '-0.03em' }}>{item.title}</h3>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pipeline Overview */}
              <div style={{ padding: '60px 36px 40px' }}>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>Pipeline Overview</h2>
                <PipelineDiagram currentStep="base" />
              </div>

              {/* CTA to start */}
              <div style={{ padding: '0 36px 60px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSystemStep('base')} style={{
                  padding: '12px 28px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  letterSpacing: '0.06em', textTransform: 'uppercase', background: '#FF1E00',
                  color: '#fff', border: 'none', borderRadius: 2, cursor: 'pointer', fontWeight: 600,
                }}>Begin → 01 Base Rules</button>
              </div>
            </div>
          ) : (
            /* ═══ PIPELINE STEPS ═══ */
            <>
              <div style={{ marginBottom: 28 }}><PipelineDiagram currentStep={systemStep} /></div>
              {stepRenderers[systemStep]?.()}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {si > 0
                  ? <button onClick={() => setSystemStep(STEPS[si - 1].id)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 20px', borderRadius: 2, cursor: 'pointer' }}>← Previous</button>
                  : <button onClick={() => setSystemStep('intro')} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: '1px solid rgba(255,255,255,0.08)', padding: '8px 20px', borderRadius: 2, cursor: 'pointer' }}>← Overview</button>}
                {si < STEPS.length - 1 &&
                  <button onClick={() => setSystemStep(STEPS[si + 1].id)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#FF1E00', background: 'rgba(255,30,0,0.06)', border: '1px solid rgba(255,30,0,0.2)', padding: '8px 20px', borderRadius: 2, cursor: 'pointer' }}>Next →</button>}
              </div>
            </>
          )}
        </div>

        {/* Right panel — hidden on intro */}
        {!isIntro && (
          <div style={{ width: 260, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '28px 20px', flexShrink: 0, overflow: 'auto' }}>{renderRightPanel()}</div>
        )}
      </div>
    </DarkPageWrapper>
  );
}