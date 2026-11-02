import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';
import { saveFile } from '../os/geometry';
import '../../styles/node-engine.css';

/**
 * OXX / node editor prototype.
 * Case configurations are retrospective formal studies, never recovered CAD or
 * evidence that a procedural algorithm was used during production.
 */
type Strategy = 'layering' | 'perspective' | 'enclosure' | 'line';
type Support = Strategy | 'none';
type Relation = 'reinforce' | 'contain' | 'cross' | 'construct';
type Variation = 'none' | 'rotate' | 'fold' | 'divide' | 'offset';
type NodeId = 'governing' | 'supporting' | 'relation' | 'variation' | 'parameters' | 'output';
type Study = { governing: Strategy; supporting: Support; relation: Relation; variation: Variation; count: number; vary: number; weight: number };
type CaseKey = '09' | '10' | '04' | '08' | 'custom';
type Point = [number, number, number];
type Wire = { pts: Point[]; color: 'main' | 'support' | 'grid'; opacity: number; width: number; dash?: string };
type Position = { x: number; y: number };
const BLUE = '#294bdc';
const STRATEGIES: { id: Strategy; title: string; full: string }[] = [
  { id: 'layering', title: 'Layer', full: 'Sequential Layering' },
  { id: 'perspective', title: 'Converge', full: 'Perspective Convergence' },
  { id: 'enclosure', title: 'Enclose', full: 'Spatial Enclosure' },
  { id: 'line', title: 'Connect', full: 'Linear Continuity' },
];
const RELATIONS: { id: Relation; title: string }[] = [
  { id: 'reinforce', title: 'Reinforce' }, { id: 'contain', title: 'Contain' },
  { id: 'cross', title: 'Cross planes' }, { id: 'construct', title: 'Construct' },
];
const VARIATIONS: { id: Variation; title: string }[] = [
  { id: 'none', title: 'None' }, { id: 'rotate', title: 'Rotate' },
  { id: 'fold', title: 'Fold' }, { id: 'divide', title: 'Divide' },
  { id: 'offset', title: 'Offset' },
];
const CASES: Record<Exclude<CaseKey, 'custom'>, Study & { name: string; note: string }> = {
  '09': { governing: 'layering', supporting: 'none', relation: 'reinforce', variation: 'rotate', count: 7, vary: 45, weight: 55, name: '09 / izna — Metronome', note: 'Sequential Layering + rotation progression. Extracted formal reading; schematic geometry, not recovered stage CAD.' },
  '10': { governing: 'enclosure', supporting: 'layering', relation: 'cross', variation: 'fold', count: 6, vary: 60, weight: 83, name: '10 / Yeonjun — Layered / Fold', note: 'Enclosure first, with layering across floor / wall planes. A reconstructed relationship, not a documented production algorithm.' },
  '04': { governing: 'perspective', supporting: 'enclosure', relation: 'contain', variation: 'divide', count: 7, vary: 68, weight: 48, name: '04 / IVE — BLACKHOLE', note: 'Convergence with plane subdivision. A provisional formal mapping of the design intention and revision.' },
  '08': { governing: 'line', supporting: 'layering', relation: 'cross', variation: 'offset', count: 9, vary: 62, weight: 70, name: '08 / Taeyong — Bone / Snake', note: 'Curved path with repeated elements. The actual Grasshopper fabrication process is distinct from this new schematic model.' },
};
const DEFAULT: Study = (({ name: _name, note: _note, ...study }) => study)(CASES['09']);
const INIT_POS: Record<NodeId, Position> = {
  governing: { x: 8, y: 44 }, supporting: { x: 231, y: 44 },
  relation: { x: 101, y: 277 }, variation: { x: 101, y: 493 },
  parameters: { x: 101, y: 705 }, output: { x: 101, y: 906 },
};
const H: Record<NodeId, number> = { governing: 178, supporting: 178, relation: 177, variation: 171, parameters: 159, output: 86 };
const W: Record<NodeId, number> = { governing: 207, supporting: 207, relation: 247, variation: 247, parameters: 247, output: 247 };
const NODE_LINKS: [NodeId, NodeId, string, number, number][] = [
  ['governing', 'relation', '#294bdc', .5, .28],
  ['supporting', 'relation', '#8875c7', .5, .72],
  ['relation', 'variation', '#389e89', .5, .5],
  ['variation', 'parameters', '#b88449', .5, .5],
  ['parameters', 'output', '#294bdc', .5, .5],
];
function clamp(x: number, min: number, max: number) { return Math.max(min, Math.min(max, x)); }
function title(id: Strategy | Support) { return id === 'none' ? 'None' : STRATEGIES.find(s => s.id === id)?.full || id; }
function motionGlyph(id: Strategy | Support | Variation) {
  let figure;
  switch (id) {
    case 'layering': figure = <g className="ne-glyph-motion ne-pulse"><rect x="6" y="7" width="49" height="47"/><rect x="14" y="14" width="34" height="33"/><rect x="22" y="22" width="19" height="18"/><rect x="29" y="28" width="5" height="6"/></g>; break;
    case 'perspective': figure = <g className="ne-glyph-motion ne-pulse"><path d="M5 5 L49 30 L5 55 M57 5 L49 30 L57 55 M5 30 H49"/><circle cx="49" cy="30" r="3" fill="currentColor"/></g>; break;
    case 'enclosure': figure = <g className="ne-glyph-motion ne-shift"><path d="M9 19 L34 6 L55 20 V48 L29 56 L9 43 Z M9 19 L29 33 L55 20 M29 33 V56"/></g>; break;
    case 'line': figure = <g className="ne-glyph-motion ne-flow"><path d="M5 49 C15 4 24 10 31 30 S48 51 58 7 M9 55 C22 20 35 47 57 37"/></g>; break;
    case 'rotate': figure = <g className="ne-glyph-motion ne-spin"><path d="M31 5 L55 30 L31 54 L7 30 Z M31 15 L44 30 L31 43 L18 30 Z"/></g>; break;
    case 'fold': figure = <g className="ne-glyph-motion ne-shift"><path d="M7 42 L32 56 L57 42 L32 27 Z M32 27 V5 L57 20 V42 M32 27 V56"/></g>; break;
    case 'divide': figure = <g className="ne-glyph-motion ne-shift"><path d="M5 6 H28 V29 H5 Z M35 6 H57 V29 H35 Z M5 36 H28 V57 H5 Z M35 36 H57 V57 H35 Z"/></g>; break;
    case 'offset': figure = <g className="ne-glyph-motion ne-shift"><path d="M5 7 H40 V42 H5 Z M24 24 H58 V58 H24 Z"/></g>; break;
    default: figure = <g opacity=".35"><path d="M6 30 H56 M21 18 L41 42 M41 18 L21 42" strokeDasharray="3 5"/></g>;
  }
  return <svg viewBox="0 0 62 63" aria-hidden="true" className="ne-glyph"><g stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" fill="none">{figure}</g></svg>;
}
function relationGlyph(id: Relation) {
  return <svg className="ne-rel-glyph" viewBox="0 0 62 62" aria-hidden="true" fill="none" strokeWidth="1.8" strokeLinejoin="round">
    {id === 'reinforce' && <><path stroke="currentColor" d="M6 9 H35 V41 H6 Z M13 16 H27 V34 H13 Z"/><path stroke="#389e89" d="M27 24 H56 V55 H27 Z M34 31 H49 V47 H34 Z"/></>}
    {id === 'contain' && <><rect stroke="currentColor" x="6" y="7" width="50" height="50"/><rect stroke="#389e89" x="19" y="19" width="24" height="25"/><rect stroke="#389e89" x="26" y="26" width="10" height="11"/></>}
    {id === 'cross' && <><path stroke="currentColor" d="M10 7 V44 L31 56 L54 44 V7 M10 44 L31 32 L54 44"/><path stroke="#389e89" d="M20 13 V38 L40 49 M31 7 V32 L49 40"/></>}
    {id === 'construct' && <><path stroke="currentColor" strokeDasharray="3 4" d="M8 19 L32 7 L54 19 V43 L30 56 L8 44 Z"/><path stroke="#389e89" d="M8 44 L30 30 L54 19 M8 19 L30 30 V56"/></>}
  </svg>;
}
function generateForm(s: Study) {
  const result: Wire[] = [];
  const add = (pts: Point[], color: Wire['color']='main', opacity=1, width=1.65, dash?: string) => result.push({ pts, color, opacity, width, dash });
  const transform = (p: Point, scale: number, turn: number): Point => {
    const [x,y,z]=p; const c=Math.cos(turn), si=Math.sin(turn);
    return [(x*c-y*si)*scale,(x*si+y*c)*scale,z*scale];
  };
  const shape = (kind: Strategy, color: Wire['color'], alpha: number, scale: number, turn: number, supporting=false) => {
    const tr=(p:Point)=>transform(p,scale,turn), n=s.count, amt=s.vary/100;
    if (kind === 'layering' || kind === 'perspective') {
      const frames: Point[][] = [];
      for(let i=0;i<n;i++) {
        const t=i/(n-1), y=-1.14+t*2.28;
        const r=kind==='perspective'?1.03-t*(.65+.2*amt):1.0-t*.26;
        const rotate=s.variation==='rotate'?t*amt*.53:s.variation==='fold'&&t>.5?amt*.45:0;
        const offset=s.variation==='offset'?Math.sin(t*6.28)*amt*.38:0;
        const base:Point[]=[[-r+offset,y,0],[r+offset,y,0],[r+offset,y,r*1.85],[-r+offset,y,r*1.85],[-r+offset,y,0]];
        const frame=base.map(([x,yy,z]):Point=>tr([x*Math.cos(rotate)-z*Math.sin(rotate),yy,x*Math.sin(rotate)+z*Math.cos(rotate)]));
        frames.push(frame);add(frame,color,alpha*(1-t*.2),i===n-1?2.3:1.7);
        if(s.variation==='divide'&&i%2===0)add([frame[0],frame[2]],color,alpha*.45,1.1);
        if(s.variation==='fold'&&i%2===0)add([tr([-r,y,0]),tr([0,y-.34*amt,0]),tr([r,y,0])],color,alpha*.7,1.4);
      }
      if(kind==='perspective')for(let j=0;j<4;j++)add([frames[0][j],frames[n-1][j]],color,alpha*.55,1.4,'5 6');
      if(supporting&&s.relation==='cross')for(let i=0;i<n;i+=2) {
        let y=-1+i*2/(n-1);add([tr([-.82,y,0]),tr([.82,y,0]),tr([.82,y,.45])],color,alpha*.68,1.2);
      }
    } else if(kind==='enclosure'){
      const r=1.08,h=1.76;
      const bot:Point[]=[[-r,-r,0],[r,-r,0],[r,r,0],[-r,r,0]].map(tr);
      const top:Point[]=[[-r,-r,h],[r,-r,h],[r,r,h],[-r,r,h]].map(tr);
      add([...bot,bot[0]],color,alpha,1.8);add([...top,top[0]],color,alpha,1.8);
      for(let i=0;i<4;i++)add([bot[i],top[i]],color,alpha,1.8);
      if(s.variation==='divide')for(let i=1;i<4;i++){
        let t=i/4;const lerp=(a:Point,b:Point):Point=>a.map((x,j)=>x*(1-t)+b[j]*t) as Point;
        add([lerp(bot[0],top[0]),lerp(bot[1],top[1]),lerp(bot[2],top[2])],color,alpha*.5,1);
      }
    } else {
      for(let i=0;i<n;i++){
        const rr=i/(n-1), pts:Point[]=[];
        for(let k=0;k<=50;k++){
          const t=k/50,x=-1.32+t*2.64;
          let y=-.95+rr*1.9,z=.72+.56*Math.sin(t*Math.PI*2.2+rr*2.3)*(.45+.58*amt);
          if(s.variation==='offset')y+=Math.sin(t*8+rr*4)*amt*.32;
          if(s.variation==='fold'&&t>.5)z+=(t-.5)*amt*.9;
          pts.push(tr([x,y,z]));
        }
        add(pts,color,alpha*(1-rr*.25),1.9);
      }
    }
  };
  const together=s.supporting!=='none'&&s.weight>0;
  shape(s.governing,'main',1,together&&s.relation==='contain'?.78:1,0);
  if(together) {
    shape(s.supporting as Strategy,'support',.25+.75*s.weight/100,s.relation==='contain'?1.13:s.relation==='reinforce'?.78:1,s.relation==='cross'?Math.PI/2:s.relation==='construct'?.28:0,true);
  }
  for(let i=-2;i<=2;i+=.5) {add([[i,-2,0],[i,2,0]],'grid',.48,.7);add([[-2,i,0],[2,i,0]],'grid',.48,.7);}
  return result;
}
function project(p: Point, yaw: number, pitch: number): [number,number] {
  const [x,y,z]=p, u=x*Math.cos(yaw)+y*Math.sin(yaw),d=-x*Math.sin(yaw)+y*Math.cos(yaw);
  return [360+u*133,382+d*Math.sin(pitch)*130-z*Math.cos(pitch)*126];
}
function FormViewport({ study }: { study: Study }) {
  const [camera,setCamera]=useState({yaw:.72,pitch:.55});
  const drag=useRef<{ x:number;y:number;yaw:number;pitch:number;id:number }|null>(null);
  const wires=useMemo(()=>generateForm(study),[study]);
  const down=(e:ReactPointerEvent<SVGSVGElement>)=>{ if(e.button!==0)return; drag.current={x:e.clientX,y:e.clientY,yaw:camera.yaw,pitch:camera.pitch,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId); };
  const move=(e:ReactPointerEvent<SVGSVGElement>)=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;setCamera({yaw:d.yaw+(e.clientX-d.x)*.006,pitch:clamp(d.pitch-(e.clientY-d.y)*.003,.17,1.16)});};
  const up=()=>{drag.current=null;};
  const reset=()=>setCamera({yaw:.72,pitch:.55});
  return <div className="ne-viewport">
    <div className="ne-vhead"><span className="ne-caption">01 — LIVE FORM VIEWPORT</span><button type="button" onClick={reset} className="ne-view-reset">↺ RESET VIEW</button></div>
    <div className="ne-stage">
      <svg viewBox="0 0 720 650" className="ne-stage-svg" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Interactive schematic geometry; drag to orbit">
        <defs><pattern id="ne-stage-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" stroke="var(--ne-grid)" strokeWidth=".6" fill="none"/></pattern></defs>
        <rect width="720" height="650" fill="var(--ne-view)"/><rect width="720" height="650" fill="url(#ne-stage-grid)"/>
        {wires.map((w,i)=><polyline key={i} points={w.pts.map(p=>project(p,camera.yaw,camera.pitch).map(v=>v.toFixed(1)).join(',')).join(' ')} fill="none" stroke={w.color==='main'?'var(--ne-ink)':w.color==='support'?'var(--ne-accent)':'var(--ne-grid-strong)'} strokeWidth={w.width} opacity={w.opacity} strokeDasharray={w.dash} strokeLinejoin="round" strokeLinecap="round"/>)}
        <text x="23" y="30" fill="var(--ne-muted)" fontSize="11" letterSpacing="2">OXX / FORM STUDY</text>
        <text x="23" y="48" fill="var(--ne-muted)" fontSize="10">N={study.count} / VARIATION {study.vary}% / SUPPORT {study.weight}%</text>
      </svg>
      <div className="ne-view-hint">DRAG TO ORBIT ↔ &nbsp; / &nbsp; SCHEMATIC 3D</div>
    </div>
  </div>;
}
type NodeOption = { id: string; label: string };
function OptionGrid({ values, selected, onPick, role }: {values:NodeOption[]; selected:string;onPick:(value:string)=>void;role:string}) {
  return <div className="ne-options">{values.map(v=><button type="button" title={v.label} aria-label={role+': '+v.label} aria-pressed={v.id===selected} className={'ne-option '+(selected===v.id?'chosen':'')} onClick={()=>onPick(v.id)} key={v.id}>{motionGlyph(v.id as Strategy|Variation|Support)}<span>{v.label}</span></button>)}</div>;
}
function RelationGrid({ selected, onPick }: { selected:Relation;onPick:(v:Relation)=>void }) {
  return <div className="ne-rel-options">{RELATIONS.map(v=><button type="button" aria-pressed={selected===v.id} aria-label={'Relationship: '+v.title} className={'ne-rel-option '+(selected===v.id?'chosen':'')} key={v.id} onClick={()=>onPick(v.id)}>{relationGlyph(v.id)}<span>{v.title}</span></button>)}</div>;
}
function NodeBox({id,position,onDrag,children}: {id:NodeId;position:Position;onDrag:(id:NodeId,x:number,y:number)=>void;children:React.ReactNode}) {
  const gesture=useRef<{id:number;startX:number;startY:number;left:number;top:number}|null>(null);
  const pointerDown=(e:ReactPointerEvent<HTMLElement>)=>{if(e.button!==0)return;gesture.current={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:position.x,top:position.y};e.currentTarget.setPointerCapture(e.pointerId)};
  const pointerMove=(e:ReactPointerEvent<HTMLElement>)=>{const d=gesture.current;if(!d||d.id!==e.pointerId)return;onDrag(id,clamp(d.left+(e.clientX-d.startX),0,448-W[id]),clamp(d.top+e.clientY-d.startY,5,1060-H[id]));};
  return <div className={'ne-node ne-'+id} style={{left:position.x,top:position.y,width:W[id],height:H[id]}}>
    {(id==='relation'||id==='variation'||id==='parameters'||id==='output')&&<span className="ne-socket ne-socket-in"/>}
    {id==='relation'&&<><span className="ne-socket ne-left-in"/><span className="ne-socket ne-right-in"/></>}
    {id!=='output'&&<span className="ne-socket ne-socket-out"/>}
    <header className="ne-node-head" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={()=>gesture.current=null} onPointerCancel={()=>gesture.current=null}><strong>{({governing:'01 / GOVERNING',supporting:'02 / SUPPORTING',relation:'03 / RELATION',variation:'04 / VARIATION',parameters:'05 / PARAMETERS',output:'06 / FORM OUTPUT'})[id]}</strong><small>{({governing:'DOMINANT',supporting:'SECONDARY',relation:'A ↔ B',variation:'TRANSFORM',parameters:'CONTROL',output:'LIVE'})[id]}</small></header>
    <div className="ne-node-body">{children}</div>
  </div>;
}
function NodeWorkspace({study,setStudy,reset}: {study:Study;setStudy:(s:Study)=>void;reset:()=>void}) {
  const [positions,setPositions]=useState<Record<NodeId,Position>>(()=>({...INIT_POS}));
  const [scale,setScale]=useState(1);
  const scrollRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=scrollRef.current;if(!el)return;
    const measure=()=>setScale(Math.min(1,Math.max(.64,(el.clientWidth-8)/448)));
    measure();const ro=new ResizeObserver(measure);ro.observe(el);return ()=>ro.disconnect();
  },[]);
  const modify=<K extends keyof Study>(key:K,v:Study[K])=>setStudy({...study,[key]:v});
  const drag=(id:NodeId,x:number,y:number)=>setPositions(p=>({...p,[id]:{x,y}}));
  const wires=NODE_LINKS.map(([a,b,c,rx,tx])=>{
    const start=positions[a],end=positions[b];
    const x1=start.x+W[a]*rx,y1=start.y+H[a],x2=end.x+W[b]*tx,y2=end.y;
    const diff=Math.max(21,Math.abs(y2-y1)*.43);
    return {path:'M'+x1+' '+y1+' C'+x1+' '+(y1+diff)+','+x2+' '+(y2-diff)+','+x2+' '+y2,color:c,hidden:a==='supporting'&&study.supporting==='none'};
  });
  return <aside className="ne-editor">
    <div className="ne-editor-head"><div><span className="ne-caption">02 — NODE WORKSPACE</span><p>Drag node headers · Select animated form verbs</p></div><div className="ne-editor-tools"><button type="button" onClick={()=>scrollRef.current?.scrollTo({top:0,behavior:'smooth'})}>↑ TOP</button><button type="button" onClick={()=>{setPositions({...INIT_POS});reset()}}>↺ RESET</button></div></div>
    <div className="ne-editor-scroll" ref={scrollRef}>
      <div className="ne-graph-space" style={{width:448*scale,height:1060*scale}}>
      <div className="ne-graph" style={{transform:'scale('+scale+')'}}>
        <svg className="ne-wires" viewBox="0 0 448 1060" aria-hidden="true">{wires.map((w,i)=><g key={i} opacity={w.hidden?.18:1}><path d={w.path} stroke="var(--ne-surface)" strokeWidth="6" fill="none"/><path d={w.path} stroke={w.color} strokeWidth="2.5" strokeLinecap="round" fill="none"/></g>)}</svg>
        <NodeBox id="governing" position={positions.governing} onDrag={drag}><span className="ne-help">Choose the main formal order</span><OptionGrid role="Governing" values={STRATEGIES.map(s=>({id:s.id,label:s.title}))} selected={study.governing} onPick={v=>{const next=v as Strategy;setStudy({...study,governing:next,supporting:study.supporting===next?'none':study.supporting})}}/><div className="ne-selection">STRATEGY A <b>{title(study.governing)}</b></div></NodeBox>
        <NodeBox id="supporting" position={positions.supporting} onDrag={drag}><span className="ne-help">Add a supporting formal order</span><OptionGrid role="Supporting" values={[{id:'none',label:'None'},...STRATEGIES.map(s=>({id:s.id,label:s.title}))]} selected={study.supporting} onPick={v=>modify('supporting',v===study.governing?'none':v as Support)}/><div className="ne-selection">STRATEGY B <b>{title(study.supporting)}</b></div></NodeBox>
        <NodeBox id="relation" position={positions.relation} onDrag={drag}><span className="ne-help">How the two strategies interact</span><RelationGrid selected={study.relation} onPick={v=>setStudy({...study,relation:v,supporting:study.supporting==='none'?'enclosure':study.supporting})}/></NodeBox>
        <NodeBox id="variation" position={positions.variation} onDrag={drag}><span className="ne-help">Transform the geometry</span><OptionGrid role="Variation" values={VARIATIONS.map(v=>({id:v.id,label:v.title}))} selected={study.variation} onPick={v=>modify('variation',v as Variation)}/></NodeBox>
        <NodeBox id="parameters" position={positions.parameters} onDrag={drag}><span className="ne-help">Scrub the parameters</span>{([{key:'count',label:'Repeat',min:3,max:10},{key:'vary',label:'Variation',min:0,max:100},{key:'weight',label:'Relation',min:0,max:100}] as const).map(v=><label className="ne-slider" key={v.key}><span>{v.label}</span><input aria-label={v.label} type="range" min={v.min} max={v.max} value={study[v.key]} onChange={e=>modify(v.key,+e.target.value)}/><b>{study[v.key]}</b></label>)}</NodeBox>
        <NodeBox id="output" position={positions.output} onDrag={drag}><div className="ne-output"><i/> Connected to live viewport <strong>ACTIVE</strong></div></NodeBox>
      </div>
      </div>
    </div>
    <div className="ne-editor-foot">Fixed composition pipeline · draggable nodes · experimental geometry</div>
  </aside>;
}
export function NodeEnginePage() {
  const {principle}=useParams(); const [search]=useSearchParams(); const navigate=useNavigate();
  const initialCase=search.get('preset') as CaseKey|null;
  const [caseKey,setCaseKey]=useState<CaseKey>(()=>initialCase&&initialCase in CASES?initialCase:'custom');
  const [study,setStudyState]=useState<Study>(()=>{
    if(initialCase&&initialCase in CASES){const {name:_n,note:_t,...s}=CASES[initialCase as keyof typeof CASES];return s;}
    return {...DEFAULT,governing:STRATEGIES.some(s=>s.id===principle)?principle as Strategy:'layering'};
  });
  useEffect(()=>{
    const p=search.get('preset');
    if(p&&p in CASES){const {name:_name,note:_note,...s}=CASES[p as keyof typeof CASES];setStudyState(s);setCaseKey(p as CaseKey);}
  },[search]);
  const setStudy=(s:Study)=>{setStudyState(s);setCaseKey('custom')};
  const loadCase=(key:CaseKey)=>{
    if(key==='custom'){setCaseKey('custom');setStudyState({...DEFAULT,supporting:'enclosure',relation:'contain',variation:'none',count:5});navigate('/engine/layering',{preventScrollReset:true});return;}
    const {name:_n,note:_t,...s}=CASES[key];setStudyState(s);setCaseKey(key);navigate('/engine/'+s.governing+'?preset='+key,{preventScrollReset:true});
  };
  const exportStudy=()=>saveFile('oxx-node-form-study.json',JSON.stringify({version:'0.3',status:'schematic study',caseReference:caseKey==='custom'?null:caseKey,study},null,2),'application/json');
  const chosen=caseKey==='custom'?null:CASES[caseKey];
  return <section className="oxx-node-engine">
    <div className="ne-page-heading"><div><span className="ne-caption">OXX LAB / ENGINE</span><h1>Form <span>Composer.</span></h1><p>Choose a governing strategy. Connect its supporting logic. Transform the relation.</p></div><div className="ne-links"><Link to="/field">Cases ↗</Link><Link to="/engine-classic/layering">Classic engine ↗</Link></div></div>
    <div className="ne-casebar"><span className="ne-caption">RESTORE CASE</span>{([{id:'09',label:'09 / izna'},{id:'10',label:'10 / Yeonjun'},{id:'04',label:'04 / IVE'},{id:'08',label:'08 / Taeyong'},{id:'custom',label:'+ New study'}] as const).map(k=><button key={k.id} type="button" className={caseKey===k.id?'active':''} onClick={()=>loadCase(k.id)}>{k.label}</button>)}<button className="ne-export" type="button" onClick={exportStudy}>EXPORT JSON ↓</button></div>
    <div className="ne-workbench">
      <div className="ne-left">
        <FormViewport study={study}/>
        <div className="ne-trace"><div className="ne-caption">COMPOSITION / DECISION TRACE</div><h2>{chosen?chosen.name:'Live / Formal Exploration'}</h2><p>{chosen?chosen.note:'An experimental configuration, not a claim about historical design decisions.'}</p><Link to={chosen?'/field/'+caseKey:'/field'}>View case evidence ↗</Link></div>
      </div>
      <NodeWorkspace study={study} setStudy={setStudy} reset={()=>setStudyState({...DEFAULT})}/>
    </div>
    <div className="ne-disclaimer"><span>FORMAL LOGIC / SCHEMATIC STUDY — NOT ORIGINAL STAGE CAD</span><span>Strategy combinations are research prototypes, not a trained AI model.</span></div>
  </section>;
}
