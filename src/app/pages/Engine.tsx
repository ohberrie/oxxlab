import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { ENGINES, isEngineId, strategyPlan, type EngineId, type Params, type Profile } from '../os/data';
import { saveFile } from '../os/geometry';
import { useOs } from '../os/Shell';
import { Viewer } from '../os/Viewer';
import { FormalCircuit } from '../os/FormalCircuit';

export function EnginePage() {
  const { principle, mode } = useParams();
  const go = useNavigate();
  const [search] = useSearchParams();
  // The engine and its compose state share one route, so switching keeps the scroll position.
  const navigate = (to: string, opts?: { replace?: boolean }) => go(to, { ...opts, preventScrollReset: true });
  const { engine: st, setEngine, resetEngine, angle, toast, showDialog, closeDialog } = useOs();
  const compose = mode === 'compose';
  const composeRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    if (compose) composeRef.current?.scrollIntoView({ block: 'start' });
  }, [compose]);

  const preset = search.get('preset');
  useEffect(() => {
    if (preset === '09' || preset === '10') {
      setEngine({ params: { count: preset === '09' ? 10 : 8, rotation: preset === '09' ? 35 : 0, depth: 180, profile: preset === '09' ? 'triangle' : 'square', scale: preset === '09' ? 0.65 : 0.5, fold: preset === '10' ? 65 : 0, domain: preset === '10' ? 'planes' : 'axis' }, additions: preset === '10' ? ['layering'] : [], disabled: new Set(), selected: -1 });
    }
  }, [preset, setEngine]);

  if (!isEngineId(principle) || (mode && !compose)) return <Navigate to="/engine/layering" replace />;
  const legacy: Partial<Record<EngineId, EngineId>> = { convergence: 'layering', crossing: 'line', radial: 'layering', offset: 'enclosure' };
  if (legacy[principle]) return <Navigate to={`/engine/${legacy[principle]}`} replace />;
  const id = principle;
  const e = ENGINES[id];
  const p = st.params;
  const base = `/engine/${id}`;
  const composed = st.additions.length > 0;
  const operations = e.nodes;
  const visibleSteps = scrub == null ? operations.length + st.additions.length :
    Math.max(0, Math.min(scrub, operations.length + st.additions.length));
  const previewDisabled = scrub == null ? st.disabled : new Set([...st.disabled, ...operations.slice(Math.min(visibleSteps, operations.length))]);
  const previewAdditions = scrub == null ? st.additions : st.additions.slice(0, Math.max(0, visibleSteps - operations.length));

  const setParam = <K extends keyof Params>(key: K, value: Params[K]) => setEngine({ params: { ...p, [key]: value }, selected: -1 });
  const toggleNode = (n: string) => {
    const disabled = new Set(st.disabled);
    if (disabled.has(n)) disabled.delete(n); else disabled.add(n);
    setEngine({ disabled, selected: -1 });
  };
  const pickEngine = (next: EngineId) => {
    setEngine({ additions: [], disabled: new Set(), params: { ...p, scale: next === 'perspective' ? 0.65 : 0.35, fold: 0 } });
    navigate(`/engine/${next}${compose ? '/compose' : ''}`);
  };
  const openReference = () => showDialog('Reference → principle', (
    <>
      <span className="eyebrow">Illustrative extraction / not AI image analysis</span>
      <p style={{ marginTop: 12 }}>This example shows a possible extraction workflow: observe a relationship, express it as operations, then test the rule. No external reference is fetched or analyzed.</p>
      <div className="reference-box">
        <Viewer kind="radial" interactive={false} params={{ count: 13, rotation: 75, depth: 150, profile: 'triangle' }} />
        <div className="mini-relation">OBSERVE → REPEAT + RADIATE → TEST</div>
        <p>Candidate reading: repeated elements share one center while preserving an open middle.</p>
        <button className="btn small" onClick={() => { closeDialog(); pickEngine('radial'); }}>Test Radial Propagation ↗</button>
      </div>
      <p style={{ marginTop: 20 }}>In a future extraction workflow, the source image, attribution and your revisions would stay attached to the new principle.</p>
    </>
  ));
  const exportStudy = () => {
    saveFile('oxx-form-study.json', JSON.stringify({
      engine: id, params: p, bypassedOperations: [...st.disabled], connectedPrinciples: st.additions,
      origin: e.source, brief: compose ? st.brief : undefined, status: 'prototype study',
    }, null, 2), 'application/json');
    toast('Study saved as JSON');
  };
  const runStrategies = () => {
    const brief = st.brief.trim();
    if (!brief) { toast('Add a short spatial brief first.'); return; }
    setEngine({ proposals: strategyPlan(brief, p.profile), selected: -1 });
    toast('Three illustrative strategies · local rules, no AI service');
  };
  const choose = (i: number) => {
    const s = st.proposals[i];
    setEngine({ params: s.params, additions: [...s.additions], disabled: new Set(), selected: i });
    navigate(`/engine/${s.engine}/compose`, { replace: true });
    bodyRef.current?.scrollIntoView({ block: 'start' });
    toast(`Strategy ${String.fromCharCode(65 + i)} loaded into the engine`);
  };

  return (
    <section className="workspace">
      <div className="workspace-heading workspace-heading-minimal">
        <h1>Engine</h1>
        <div className="engine-quicklinks">
          <Link to="/engine/layering?preset=09">09 / izna</Link>
          <Link to="/engine/enclosure?preset=10">10 / Yeonjun</Link>
          <button onClick={() => navigate(`${base}/compose`)}>Explore brief ↗</button>
        </div>
      </div>
      <div className="engine-body" ref={bodyRef}>
        <Viewer
          kind={e.kind}
          params={p}
          disabled={previewDisabled}
          additions={previewAdditions}
          className="main-viewer"
          dock
          angle={angle.current}
          onAngle={(yaw, pitch) => { angle.current = { yaw, pitch }; }}
          caption="LIVE FORM"
          subtitle=""
        />
      </div>

      <FormalCircuit
        engineId={id}
        params={p}
        disabled={st.disabled}
        additions={st.additions}
        scrub={scrub}
        onScrub={setScrub}
        onBase={pickEngine}
        onToggle={toggleNode}
        onAdd={k => { setEngine({ additions: [...st.additions, k], selected: -1 }); setScrub(null); }}
        onRemove={k => { setEngine({ additions: st.additions.filter(a => a !== k), selected: -1 }); setScrub(null); }}
        onMove={(k, direction) => { const a = [...st.additions]; const from = a.indexOf(k), to = from + direction; if (from < 0 || to < 0 || to >= a.length) return; [a[from], a[to]] = [a[to], a[from]]; setEngine({ additions: a }); setScrub(null); }}
        onParam={(key, value) => { setParam(key, value); setScrub(null); }}
        onProfile={profile => { setParam('profile', profile); setScrub(null); }}
        onDomain={domain => { setParam('domain', domain); setScrub(null); }}
        onReset={() => { resetEngine(); setScrub(null); }}
        onExport={exportStudy}
      />
      <div className="study-footer compact-footer"><Link to="/tools">MAKE ↗</Link></div>
      {compose && (
        <section className="compose" ref={composeRef}>
          <div>
            <span className="eyebrow">Possible directions / local rules</span>
            <h2>Brief → strategies.</h2>
            <p>Describe a spatial intention. Compare different combinations, then continue with one.</p>
            <textarea aria-label="Design brief" value={st.brief} onChange={ev => setEngine({ brief: ev.target.value })} />
            <button className="btn" onClick={runStrategies}>Explore strategies <span>↗</span></button>
            <p className="made-by">Local rule-based demo. No AI service connected.</p>
            <button className="text-button" onClick={openReference}>Extract from a reference <span>↗</span></button>
          </div>
          {st.proposals.length ? (
            <div className="proposals">
              {st.proposals.map((s, i) => (
                <button key={i} className={`proposal ${st.selected === i ? 'selected' : ''}`} aria-pressed={st.selected === i} onClick={() => choose(i)}>
                  <Viewer kind={ENGINES[s.engine].kind} interactive={false} params={s.params} additions={s.additions} angle={{ yaw: -0.4, pitch: 0.12 }} />
                  <div>
                    <span className="mono">Strategy {String.fromCharCode(65 + i)}</span>
                    <h3>{s.title}</h3>
                    <p>{s.reason}</p>
                    <span className="mono">{[ENGINES[s.engine].name, ...s.additions.map(k => ENGINES[k].name)].join(' → ')} ↗</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="compose-empty">A brief can lead to different spatial strategies.<br />Explore three, then choose what to develop.</div>
          )}
        </section>
      )}
    </section>
  );
}
