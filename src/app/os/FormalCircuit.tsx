import { useMemo, useState } from 'react';
import { ENGINES, ENGINE_IDS, type EngineId, type Params } from './data';
import { Viewer } from './Viewer';

type Key = 'count' | 'rotation' | 'depth' | 'scale' | 'fold';
interface Props {
  engineId: EngineId;
  params: Params;
  disabled: ReadonlySet<string>;
  additions: readonly EngineId[];
  scrub: number | null;
  onScrub: (step: number | null) => void;
  onBase: (id: EngineId) => void;
  onToggle: (operation: string) => void;
  onAdd: (id: EngineId) => void;
  onRemove: (id: EngineId) => void;
  onMove: (id: EngineId, direction: -1 | 1) => void;
  onParam: (key: Key, value: number) => void;
  onReset: () => void;
  onExport: () => void;
}
const SHORT: Record<string, string> = {
  layering: 'Sequential Layering', perspective: 'Perspective Convergence', line: 'Line / Trajectory',
  division: 'Division', enclosure: 'Spatial Enclosure',
};
const PARAM: Record<string, { key: Key; label: string; min: number; max: number; step: number }> = {
  base: { key: 'count', label: 'Count', min: 3, max: 22, step: 1 },
  Repeat: { key: 'count', label: 'Count', min: 3, max: 22, step: 1 },
  Rotate: { key: 'rotation', label: 'Rotation', min: 0, max: 100, step: 1 },
  Curve: { key: 'rotation', label: 'Curvature', min: 0, max: 100, step: 1 },
  Divide: { key: 'rotation', label: 'Division bias', min: 0, max: 100, step: 1 },
  Scale: { key: 'scale', label: 'Scale progression', min: 0, max: .85, step: .01 },
  Depth: { key: 'depth', label: 'Depth', min: 0, max: 240, step: 1 },
  Fold: { key: 'fold', label: 'Fold angle', min: 0, max: 90, step: 1 },
  layering: { key: 'depth', label: 'Depth', min: 0, max: 240, step: 1 },
  perspective: { key: 'scale', label: 'Convergence', min: 0, max: .85, step: .01 },
  line: { key: 'rotation', label: 'Flow', min: 0, max: 100, step: 1 },
  division: { key: 'rotation', label: 'Split', min: 0, max: 100, step: 1 },
  enclosure: { key: 'fold', label: 'Fold', min: 0, max: 90, step: 1 },
};
function Glyph({ name }: { name: string }) {
  const outline = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinejoin: 'round' as const };
  return <svg aria-hidden="true" className="circuit-glyph" viewBox="0 0 120 80">
    <g {...outline}>
      {name === 'layering' || name === 'Repeat' ? [0,1,2,3].map(i => <path key={i} d={'M '+(14+i*11)+' '+(66-i*5)+' L 60 '+(10+i*10)+' L '+(106-i*11)+' '+(66-i*5)+' Z'}/>) :
      name === 'perspective' || name === 'Scale' ? [0,1,2,3].map(i => <rect key={i} x={8+i*12} y={8+i*8} width={104-i*24} height={64-i*16}/>) :
      name === 'enclosure' || name === 'Fold' ? <><path d="M17 29 57 13 106 31 64 48Z M17 29V67L64 76V48 M106 31V67L64 76 M17 67L57 51L106 67"/><path d="M57 13V51" opacity=".45"/></> :
      name === 'line' || name === 'Curve' ? <><path d="M8 67Q19 7 45 33T110 11"/><path d="M8 72Q24 25 51 44T110 25" opacity=".4"/></> :
      name === 'division' || name === 'Divide' ? <><rect x="12" y="11" width="96" height="60"/><path d="M38 11V71M75 11V71M12 43H108M38 56H75"/></> :
      name === 'Rotate' ? <><path d="M10 67L50 11L90 67Z"/><path d="M25 70L72 20L99 65Z" opacity=".55"/></> :
      name === 'Depth' ? <><rect x="10" y="14" width="74" height="53"/><rect x="27" y="8" width="74" height="53"/><path d="M10 14 27 8 M84 14 101 8 M84 67 101 61 M10 67 27 61"/></> :
      <path d="M12 40H108M60 11V69"/>}
    </g>
  </svg>;
}
type Step = { id: string; label: string; role: 'governing' | 'operation' | 'support'; operation?: string; strategy?: EngineId };
export function FormalCircuit({ engineId, params, disabled, additions, scrub, onScrub, onBase, onToggle, onAdd, onRemove, onMove, onParam, onReset, onExport }: Props) {
  const [active, setActive] = useState('base');
  const [palette, setPalette] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [compare, setCompare] = useState(false);
  const baseOps = ENGINES[engineId].nodes;
  const steps: Step[] = [
    { id: 'base', label: SHORT[engineId] || ENGINES[engineId].name, role: 'governing', strategy: engineId },
    ...baseOps.map(op => ({ id: 'op-'+op, label: op, role: 'operation' as const, operation: op })),
    ...additions.map((id, i) => ({ id: 'support-'+id+'-'+i, label: SHORT[id] || ENGINES[id].name, role: 'support' as const, strategy: id })),
  ];
  const chosen = steps.find(s => s.id === active) || steps[0];
  const setting = PARAM[chosen.operation || (chosen.role === 'governing' ? 'base' : chosen.strategy || '')] || PARAM.base;
  const val = params[setting.key] ?? 0;
  const slice = (index: number) => {
    const baseAllowed = new Set(baseOps.slice(0, Math.min(index, baseOps.length)));
    return {
      disabled: new Set([...disabled, ...baseOps.filter(op => !baseAllowed.has(op))]),
      additions: additions.slice(0, Math.max(0, index - baseOps.length)),
    };
  };
  const before = useMemo(() => slice(Math.max(0, (hover ?? 0))), [hover, engineId, additions, disabled]);
  const after = useMemo(() => slice(Math.max(0, (hover ?? 0) + 1)), [hover, engineId, additions, disabled]);
  const branchDisabled = new Set(disabled);
  if (additions.length === 0) {
    const candidate = baseOps.find(op => op === 'Rotate' || op === 'Depth') || baseOps[baseOps.length-1];
    if (candidate) branchDisabled.add(candidate);
  }
  const branchAdditions = additions.length ? additions.slice(0, -1) : additions;
  const selectedIndex = scrub == null ? steps.length - 1 : Math.min(scrub, steps.length - 1);
  return <section className="formal-circuit" aria-label="Formal strategy circuit">
    <div className="circuit-topline">
      <div><span className="eyebrow">FORMAL CIRCUIT / COMPOSITION</span><h2>Build the relationship.</h2></div>
      <div className="circuit-actions"><button onClick={() => setCompare(v=>!v)} aria-pressed={compare}>{compare ? 'Close comparison' : 'Branch & compare ↗'}</button><button onClick={onReset}>Reset</button><button onClick={onExport}>Save ↓</button></div>
    </div>
    <p className="circuit-help">Larger node = governing strategy. Smaller nodes modify it. Select a node to change its parameters; scrub the connection to follow the form.</p>
    <div className="circuit-flow" role="group" aria-label="Ordered strategy nodes">
      {steps.map((node, i) => <div className="circuit-part" key={node.id}>
        {i > 0 && <button className={'circuit-wire'+(hover === i-1?' is-hot':'')} aria-label={'Preview connection before '+node.label} onMouseEnter={()=>setHover(i-1)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(i-1)} onBlur={()=>setHover(null)} onClick={()=>onScrub(i)}><span>→</span></button>}
        <button className={'circuit-node '+node.role+(chosen.id===node.id?' is-selected':'')+((node.operation && disabled.has(node.operation))?' is-off':'')} onClick={()=>{setActive(node.id); onScrub(i);}} aria-pressed={chosen.id===node.id}>
          <span className="circuit-node-meta">{node.role==='governing'?'GOVERNING':node.role==='support'?'SUPPORTING':'TRANSFORM'} / {String(i).padStart(2,'0')}</span>
          <Glyph name={node.operation || node.strategy || 'layering'}/>
          <strong>{node.label}</strong>
          {node.operation && <span className="circuit-state">{disabled.has(node.operation)?'BYPASSED':'ACTIVE'}</span>}
        </button>
      </div>)}
      <div className="circuit-part">
        <span className="circuit-wire is-static"><span>→</span></span>
        <button className="circuit-add" onClick={()=>setPalette(v=>!v)} aria-expanded={palette}><span>+</span><small>ADD STRATEGY</small></button>
      </div>
    </div>
    {palette && <div className="circuit-palette"><span className="eyebrow">CHOOSE A SUPPORTING STRATEGY</span><div className="circuit-palette-grid">{ENGINE_IDS.filter(k=>k!==engineId&&!additions.includes(k)).map(k=><button key={k} onClick={()=>{onAdd(k);setPalette(false);onScrub(null);setActive('support-'+k+'-'+additions.length);}}><Glyph name={k}/><span>{SHORT[k]}</span><b>+</b></button>)}{ENGINE_IDS.filter(k=>k!==engineId&&!additions.includes(k)).length===0&&<span>All five strategies are connected.</span>}</div></div>}
    <div className="circuit-inspector">
      <div className="circuit-inspector-title"><span className="eyebrow">SELECTED / {chosen.role.toUpperCase()}</span><h3>{chosen.label}</h3></div>
      <label>{setting.label} <output>{Number(val).toFixed(setting.step < 1 ? 2 : 0)}</output><input type="range" min={setting.min} max={setting.max} step={setting.step} value={val} onChange={e=>{onParam(setting.key,+e.target.value);onScrub(null)}}/></label>
      <div className="circuit-inspector-controls">
        {chosen.role==='governing' && <label className="circuit-switch">Change governing strategy <select value={engineId} onChange={e=>{onBase(e.target.value as EngineId);setActive('base');onScrub(null)}}>{ENGINE_IDS.map(k=><option key={k} value={k}>{SHORT[k]}</option>)}</select></label>}
        {chosen.operation && <button onClick={()=>onToggle(chosen.operation!)}>{disabled.has(chosen.operation)?'Enable operation':'Bypass operation'}</button>}
        {chosen.role==='support' && chosen.strategy && <><button onClick={()=>onMove(chosen.strategy!,-1)} disabled={additions.indexOf(chosen.strategy)===0}>← Earlier</button><button onClick={()=>onMove(chosen.strategy!,1)} disabled={additions.indexOf(chosen.strategy)===additions.length-1}>Later →</button><button onClick={()=>{onRemove(chosen.strategy!);setActive('base');onScrub(null)}}>Remove ×</button></>}
      </div>
    </div>
    <div className="circuit-scrubber"><div className="circuit-scrub-label"><span className="eyebrow">SCRUB THE LOGIC</span><strong>{scrub==null?'COMPLETE':('STEP '+(selectedIndex+1)+' / '+steps.length)}</strong></div><input type="range" aria-label="Scrub the logic" min="0" max={steps.length-1} value={selectedIndex} onChange={e=>onScrub(+e.target.value)}/><button onClick={()=>onScrub(null)}>Show complete →</button></div>
    {hover!==null&&<div className="circuit-difference"><div><small>BEFORE / STAGE {hover+1}</small><Viewer kind={ENGINES[engineId].kind} params={params} disabled={before.disabled} additions={before.additions} interactive={false}/></div><span>→</span><div><small>AFTER / STAGE {hover+2}</small><Viewer kind={ENGINES[engineId].kind} params={params} disabled={after.disabled} additions={after.additions} interactive={false}/></div></div>}
    {compare&&<div className="circuit-compare"><div><span className="eyebrow">BRANCH A / CURRENT COMPOSITION</span><Viewer kind={ENGINES[engineId].kind} params={params} disabled={disabled} additions={additions} interactive={false}/><small>{[SHORT[engineId],...additions.map(k=>SHORT[k])].join(' → ')}</small></div><div><span className="eyebrow">BRANCH B / ONE LESS OPERATION</span><Viewer kind={ENGINES[engineId].kind} params={params} disabled={branchDisabled} additions={branchAdditions} interactive={false}/><small>{additions.length?'Last supporting strategy bypassed':'One transformation bypassed'}</small></div></div>}
    <p className="circuit-disclaimer">Experimental schematic geometry. This graph composes the existing OXX generators; it is not a reconstruction of historical CAD or a general-purpose geometry node system.</p>
  </section>;
}
