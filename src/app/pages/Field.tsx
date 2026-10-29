import { Link, useSearchParams } from 'react-router';
import { CASES, CASE_STRATEGY, caseLogicPath, caseTitle, caseMetadata, type CaseType } from '../os/data';
import { CaseDiagram } from '../os/CaseDiagram';

const FILTERS: ('All' | CaseType)[] = ['All', 'Form finding', 'Fabrication'];

export function FieldPage() {
  const [search] = useSearchParams();
  const type = FILTERS.find(f => f === search.get('type')) ?? 'All';
  const atlas = search.get('view') === 'atlas';
  const cases = CASES.filter(c => type === 'All' || c.type === type);
  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(search);
    for (const [k, v] of Object.entries(patch)) if (v === null) next.delete(k); else next.set(k, v);
    const qs = next.toString();
    return qs ? '?' + qs : '/field';
  };

  return <section className="page">
    <div className="page-heading">
      <div><span className="eyebrow">Cases / field research / 03—12</span><h1>Form, found<br />in practice.</h1></div>
      <p>Different briefs. Recurring spatial strategies.<br />Each project records an intention, a formal choice, and what survived reality.</p>
    </div>
    <div className="case-field-intro">
      <span className="eyebrow">READ THE ATLAS</span>
      <span>01 / OBSERVE</span><span>02 / IDENTIFY THE DOMINANT STRATEGY</span><span>03 / FOLLOW ITS VARIATION</span>
    </div>
    <div className="field-toolbar">
      <div className="filters">
        {FILTERS.map(f => <Link key={f} to={href({ type: f === 'All' ? null : f })} replace className={type === f ? 'active' : ''}>{f}</Link>)}
      </div>
      <div className="segmented">
        <Link to={href({ view: null })} replace className={atlas ? '' : 'active'}>GRID</Link>
        <Link to={href({ view: 'atlas' })} replace className={atlas ? 'active' : ''}>ATLAS</Link>
      </div>
    </div>

    {atlas ? <div className="atlas">
      <table>
        <thead><tr><th>CASE / PROJECT</th><th>DOMINANT FORMAL STRATEGY</th><th>SUPPORTING VARIATION</th><th>STATUS</th><th>ENGINE</th></tr></thead>
        <tbody>{cases.map(c => <tr key={c.id}>
          <td><Link to={'/field/'+c.id}><strong>{c.id} / {caseTitle(c)}</strong> ↗</Link><small className="case-card-meta">{caseMetadata(c)}</small></td>
          <td>{CASE_STRATEGY[c.id].dominant}</td>
          <td>{CASE_STRATEGY[c.id].variation}</td>
          <td>{c.held ? 'ON HOLD' : c.id === '11' || c.id === '12' ? 'PROVISIONAL' : c.status}</td>
          <td>{c.held ? '—' : <Link to={caseLogicPath(c)}>EXPLORE ↗</Link>}</td>
        </tr>)}</tbody>
      </table>
    </div> : <div className="field-grid field-grid-research">
      {cases.map(c => <Link key={c.id} className={'field-card project-card'+(c.held ? ' project-card-held' : '')} to={'/field/'+c.id}>
        {c.held ? <div className="pending-card project-card-pending">
          <span className="mono">EARLY PRACTICE / {c.id}</span>
          <span>FORMAL<br/>MAPPING<br/>ON HOLD</span>
          <small>Not included in the present extraction study.</small>
        </div> : <CaseDiagram id={c.id} />}
        <div className="project-card-heading">
          <div><span className="eyebrow">CASE {c.id} <span className="project-card-divider">/</span> {c.held ? 'ARCHIVE' : c.id === '11' || c.id === '12' ? 'PROVISIONAL READING' : 'FORMAL STUDY'}</span>
            <h2>{caseTitle(c)}</h2>
            <p className="case-card-meta">{caseMetadata(c)}</p>
          </div><span className="project-card-arrow" aria-hidden="true">↗</span>
        </div>
        {!c.held && <div className="project-card-strategy">
          <div><small>DOMINANT</small><span>{CASE_STRATEGY[c.id].dominant}</span></div>
          <div><small>VARIATION</small><span>{CASE_STRATEGY[c.id].variation}</span></div>
        </div>}
      </Link>)}
    </div>}
    <p className="field-note">The thumbnails are original OXX analytical diagrams—not production photographs, stage CAD files or verified generative reconstructions. Their purpose is to distinguish the governing spatial character of each project. Cases 01–02 are intentionally held; 11–12 are provisional formal readings. Detailed built assets can be inserted without changing the card system.</p>
  </section>;
}
