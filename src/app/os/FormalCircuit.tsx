import { useState } from 'react';
import { ENGINES, ENGINE_IDS, type EngineId, type Params } from './data';
import { Viewer } from './Viewer';

type Key = 'count' | 'rotation' | 'depth' | 'scale' | 'fold';
type Step = { id: string; name: string; role: 'base' | 'operation' | 'support'; operation?: string; engine?: EngineId };
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
  onProfile: (profile: Params['profile']) => void;
  onDomain: (domain: NonNullable<Params['domain']>) => void;
  onAdoptVariant: (disabled: Set<string>, additions: EngineId[]) => void;
  onReset: () => void;
  onExport: () => void;
}
const NAMES: Record<string,string> = {
  layering: 'Layering', perspective: 'Convergence', line: 'Trajectory',
  division: 'Division', enclosure: 'Enclosure',
};
const PARAM: Record<string,{key:Key;name:string;min:number;max:number;step:number}> = {
  base: {key:'count',name:'Count',min:3,max:22,step:1},
  Repeat: {key:'count',name:'Count',min:3,max:22,step:1},
  Rotate: {key:'rotation',name:'Rotation',min:0,max:100,step:1},
  Curve: {key:'rotation',name:'Curvature',min:0,max:100,step:1},
  Divide: {key:'rotation',name:'Division',min:0,max:100,step:1},
  Scale: {key:'scale',name:'Scale',min:0,max:.85,step:.01},
  Depth: {key:'depth',name:'Depth',min:0,max:240,step:1},
  Fold: {key:'fold',name:'Fold',min:0,max:90,step:1},
  layering: {key:'depth',name:'Depth',min:0,max:240,step:1},
  perspective: {key:'scale',name:'Convergence',min:0,max:.85,step:.01},
  line: {key:'rotation',name:'Flow',min:0,max:100,step:1},
  division: {key:'rotation',name:'Division',min:0,max:100,step:1},
  enclosure: {key:'fold',name:'Fold',min:0,max:90,step:1},
};
function Glyph({name}:{name:string}) {
  return <svg className="circuit-glyph" viewBox="0 0 100 74" fill="none" stroke="currentColor" strokeWidth="1.15" aria-hidden="true" strokeLinejoin="round">
    {name==='layering'||name==='Repeat' ? [0,1,2,3].map(i=><path key={i} d={'M '+(10+i*9)+' '+(62-i*5)+' L 50 '+(6+i*9)+' L '+(90-i*9)+' '+(62-i*5)+'Z'}/>) :
    name==='perspective'||name==='Scale' ? [0,1,2,3].map(i=><rect key={i} x={5+i*11} y={5+i*8} width={90-i*22} height={64-i*16}/>) :
    name==='enclosure'||name==='Fold' ? <><path d="M10 25 47 11 90 25 53 41Z M10 25V58L53 72V41 M90 25V58L53 72 M47 11V43" /></> :
    name==='line'||name==='Curve' ? <><path d="M4 65Q15 5 42 30T97 12"/><path d="M7 70Q25 23 49 42T97 25" opacity=".45"/></> :
    name==='division'||name==='Divide' ? <><rect x="8" y="8" width="84" height="57"/><path d="M31 8V65M63 8V65M8 37H92M31 50H63"/></> :
    name==='Rotate' ? <><path d="M13 62L46 8L81 62Z"/><path d="M29 64L66 19L92 59Z" opacity=".55"/></> :
    name==='Depth' ? <><rect x="8" y="17" width="66" height="47"/><rect x="25" y="8" width="66" height="47"/><path d="M8 17 25 8 M74 17 91 8 M74 64 91 55"/></> :
    <path d="M10 37H90M50 6V68"/>}
  </svg>;
}
export function FormalCircuit({engineId,params,disabled,additions,scrub,onScrub,onBase,onToggle,onAdd,onRemove,onMove,onParam,onProfile,onDomain,onAdoptVariant,onReset,onExport}:Props) {
  const [selected,setSelected]=useState('base');
  const [palette,setPalette]=useState<'add'|'replace'|null>(null);
  const [edge,setEdge]=useState<number|null>(null);
  const [compare,setCompare]=useState(false);
  const ops=ENGINES[engineId].nodes;
  const steps:Step[]=[
    {id:'base',name:NAMES[engineId],role:'base',engine:engineId},
    ...ops.map(op=>({id:'op-'+op,name:op,role:'operation' as const,operation:op})),
    ...additions.map(id=>({id:'support-'+id,name:NAMES[id],role:'support' as const,engine:id})),
  ];
  const node=steps.find(s=>s.id===selected)||steps[0];
  const control=PARAM[node.operation||(node.role==='base'?'base':node.engine||'base')]||PARAM.base;
  const val=params[control.key]??0;
  const partial=(index:number)=>{
    const active=new Set(ops.slice(0,Math.min(index,ops.length)));
    return {
      disabled:new Set([...disabled,...ops.filter(op=>!active.has(op))]),
      additions:additions.slice(0,Math.max(0,index-ops.length)),
    };
  };
  const previous=partial(Math.max(0,edge??0)),next=partial(Math.max(0,(edge??0)+1));
  const alternateOff=new Set(disabled);
  if(!additions.length){
    const op=ops.find(x=>x==='Rotate'||x==='Depth')||ops[ops.length-1];
    if(op)alternateOff.add(op);
  }
  const alternateAdd=additions.length?additions.slice(0,-1):additions;
  const currentStep=scrub===null?steps.length-1:Math.min(scrub,steps.length-1);
  return <section className="formal-circuit compact-circuit" aria-label="Formal composition">
    <div className="circuit-topline">
      <span className="circuit-section-name">Composition</span>
      <div className="circuit-actions">
        <button onClick={()=>setCompare(v=>!v)} aria-pressed={compare} title="Compare variations">{compare?'× Compare':'Compare'}</button>
        <button onClick={onReset} title="Reset composition" aria-label="Reset composition">↺</button>
        <button onClick={onExport} title="Save study" aria-label="Save study">↓</button>
      </div>
    </div>
    <div className="circuit-flow" role="group" aria-label="Connected formal operations">
      {steps.map((item,i)=><div className="circuit-part" key={item.id}>
        {i>0&&<button className={'circuit-wire'+(edge===i-1?' is-hot':'')}
          onPointerEnter={()=>setEdge(i-1)} onPointerLeave={()=>setEdge(null)}
          onFocus={()=>setEdge(i-1)} onBlur={()=>setEdge(null)}
          onClick={()=>onScrub(i)}
          aria-label={'Preview the change before '+item.name} title="Before / after"><span>→</span></button>}
        <button className={'circuit-node '+(item.role==='base'?'governing':item.role==='support'?'support':'operation')+(node.id===item.id?' is-selected':'')+(item.operation&&disabled.has(item.operation)?' is-off':'')}
          aria-label={(item.role==='base'?'Governing: ':item.role==='support'?'Supporting: ':'Transform: ')+item.name}
          aria-pressed={node.id===item.id} onClick={()=>{setSelected(item.id);onScrub(i);}}>
          <Glyph name={item.operation||item.engine||''}/>
          <strong>{item.name}</strong>
        </button>
      </div>)}
      <div className="circuit-part"><span className="circuit-wire is-static"><span>→</span></span>
        <button className="circuit-add" aria-label="Add a strategy" title="Add a strategy" onClick={()=>setPalette(p=>p==='add'?null:'add')}>+</button>
      </div>
    </div>
    {palette&&<div className="circuit-palette">
      <div className="circuit-palette-grid">
        {ENGINE_IDS.filter(k=>palette==='replace'||(k!==engineId&&!additions.includes(k))).map(k=><button key={k} aria-label={(palette==='replace'?'Use as governing: ':'Add supporting: ')+NAMES[k]}
          onClick={()=>{if(palette==='replace'){onBase(k);setSelected('base');}else{onAdd(k);setSelected('support-'+k);}onScrub(null);setPalette(null);}}>
          <Glyph name={k}/><span>{NAMES[k]}</span></button>)}
      </div>
    </div>}
    <div className="circuit-inspector">
      <span className="circuit-active-name">{node.name}</span>
      <label className="circuit-primary-slider"><span>{control.name}</span>
        <input type="range" min={control.min} max={control.max} step={control.step} value={val}
          onChange={e=>{onParam(control.key,+e.target.value);onScrub(null)}}/>
        <output>{Number(val).toFixed(control.step<1?2:0)}</output>
      </label>
      <div className="circuit-inspector-controls">
        {node.role==='base'&&<button onClick={()=>setPalette(p=>p==='replace'?null:'replace')} title="Change governing strategy">Replace ↗</button>}
        {node.operation&&<button onClick={()=>onToggle(node.operation!)}>{disabled.has(node.operation)?'Enable':'Bypass'}</button>}
        {node.role==='support'&&node.engine&&<>
          <button onClick={()=>onMove(node.engine!,-1)} disabled={additions.indexOf(node.engine)===0} aria-label="Move left">←</button>
          <button onClick={()=>onMove(node.engine!,1)} disabled={additions.indexOf(node.engine)===additions.length-1} aria-label="Move right">→</button>
          <button onClick={()=>{onRemove(node.engine!);setSelected('base');onScrub(null)}} aria-label="Remove node">×</button>
        </>}
      </div>
    </div>
    {node.role==='base'&&<details className="circuit-base-geometry">
      <summary>Base geometry</summary>
      <div className="circuit-base-controls">
        <span>Profile</span>
        <div>{([['triangle','△'],['square','□'],['circle','○']] as const).map(([p,g])=>
          <button key={p} aria-label={p} aria-pressed={params.profile===p} onClick={()=>onProfile(p)}>{g}</button>)}</div>
        {engineId!=='enclosure'&&<><span>Domain</span><div>
          <button aria-pressed={(params.domain||'axis')==='axis'} onClick={()=>onDomain('axis')}>Axis</button>
          <button aria-pressed={params.domain==='planes'} onClick={()=>onDomain('planes')}>Planes</button>
        </div></>}
      </div>
    </details>}
    <div className="circuit-scrubber">
      <span className="circuit-section-name">Process</span>
      <input type="range" aria-label="Scrub process" min={0} max={steps.length-1} value={currentStep} onChange={e=>onScrub(+e.target.value)}/>
      <button onClick={()=>onScrub(null)} title="Show completed form">{scrub===null?'All':'Show all ↗'}</button>
    </div>
    {edge!==null&&<div className="circuit-difference" aria-label="Before and after">
      <div><small>Before</small><Viewer kind={ENGINES[engineId].kind} params={params} disabled={previous.disabled} additions={previous.additions} interactive={false}/></div>
      <span>→</span>
      <div><small>After</small><Viewer kind={ENGINES[engineId].kind} params={params} disabled={next.disabled} additions={next.additions} interactive={false}/></div>
    </div>}
    {compare&&<div className="circuit-compare">
      <div><span className="circuit-section-name">A / Current</span><Viewer kind={ENGINES[engineId].kind} params={params} disabled={disabled} additions={additions} interactive={false}/><button className="circuit-choose" onClick={()=>setCompare(false)}>Keep A</button></div>
      <div><span className="circuit-section-name">B / Variation</span><Viewer kind={ENGINES[engineId].kind} params={params} disabled={alternateOff} additions={alternateAdd} interactive={false}/><button className="circuit-choose" onClick={()=>{onAdoptVariant(alternateOff,alternateAdd);onScrub(null);setCompare(false);}}>Use B ↗</button></div>
    </div>}
    <details className="circuit-notes"><summary>About this study</summary><p>These are schematic, newly reconstructed forms—not the original stage CAD. Larger nodes organize the composition; smaller nodes transform or support it. Connections preview changes. The compare view disables one operation or the last supporting strategy.</p></details>
  </section>;
}
