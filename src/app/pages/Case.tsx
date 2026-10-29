import { Link, useParams } from 'react-router';
import { CASE_READING, CASE_STRATEGY, HELD_CASES, caseTitle, caseMetadata, caseLogicPath, getCase } from '../os/data';
import { CaseDiagram } from '../os/CaseDiagram';
import { CaseMedia } from '../os/CaseMedia';

const CHAPTERS = ['Intent', 'Formal Choice', 'Realization / Built', 'Extraction'] as const;

export function CasePage() {
  const { id } = useParams();
  const c = getCase(id);
  if (!c) return <section className="page"><Link className="back" to="/field">← CASES</Link><h1>Case not found.</h1></section>;
  if (c.held) return <section className="page case-held-detail">
    <Link className="back" to="/field">← CASES</Link>
    <span className="eyebrow">CASE {c.id} / MAPPING HELD</span>
    <h1>{caseTitle(c)}</h1>
    <p>{caseMetadata(c)}</p>
    <div className="case-held-notice">
      <span className="eyebrow">ARCHIVE / NOT IN THE CURRENT FORMAL CORPUS</span>
      <p>These early stage-design projects remain in the archive, but have deliberately not been assigned a dominant formal strategy. The current OXX extraction begins with Case 03.</p>
    </div>
    <Link to="/field">← Return to Cases</Link>
  </section>;

  const r = CASE_READING[c.id];
  const s = CASE_STRATEGY[c.id];
  const provisional = c.id === '11' || c.id === '12';
  const paragraphs = [r.intent, r.choice, r.realization, r.extraction];

  return <section className="page case-research">
    <Link className="back" to="/field">← CASES / ALL PROJECTS</Link>
    <div className="case-project-top">
      <div className="case-project-heading">
        <span className="eyebrow">CASE {c.id} / {provisional ? 'PROVISIONAL FORMAL READING' : 'FORMAL RESEARCH'}</span>
        <h1>{caseTitle(c)}</h1>
        <p className="case-project-artist">{caseMetadata(c)}</p>
        <p className="case-project-summary">{c.summary}</p>
        <span className="eyebrow">BASED ON PROJECT NARRATIVE / VISUAL SCHEMATIC</span>
      </div>
      <CaseMedia id={c.id} large />
    </div>
    <div className="case-formal-index">
      <div><small>DOMINANT STRATEGY</small><strong>{s.dominant}</strong></div>
      <div><small>VARIATION / COMPOSITION</small><strong>{s.variation}</strong></div>
      <div><small>RESEARCH STATE</small><strong>{provisional ? 'HYPOTHESIS / TO BE VERIFIED' : c.status === 'BUILT' ? 'FORM + FABRICATION' : c.status === 'USED' ? 'USED / RETROSPECTIVE EXTRACTION' : 'RETROSPECTIVE READING'}</strong></div>
    </div>

    <div className="case-analysis case-analysis-research">
      {CHAPTERS.map((title, i) => <article key={title} className="case-scene case-scene-research">
        <div className="case-scene-text">
          <span className="eyebrow">0{i+1} / {title.toUpperCase()}</span>
          <h2>{i === 0 ? 'What was the spatial intention?' : i === 1 ? 'What organized the form?' : i === 2 ? 'What happened in reality?' : 'What can be reused?'}</h2>
          <p>{paragraphs[i]}</p>
          {i === 2 && <details className="case-constraints">
            <summary>Design conditions / Base rules <span>+</span></summary>
            <p>{r.condition}</p>
            <p>Physical constraints are documented here as part of realization; the Engine remains a separate formal exploration environment.</p>
            {c.id === '08' && <Link className="blue" to="/tools">Supporting MAKE utility / flatten + label ↗</Link>}
          </details>}
          {i === 3 && <p className="case-caution">{provisional ? 'This is a candidate logic, not an algorithm known to have been used in the original project.' : 'Engine geometry is a new schematic abstraction, not a reconstruction of the original CAD files.'}</p>}
          {i === 3 && <Link className="btn" to={caseLogicPath(c)}>Explore formal strategy in Engine <span>↗</span></Link>}
        </div>
        <div className="case-scene-visual">
          {i === 0 && <div className="case-concept-index"><span className="eyebrow">THE BRIEF IS NOT THE FORM</span><span className="case-concept-large">{c.song ?? c.workingTitle ?? c.name}</span><span>Intent / spatial requirements / directing context</span></div>}
          {i === 1 && <div className="case-choice-visual">
            <span className="eyebrow">GOVERNING RELATIONSHIP / RETROSPECTIVE READING</span>
            <div className="case-choice-node"><small>BASE STRATEGY</small><b>{s.dominant}</b></div>
            <div className="case-choice-plus">+</div>
            <div className="case-choice-node"><small>VARIATION</small><b>{s.variation}</b></div>
            <div className="case-choice-caption">Identified through the specific project; further combinatorial behavior belongs in Engine.</div>
          </div>}
          {i === 2 && <div className="case-built-placeholder">
            <span className="eyebrow">SOURCE IMAGE / PENDING</span>
            <div className="case-photo-corners" aria-hidden="true"/>
            <strong>Built photograph<br/>or production drawing</strong>
            <span>Not substituted by a rendered simulation.</span>
          </div>}
          {i === 3 && <div className="case-extraction-preview">
            <CaseDiagram id={c.id} large />
            <span>CASE {c.id} → {c.engine.toUpperCase()} ENGINE <span>↗</span></span>
          </div>}
        </div>
      </article>)}
    </div>
    <p className="field-note">Case diagrams are new analytical illustrations based on project descriptions, not photographs or original stage geometry. The source brief and built documentation should be attached as distinct records. Alternative strategies generated later by Engine must not be presented as historical production choices.</p>
    <div className="study-footer"><Link to="/field">← All cases</Link><Link to={caseLogicPath(c)}>Explore in Engine ↗</Link></div>
  </section>;
}
