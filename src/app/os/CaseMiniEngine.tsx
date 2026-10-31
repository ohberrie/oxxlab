import { useState } from 'react';
import { Link } from 'react-router';
import { DEFAULT_PARAMS, ENGINES, type Case, type EngineId, type Params } from './data';
import { Viewer } from './Viewer';
import { useOs } from './Shell';

type Key = 'count' | 'rotation' | 'depth' | 'scale' | 'fold';
type Control = { key: Key; label: string; min: number; max: number; step: number };
const C: Record<string, Control> = {
  count: {key:'count',label:'Sequence density',min:3,max:22,step:1},
  rotation: {key:'rotation',label:'Directional variation',min:0,max:100,step:1},
  depth: {key:'depth',label:'Spatial depth',min:0,max:240,step:1},
  scale: {key:'scale',label:'Scale progression',min:0,max:.85,step:.01},
  fold: {key:'fold',label:'Folding angle',min:0,max:90,step:1},
};
type Study = { additions: EngineId[]; controls: Key[]; preset: Params; note: string; };
const STUDIES: Record<string, Partial<Study>> = {
  '03': { additions:['division'],controls:['count','rotation','depth'],note:'Enclosure + a schematic surface division. Displacement is a retrospective hypothesis, not a recovered production algorithm.' },
  '04': { additions:['division'],controls:['scale','depth','count'],note:'Receding thresholds + a local division hypothesis. Actual LED simplifications are documented separately.' },
  '05': { additions:[],controls:['count','depth'],note:'A simplified enclosure study. Ceiling and camera-density constraints are recorded in Realization.' },
  '06': { additions:[],controls:['rotation','count','depth'],note:'Curved-path continuity between zones, not a reconstruction of scenic props.' },
  '07': { additions:[],controls:['count','rotation','depth'],note:'Sequential depth variation study; unselected radial ideas are not described as built.' },
  '08': { additions:[],controls:['rotation','count','depth'],note:'Curvature-guided repetition study. Rib production and MAKE are documented separately.' },
  '09': { additions:[],controls:['rotation','scale','count'],note:'Parameter study based on the selected repeated-frame principle, not recovered stage CAD.' },
  '10': { additions:['layering'],controls:['fold','count','depth'],note:'Enclosure + sequential layering across planes. Folding represents the design logic, not a verified final construction.' },
  '11': { additions:['division'],controls:['rotation','count','depth'],note:'Provisional spatial fragmentation reading. Collapse mechanics have not been reconstructed.' },
  '12': { additions:[],controls:['scale','depth','count'],note:'Provisional thick-frame / convergence reading, pending source geometry and detailed project decisions.' },
};
const PRESETS: Record<string, Partial<Params>> = {
  '03': {count:7,rotation:20,depth:100,scale:.32,profile:'square',domain:'planes'},
  '04': {count:7,rotation:35,depth:180,scale:.65,profile:'square',domain:'axis'},
  '05': {count:8,rotation:0,depth:115,scale:.22,profile:'square',domain:'planes'},
  '06': {count:13,rotation:62,depth:135,scale:.3,profile:'circle',domain:'axis'},
  '07': {count:9,rotation:25,depth:160,scale:.5,profile:'circle',domain:'axis'},
  '08': {count:16,rotation:70,depth:185,scale:.3,profile:'square',domain:'axis'},
  '09': {count:10,rotation:35,depth:180,scale:.65,profile:'triangle',domain:'axis'},
  '10': {count:8,rotation:0,depth:150,scale:.5,profile:'square',fold:65,domain:'planes'},
  '11': {count:7,rotation:35,depth:120,scale:.4,profile:'square',domain:'planes'},
  '12': {count:5,rotation:30,depth:190,scale:.5,profile:'square',domain:'axis'},
};
export function CaseMiniEngine({ project }: { project: Case }) {
  const spec = STUDIES[project.id] || { additions:[],controls:['count','depth'] as Key[],note:'Experimental case reading.' };
  const preset: Params = {...DEFAULT_PARAMS,...PRESETS[project.id]};
  const [params,setParams] = useState<Params>(preset);
  const {setEngine} = useOs();
  const engine: EngineId = project.engine === 'spine' ? 'line' : project.engine;
  const controls = spec.controls ?? ['count','depth'];
  const additions = spec.additions ?? [];
  const set = (key: Key,v:number) => setParams(current=>({...current,[key]:v}));
  const runFull = () => setEngine({params:{...params},additions:[...additions],disabled:new Set(),selected:-1});
  return <section className="case-mini" aria-label={'Explore the formal composition for case '+project.id}>
    <div className="case-mini-top"><h2>Explore the form.</h2><span>Case ${project.id} / interactive study</span></div>
    <div className="case-mini-workspace">
      <Viewer kind={ENGINES[engine].kind} params={params} additions={additions} className="case-mini-view" dock caption="LIVE STUDY" subtitle="" />
      <div className="case-mini-controls">
        {controls.map(key=>{const control=C[key],value=params[key]??0;return <label key={key}>{control.label}<output>{Number(value).toFixed(control.step<1?2:0)}</output><input type="range" min={control.min} max={control.max} step={control.step} value={value} onChange={e=>set(key,+e.target.value)}/></label>})}
        <div className="case-mini-footer"><button onClick={()=>setParams({...preset})} title="Reset this variation">↺ Reset</button>
          <Link to={'/engine/'+engine} onClick={runFull}>Continue in Engine ↗</Link></div>
      </div>
    </div>
    <details className="case-mini-about"><summary>About this model</summary><p>{spec.note} This experiment does not reproduce original CAD, historical alternatives or validated fabrication details.</p></details>
  </section>;
}
