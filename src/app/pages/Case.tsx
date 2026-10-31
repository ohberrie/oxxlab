import { Link, useParams } from 'react-router';
import { CASE_READING, CASE_STRATEGY, caseTitle, caseMetadata, getCase } from '../os/data';
import { CaseMedia } from '../os/CaseMedia';
import { CaseFormation } from '../os/CaseFormation';
import { CaseMiniEngine } from '../os/CaseMiniEngine';

export function CasePage() {
  const { id } = useParams();
  const c = getCase(id);
  if (!c) return <section className="page"><Link to="/field" className="back">← Cases</Link><h1>Case not found.</h1></section>;
  if (c.held) return <section className="page case-held-detail">
    <Link to="/field?archive=1" className="back">← Cases</Link>
    <p className="eyebrow">CASE {c.id} / EARLY PRACTICE</p>
    <h1>{caseTitle(c)}</h1>
    <p>{caseMetadata(c)}</p>
    <p className="held-simple">Formal mapping is on hold for this project.</p>
  </section>;

  const reading = CASE_READING[c.id];
  const formal = CASE_STRATEGY[c.id];
  const provisional = c.id === '11' || c.id === '12';
  return <article className="page case-detail-min">
    <Link to="/field" className="back">← Cases</Link>
    <header className="case-detail-heading">
      <div>
        <span className="eyebrow">CASE {c.id}{provisional ? ' / STUDY' : ''}</span>
        <h1>{caseTitle(c)}</h1>
        <p className="case-detail-credit">{caseMetadata(c)}</p>
      </div>
      <p className="case-detail-intent">{reading.intent}</p>
    </header>

    <div className="case-overview">
      <div className="case-overview-media"><CaseMedia id={c.id} large /></div>
      <div className="case-overview-logic">
        <span className="eyebrow">FORMAL CHOICE</span>
        <strong>{formal.dominant}</strong>
        <span className="case-overview-plus">+</span>
        <strong className="case-overview-sub">{formal.variation}</strong>
        <p>{reading.choice}</p>
      </div>
    </div>

    <CaseMiniEngine key={c.id} project={c} />

    <section className="case-process-min">
      <div className="case-section-heading">
        <span className="eyebrow">FORM / PROCESS</span>
        <h2>From principle to form.</h2>
        <p>A visual decomposition of the selected formal reading.</p>
      </div>
      <CaseFormation id={c.id} dominant={formal.dominant} variation={formal.variation} />
    </section>

    <div className="case-record-min">
      <details>
        <summary><span>Built / Realization</span><span className="case-details-icon">+</span></summary>
        <p>{reading.realization}</p>
        <p>{reading.condition}</p>
        {c.id === '08' && <Link to="/tools" className="case-details-link">MAKE / Flatten + Label ↗</Link>}
      </details>
      <details>
        <summary><span>Extraction / Research notes</span><span className="case-details-icon">+</span></summary>
        <p>{reading.extraction}</p>
        <p>{provisional ? 'Provisional interpretation. Original geometry and design decisions have not been verified.' : 'Interactive geometry is a reconstructed research model, not the original stage CAD or a record of all historical alternatives.'}</p>
      </details>
    </div>
    <div className="case-detail-footer">
      <Link to="/field">← All Cases</Link>
      <Link to={'/engine/'+(c.engine==='spine'?'line':c.engine)}>Explore in Engine ↗</Link>
    </div>
  </article>;
}
