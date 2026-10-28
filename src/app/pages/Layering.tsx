import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useOs } from '../os/Shell';
import { Viewer } from '../os/Viewer';
import { saveFile } from '../os/geometry';
import { ENGINES, ENGINE_IDS, type Profile } from '../os/data';
import { activeRecipe, layeringModel, presetStudy, STUDIES, type LayerStudy, type Operation, type PresetId } from '../os/layering';

export function LayeringPage() {
  const { study, setStudy, angle, toast } = useOs();
  const [query, setQuery] = useSearchParams();
  const requested = query.get('preset');
  const [advanced, setAdvanced] = useState(false);
  const [comparison, setComparison] = useState<LayerStudy | null>(null);
  useEffect(() => {
    if ((requested === '09' || requested === '10') && requested !== study.source) setStudy(presetStudy(requested));
  }, [requested, study.source, setStudy]);
  const source = STUDIES[study.source];
  const model = useMemo(() => layeringModel(study), [study]);
  const referenceModel = useMemo(() => comparison ? layeringModel(comparison) : null, [comparison]);
  const modified = JSON.stringify(study) !== JSON.stringify(presetStudy(study.source));
  const pick = (id: PresetId) => { setStudy(presetStudy(id)); setQuery({preset:id}, {preventScrollReset:true}); };
  const value = (key: keyof LayerStudy['values'], n: number) => setStudy({...study, values:{...study.values,[key]:n}});
  const operation = (index:number, patch:Partial<Operation>) => setStudy({...study,operators:study.operators.map((o,i)=>i===index?{...o,...patch}:o)});
  const move = (index:number, direction:number) => {
    const operators=[...study.operators]; [operators[index],operators[index+direction]]=[operators[index+direction],operators[index]];
    setStudy({...study,operators});
  };
  const range = (key:keyof LayerStudy['values'],label:string,min:number,max:number,step=1,unit='°') => <label className="study-range" key={key}><span>{label}<output>{study.values[key]}{unit}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={study.values[key]} onChange={e=>value(key,+e.target.value)}/></label>;
  const exportStudy = () => { saveFile(`oxx-layering-${study.source}.json`,JSON.stringify(study,null,2),'application/json'); toast('Composition saved · base, ordered operators, strengths and regions'); };
  return <section className="workspace layering-workspace">
    <div className="layering-intro"><div><span className="eyebrow">ENGINE / DEPTH CONSTRUCTION</span><h1>Sequential Layering<span>.</span></h1><p>Repeat a profile. Change the relationships.</p></div><details className="other-studies"><summary>Other studies ↗</summary><div>{ENGINE_IDS.map(id=><Link key={id} to={`/engine/${id}`}>{ENGINES[id].name} ↗</Link>)}</div></details></div>
    <div className="preset-rail" aria-label="Case composition presets">
      <span className="eyebrow">ONE ENGINE<br/>TWO COMPOSITIONS</span>
      {(['09','10'] as const).map(id=><button key={id} className={study.source===id?'selected':''} onClick={()=>pick(id)} aria-pressed={study.source===id}><span className="preset-number">{id}</span><span><strong>{STUDIES[id].artist}</strong><small>{STUDIES[id].recipe}</small></span><span className="preset-arrow">↗</span></button>)}
      <span className="study-state">{modified?'MODIFIED STUDY':'SOURCE PRESET'}<i/></span>
    </div>
    <div className="engine-body layering-body">
      <div className={`study-canvases ${comparison?'comparing':''}`}>
        {comparison && referenceModel && <Viewer kind="converge" geometry={referenceModel} dock caption={`PINNED / ${STUDIES[comparison.source].artist}`} subtitle="Saved comparison" description="Pinned composition geometry" className="main-viewer"/>}
        <Viewer kind="converge" geometry={model} dock caption={`LIVE / ${source.artist} / ${study.base.count} LAYERS`} subtitle={source.title} description={`${source.artist}: ${study.base.count} ${study.base.profile} layers, rotation ${study.values.rotation} degrees, fold ${study.values.fold} degrees. Drag or use arrow keys to orbit.`} className="main-viewer" angle={angle.current} onAngle={(yaw,pitch)=>{angle.current={yaw,pitch}}}/>
      </div>
      <aside className="control-panel layering-controls">
        <div className="control-description"><span className="eyebrow">COMPOSITION / {study.source}</span><h2>{source.title}</h2><p>{study.source==='09'?'A triangular sequence contracts and turns toward a shared focus.':'A repeated frame folds between floor and elevation; its axis changes through the sequence.'}</p></div>
        <label className="study-range"><span>Layers<output>{study.base.count}</output></span><input aria-label="Layers" type="range" min="3" max="28" step="1" value={study.base.count} onChange={e=>setStudy({...study,base:{...study.base,count:+e.target.value}})}/></label>
        <label className="study-range"><span>Spacing<output>{study.base.spacing}</output></span><input aria-label="Spacing" type="range" min="0" max="36" step="1" value={study.base.spacing} onChange={e=>setStudy({...study,base:{...study.base,spacing:+e.target.value}})}/></label>
        {study.source==='09'?<>{range('rotation','Rotation progression',-120,120)}{range('scale','End scale',.2,1.3,.01,'×')}</>:<>{range('fold','Fold angle',0,120)}{range('axis','Axis reorientation',-80,80)}</>}
        <Link className="source" to={`/cases/${study.source}`}><span>INTENT → FORMAL CHOICE → BUILT → EXTRACTION</span>{source.artist} / Read the case ↗</Link>
      </aside>
    </div>
    <div className="study-sequence" aria-label="Applied operation sequence"><span className="eyebrow">BASE</span><strong>Layering</strong><span className="sequence-divider"/><span className="eyebrow">VARIATIONS</span>{activeRecipe(study).length?activeRecipe(study).map((name,i)=><span key={name} className="sequence-operation"><small>{String(i+1).padStart(2,'0')}</small>{name}<span>→</span></span>):<span className="muted">None · base sequence only</span>}<button className="text-button" aria-expanded={advanced} onClick={()=>setAdvanced(!advanced)}>Advanced {advanced?'−':'+'}</button></div>
    <div className="study-actions"><p>Principle study · relative units · not a measured stage reconstruction.</p><div><button onClick={()=>setComparison(comparison?null:structuredClone(study))}>{comparison?'Close comparison':'Pin to compare'}</button><button onClick={()=>pick(study.source)}>Reset preset</button><button onClick={exportStudy}>Save composition ↓</button></div></div>
    {advanced && <section className="study-advanced" aria-label="Advanced composition">
      <div className="advanced-heading"><div><span className="eyebrow">BASE STRATEGY / FIXED HIERARCHY</span><h2>One rule, an ordered set of variations.</h2><p>Operators act from top to bottom on the local profile. The resulting layers are then placed along the depth axis.</p></div><label>Base profile<select aria-label="Base profile" value={study.base.profile} onChange={e=>setStudy({...study,base:{...study.base,profile:e.target.value as Profile}})}><option value="triangle">Triangle</option><option value="square">Rectangle</option><option value="circle">Circle</option></select></label></div>
      <div className="advanced-values">{range('scale','Scale factor',.2,1.3,.01,'×')}{range('rotation','Rotation angle',-120,120)}{range('axis','Axis angle',-80,80)}{range('fold','Hinge angle',0,120)}</div>
      <div className="operator-head"><span>ORDER / OPERATOR</span><span>APPLY TO</span><span>STRENGTH</span><span>REORDER</span></div>
      {study.operators.map((o,i)=><div className={`operator-row ${o.enabled?'':'bypassed'}`} key={o.kind}><label><input aria-label={`Enable ${o.kind}`} type="checkbox" checked={o.enabled} onChange={e=>operation(i,{enabled:e.target.checked})}/><span>{String(i+1).padStart(2,'0')}</span>{o.kind}</label><select aria-label={`${o.kind} region`} value={o.region} onChange={e=>operation(i,{region:e.target.value as Operation['region']})}><option value="all">All layers</option><option value="front">Front half</option><option value="back">Back half</option></select><label className="strength"><input aria-label={`${o.kind} strength`} type="range" min="0" max="1" step=".05" value={o.strength} onChange={e=>operation(i,{strength:+e.target.value})}/><output>{Math.round(o.strength*100)}%</output></label><div className="reorder"><button aria-label={`Move ${o.kind} up`} disabled={i===0} onClick={()=>move(i,-1)}>↑</button><button aria-label={`Move ${o.kind} down`} disabled={i===study.operators.length-1} onClick={()=>move(i,1)}>↓</button></div></div>)}
      <p className="advanced-note">Fold bends the lower half of the profile around the hinge where the current profile crosses its horizontal center plane. Axis rotates the entire layer around its vertical axis. Order matters; a zero angle or zero strength is an identity operation.</p>
    </section>}
    <div className="study-bottom"><span className="eyebrow">PRACTICE ↔ PRINCIPLE</span><p>{source.intentKo}</p><Link to={`/cases/${study.source}`}>View the source reading ↗</Link></div>
  </section>;
}
