import { useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { ENGINES, ENGINE_IDS, getCase, isEngineId, strategyPlan, type EngineId, type Params, type Profile } from '../os/data';
import { saveFile } from '../os/geometry';
import { Tag, useOs } from '../os/Shell';
import { Viewer } from '../os/Viewer';

export function EnginePage() {
  const { principle, mode } = useParams();
  const go = useNavigate();
  // The engine and its compose state share one route, so switching keeps the scroll position.
  const navigate = (to: string, opts?: { replace?: boolean }) => go(to, { ...opts, preventScrollReset: true });
  const { engine: st, setEngine, resetEngine, angle, toast, showDialog, closeDialog } = useOs();
  const compose = mode === 'compose';
  const composeRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (compose) composeRef.current?.scrollIntoView({ block: 'start' });
  }, [compose]);

  if (!isEngineId(principle) || (mode && !compose)) return <Navigate to="/engine/convergence" replace />;
  const id = principle;
  const e = ENGINES[id];
  const p = st.params;
  const base = `/engine/${id}`;
  const composed = st.additions.length > 0;

  const setParam = <K extends keyof Params>(key: K, value: Params[K]) => setEngine({ params: { ...p, [key]: value }, selected: -1 });
  const toggleNode = (n: string) => {
    const disabled = new Set(st.disabled);
    if (disabled.has(n)) disabled.delete(n); else disabled.add(n);
    setEngine({ disabled, selected: -1 });
  };
  const pickEngine = (next: EngineId) => {
    setEngine({ additions: [], disabled: new Set() });
    navigate(`/engine/${next}${compose ? '/compose' : ''}`);
  };
  const addPrinciple = (k: EngineId) => {
    setEngine({ additions: [...st.additions, k], selected: -1 });
    closeDialog();
    if (!compose) navigate(`${base}/compose`);
  };
  const openAdd = () => {
    const options = ENGINE_IDS.filter(k => k !== id && !st.additions.includes(k));
    showDialog('Connect a principle', (
      <>
        <p>Keep the current study and add a compatible spatial operation. The connection changes the geometry in the same canvas.</p>
        {options.length ? options.map(k => (
          <button key={k} className="pick" onClick={() => addPrinciple(k)}>
            <div><strong>{ENGINES[k].name}</strong><span>{ENGINES[k].description}</span></div><span>+</span>
          </button>
        )) : <p>All available principles are connected. Remove one from the chain to reconnect it.</p>}
      </>
    ));
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
  const source = getCase(e.source)!;

  return (
    <section className="workspace">
      <div className="workspace-heading">
        <h1>Engine<span className="muted"> / {compose ? 'Compose' : 'Explore'}</span></h1>
        <div className="engine-select">
          <select value={id} onChange={ev => pickEngine(ev.target.value as EngineId)} aria-label="Choose a formal principle">
            {ENGINE_IDS.map(k => <option key={k} value={k}>{ENGINES[k].name}</option>)}
          </select>
          <Tag status={e.status} title="Demo engine reconstructed from the source narrative" />
        </div>
      </div>

      <div className="engine-body" ref={bodyRef}>
        <Viewer
          kind={e.kind}
          params={p}
          disabled={st.disabled}
          additions={st.additions}
          className="main-viewer"
          dock
          angle={angle.current}
          onAngle={(yaw, pitch) => { angle.current = { yaw, pitch }; }}
          caption={composed ? 'COMPOSED FORM STUDY' : `FORM FINDING / ${e.source}`}
          subtitle={composed ? [e.name, ...st.additions.map(k => ENGINES[k].name)].join(' + ') : 'Change a variable. Keep the principle.'}
        />
        <aside className="control-panel">
          <div className="control-description">
            <span className="eyebrow">Form finding</span>
            <h2>{e.name}</h2>
            <p>{e.description}</p>
          </div>
          <label className="profile-field">Input profile
            <select className="profile" value={p.profile} onChange={ev => setParam('profile', ev.target.value as Profile)}>
              <option value="triangle">Triangle</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </label>
          <label>Count <output>{p.count}</output>
            <input type="range" min={3} max={22} value={p.count} onChange={ev => setParam('count', +ev.target.value)} />
          </label>
          <label>{e.labels[0]} <output>{p.rotation}</output>
            <input type="range" min={0} max={100} value={p.rotation} onChange={ev => setParam('rotation', +ev.target.value)} />
          </label>
          <label>{e.labels[1]} <output>{p.depth}</output>
            <input type="range" min={0} max={240} value={p.depth} onChange={ev => setParam('depth', +ev.target.value)} />
          </label>
          <Link className="source" to={`/field/${e.source}`}><span>ORIGIN / FIELD {e.source}</span>{source.name} ↗</Link>
        </aside>
      </div>

      <div className="node-strip" aria-label="Formal operations">
        {e.nodes.map((n, i) => (
          <span key={n} style={{ display: 'contents' }}>
            {i > 0 && <span className="connector">→</span>}
            <button className={`node ${st.disabled.has(n) ? '' : 'active'}`} aria-pressed={!st.disabled.has(n)} onClick={() => toggleNode(n)}>{n}</button>
          </span>
        ))}
        {st.additions.map(k => (
          <span key={k} style={{ display: 'contents' }}>
            <span className="connector">→</span>
            <button className="node active" title={`Remove ${ENGINES[k].name}`} onClick={() => setEngine({ additions: st.additions.filter(a => a !== k), selected: -1 })}>{ENGINES[k].name} ×</button>
          </span>
        ))}
        <span className="connector">→</span>
        <button className="node add" onClick={openAdd}>+ Add principle</button>
        <div className="strip-actions">
          <button onClick={() => navigate(compose ? base : `${base}/compose`)}>{compose ? 'Close test ground' : 'Explore strategies ↗'}</button>
          <button onClick={resetEngine}>Reset</button>
          <button onClick={exportStudy}>Save study ↓</button>
        </div>
      </div>
      <div className="engine-note">
        {composed && 'Connected principles transform the same geometry. '}
        Click an operation to bypass it. View controls rotate the camera; the depth slider changes the geometry.
        {composed && (
          <><br />Connected origins: {st.additions.map((k, i) => (
            <span key={k}>{i > 0 && ' / '}<Link className="blue" to={`/field/${ENGINES[k].source}`}>Field {ENGINES[k].source} ↗</Link></span>
          ))}</>
        )}
      </div>

      {compose && (
        <section className="compose" ref={composeRef}>
          <div>
            <span className="eyebrow">Test ground / strategy flow demo</span>
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
