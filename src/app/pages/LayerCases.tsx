import { StudyPair } from '../os/StudyPair';
import { Link, useParams } from 'react-router';
import { Viewer } from '../os/Viewer';
import { STUDIES, layeringModel, presetStudy, type PresetId } from '../os/layering';

export function LayerCasesPage(){return <div className="page featured-cases"><div className="cases-intro"><span className="eyebrow">CASES / FORMAL DECISIONS</span><h1>Practice becomes principle.</h1><p>Intent → Formal Choice → Built → Extraction</p></div><StudyPair/><div className="archive-entry"><div><span className="eyebrow">THE WIDER CORPUS</span><p>Existing case records, fabrication studies and provisional readings.</p></div><Link to="/field">Open field archive ↗</Link></div></div>}
export function LayerCasePage(){
  const {id}=useParams();
  if(id!=='09'&&id!=='10')return <div className="page"><h1>Case not found.</h1><Link to="/cases">Return to Cases ↗</Link></div>;
  return <LayerCaseContent key={id} id={id}/>;
}
function LayerCaseContent({id}:{id:PresetId}){
  const c=STUDIES[id],study=presetStudy(id),other=id==='09'?'10':'09';
  return <article className="page layer-case"><Link className="back" to="/cases">← CASES</Link>
    <header className="layer-case-header"><div><span className="eyebrow">CASE {id} / SEQUENTIAL LAYERING</span><h1>{c.artist}</h1><p>{c.title}</p></div><div><span className="eyebrow">DOMINANT / SEQUENTIAL LAYERING</span><p>Variation / {c.recipe}</p><Link className="btn" to={`/engine/layering?preset=${id}`}>Open this composition ↗</Link></div></header>
    <Viewer kind="converge" geometry={layeringModel(study)} dock caption={`CASE ${id} / FORMAL READING`} subtitle="Interactive principle diagram · schematic geometry" className="case-principle" description={`${c.artist} principle study; not a measured reconstruction`}/>
    <nav className="case-section-nav" aria-label="Case stages">{['Intent','Formal Choice','Built','Extraction'].map((label,i)=><a key={label} href={`#stage-${i+1}`}><span>0{i+1}</span>{label}</a>)}</nav>
    <section id="stage-1" className="case-stage"><span className="eyebrow">01 / INTENT</span><div><h2>{c.intent}</h2><p>{c.intentKo}</p><p className="evidence-note">{c.note}. The reading is based on the supplied project discussion; production records and credits remain to be attached.</p></div></section>
    <section id="stage-2" className="case-stage"><span className="eyebrow">02 / FORMAL CHOICE</span><div><h2>{id==='09'?'Rhythm through progressive change.':'Continuity through a shared hinge.'}</h2><p>{c.choice}</p><div className="formal-recipe"><span>Base / {id==='09'?'Triangle':'Frame'}</span><span>Sequential Layering</span><span>{c.recipe}</span></div><details className="case-detail"><summary>Read the operation hierarchy +</summary><p>The base strategy establishes a depth sequence. Variation operators transform each local profile before depth placement. In this study, {id==='09'?'scale precedes rotation; the triangular profile and shared focus remain legible.':'folding precedes axis reorientation; the local hinge connects the lower and upper portions of each frame.'} This ordering is an explicit modeling choice, open to revision against project evidence.</p></details></div></section>
    <section id="stage-3" className="case-stage"><span className="eyebrow">03 / BUILT</span><div><h2>The built record is still to be connected.</h2><p>실제 무대 사진·제작 도면·크레딧은 현재 저장소에서 확인되지 않았습니다. 위 다이어그램은 제작 결과를 재현한 이미지가 아닙니다.</p><div className="evidence-register"><span>Stage photography</span><b>NOT ATTACHED</b><span>Fabrication / dimensions</span><b>NOT ATTACHED</b><span>Intent → built comparison</span><b>AWAITING EVIDENCE</b></div></div></section>
    <section id="stage-4" className="case-stage"><span className="eyebrow">04 / EXTRACTION</span><div><h2>Keep the principle. Reopen the possibilities.</h2><p>{c.extraction}</p><p className="evidence-note">A shared engine is a research hypothesis. It does not establish that the original stages used the same algorithm.</p><Link className="btn" to={`/engine/layering?preset=${id}`}>Test {c.artist} in the engine ↗</Link></div></section>
    <div className="other-case"><span className="eyebrow">SAME ENGINE / ANOTHER COMPOSITION</span><Link to={`/cases/${other}`}>{other} / {STUDIES[other].artist} — {STUDIES[other].title} ↗</Link></div>
  </article>;
}
