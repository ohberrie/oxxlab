import { Link, useParams } from 'react-router';
import { ENGINES, HELD_CASES, caseKind, caseLogicPath, caseSteps, getCase } from '../os/data';
import { Viewer } from '../os/Viewer';

export function CasePage() {
  const { id } = useParams();
  const c = getCase(id);
  if (!c) return <section className="page"><Link className="back" to="/field">← CASES</Link><h1>{HELD_CASES.includes(id ?? '') ? `Case ${id} / Mapping held` : 'Case not found'}</h1><p>No formal strategy has been assigned to this entry.</p></section>;
  const rows = caseSteps(c);
  const pending = c.placeholder;
  const choice = c.engine === 'spine' ? 'Line / adaptive continuity' : ENGINES[c.engine].name;
  const scenes = [
    ['Intent', c.id === '09' ? 'Metronome / repetition / movement' : c.id === '10' ? 'A minimal, layered spatial set' : pending ? 'Source brief pending' : rows[0][1], c.id === '10' ? 'Intent is summarized from the supplied conversation. Original director brief and constraints remain to be attached.' : rows[0][2]],
    ['Formal Choice', pending ? 'Mapping pending' : c.summary, pending ? 'The case number is retained without assigning an invented artist or formal strategy.' : `${choice}. This is a retrospective reading from the supplied narrative; detailed selection records remain to be verified.`],
    ['Realization / Built', 'Selected form meets physical conditions', 'Built photographs, material details, rigging, camera conditions and original drawings have not been supplied. No schematic on this page is evidence of a built outcome.'],
    ['Extraction', pending ? 'Await source confirmation' : 'Return the relationship to a new study', pending ? 'No extracted engine is attributed to this case yet.' : 'The linked engine is a newly implemented schematic interpretation. Change the profile, domain and operation order to explore new possibilities; it does not reproduce original stage files.'],
  ];
  return <section className="page">
    <Link className="back" to="/field">← CASES</Link>
    <div className="case-header"><div><span className="eyebrow">Case {c.id} / {pending ? 'Source index pending' : 'Narrative-based reading'}</span><h1>{c.name}</h1>{c.workingTitle && <p className="mono">WORKING REFERENCE / {c.workingTitle}</p>}<p>{c.summary}</p></div><div className="metadata">{c.song && <>SONG / {c.song}<br /></>}{c.identityNote && <>{c.identityNote}<br /></>}DATE / CREDITS — AWAITING RECORDS<br />{pending ? 'UNASSIGNED' : 'SCHEMATIC EXTRACTION / SOURCE CHECK PENDING'}</div></div>
    <div className="case-analysis">{scenes.map(([title, heading, detail], i) => <article className="case-scene" key={title}>
      <div><span className="eyebrow">0{i+1} / {title}</span><h2>{heading}</h2><p>{detail}</p>
      {i === 2 && <details><summary>Base rules & production details +</summary><p>Design conditions: performer circulation, camera and available volume. Realization conditions: material, segmentation, support and installation sequence. These are documentation categories; case-specific values and divergence records are pending.</p>{c.id === '08' && <Link className="blue" to="/tools">Supplementary utility / flatten + label ↗</Link>}</details>}
      {i === 3 && !pending && <Link className="btn" to={caseLogicPath(c)}>Explore this choice in Engine ↗</Link>}</div>
      {i === 1 && !pending && <Viewer kind={caseKind(c)} params={{count:10,rotation:c.id === '10'?0:35,depth:180,profile:c.id === '10'?'square':'triangle',scale:0.6,fold:c.id === '10'?65:0,domain:c.id === '10'?'planes':'axis'}} dock caption="SCHEMATIC / RETROSPECTIVE READING" subtitle="Not original stage geometry" />}
      {i === 2 && <div className="evidence-slot"><div><strong>Built record pending</strong>Original photographs and drawings needed.<br />No mock photograph is shown.</div></div>}
    </article>)}</div>
    {!pending && <details className="composition-panel"><summary>Research notes / internal analysis +</summary>{rows.map(([title, conclusion, detail]) => <p key={title}><b>{title} / {conclusion}</b><br />{detail}</p>)}</details>}
  </section>;
}
