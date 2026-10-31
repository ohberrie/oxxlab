import { Link, useSearchParams } from 'react-router';
import { CASES, CASE_STRATEGY, caseTitle, caseMetadata } from '../os/data';
import { CaseAxon } from '../os/CaseAxon';

export function FieldPage() {
  const [search]=useSearchParams();
  const archive=search.get('archive')==='1';
  const atlas=search.get('view')==='atlas';
  const cases=CASES.filter(c=>!c.held||archive);
  const href=(patch:Record<string,string|null>)=>{
    const next=new URLSearchParams(search);
    for(const [k,v] of Object.entries(patch))v===null?next.delete(k):next.set(k,v);
    return next.toString()?'?'+next.toString():'/field';
  };
  return <section className="page cases-index-min">
    <header className="cases-index-heading">
      <div><h1>Cases.</h1><p>Real spaces. Reusable formal strategies.</p></div>
      <div className="cases-index-switch">
        <Link to={href({view:null})} className={!atlas?'active':''} replace>Grid</Link>
        <Link to={href({view:'atlas'})} className={atlas?'active':''} replace>Index</Link>
      </div>
    </header>
    {atlas?<div className="atlas cases-atlas">
      <table><thead><tr><th>CASE</th><th>FORMAL STRATEGY</th><th>VARIATION</th></tr></thead>
        <tbody>{cases.map(c=><tr key={c.id}>
          <td><Link to={'/field/'+c.id}>{c.id} / {caseTitle(c)} ↗</Link><small className="case-card-meta">{caseMetadata(c)}</small></td>
          <td>{CASE_STRATEGY[c.id].dominant}</td>
          <td>{CASE_STRATEGY[c.id].variation}</td>
        </tr>)}</tbody>
      </table>
    </div>:<div className="field-grid field-grid-research">
      {cases.map(c=><article key={c.id} className={'field-card project-card'+(c.held?' project-card-held':'')}>
        {c.held?<Link to={'/field/'+c.id} className="pending-card project-card-pending"><span>CASE {c.id}</span><strong>Mapping on hold</strong></Link>:
          <Link to={'/field/'+c.id} className="iso-link" aria-label={'Open case '+c.id}><CaseAxon id={c.id}/></Link>}
        <div className="project-card-heading">
          <div><span className="case-card-number">{c.id}</span><h2><Link to={'/field/'+c.id}>{caseTitle(c)}</Link></h2><p className="case-card-meta">{caseMetadata(c)}</p></div>
          <span className="project-card-arrow" aria-hidden="true">↗</span>
        </div>
        {!c.held&&<p className="case-card-language">{CASE_STRATEGY[c.id].dominant} <span>+ {CASE_STRATEGY[c.id].variation}</span></p>}
      </article>)}
    </div>}
    <div className="cases-index-foot">
      <Link to={href({archive:archive?null:'1'})} replace>{archive?'Hide early archive':'Early archive / 01–02'} ↗</Link>
      <details><summary>About these models</summary><p>Solid axonometric models are interpretive 3D form studies, not original stage CAD. Cases 11–12 remain provisional; original built photographs are added only when approved source imagery is available.</p></details>
    </div>
  </section>;
}
