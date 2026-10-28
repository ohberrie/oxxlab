import { Link } from 'react-router';
import { Viewer } from './Viewer';
import { STUDIES, layeringModel, presetStudy } from './layering';

export function StudyPair({landing=false}:{landing?:boolean}) {
  return <section className={`study-pair ${landing?'landing-studies':''}`}>
    <div className="pair-heading"><div><span className="eyebrow">RESEARCH FOCUS / 09 + 10</span><h2>Different forms.<br/>A shared principle.</h2></div><p>두 작업의 조형 판단에서 공통 규칙을 추출합니다.<br/>회전과 접힘을 같은 엔진에서 직접 비교해보세요.</p></div>
    <div className="pair-grid">{(['09','10'] as const).map(id=><article key={id}>
      <Link to={`/cases/${id}`} className="pair-visual" aria-label={`Read ${STUDIES[id].artist} case`}><span className="pair-index">{id}</span><Viewer kind="converge" interactive={false} geometry={layeringModel(presetStudy(id))} description={`${STUDIES[id].artist} schematic principle diagram`}/><span className="diagram-label">PRINCIPLE DIAGRAM / NOT BUILT PHOTOGRAPHY</span></Link>
      <div className="pair-info"><div><h3>{STUDIES[id].artist}<span>{STUDIES[id].title}</span></h3><p>Sequential Layering + {STUDIES[id].recipe}</p></div><Link to={`/engine/layering?preset=${id}`}>Explore preset ↗</Link></div>
    </article>)}</div>
  </section>;
}
