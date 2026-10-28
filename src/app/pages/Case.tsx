import { Link, Navigate, useParams } from 'react-router';
import { ENGINES, caseKind, caseLogicPath, caseSteps, getCase, type Case, type Kind } from '../os/data';
import { Tag } from '../os/Shell';
import { Viewer } from '../os/Viewer';

export function CasePage() {
  const c = getCase(useParams().id);
  if (!c) {
    return (
      <section className="page">
        <h1>Case not found.</h1>
        <p style={{ marginTop: 20 }}><Link className="blue" to="/field">Return to Field ↗</Link></p>
      </section>
    );
  }
  if (c.id === '09' || c.id === '10') return <Navigate to={`/cases/${c.id}`} replace />;
  const kind = caseKind(c);
  const logic = caseLogicPath(c);
  const spine = c.engine === 'spine';

  return (
    <section className="page">
      <Link className="back" to="/field">← FIELD</Link>
      <div className="case-header">
        <div>
          <span className="eyebrow">Field {c.id} / {c.type}</span>
          <h1>{c.name}</h1>
          <p>{c.summary}</p>
        </div>
        <div className="metadata">
          ARTIST — / SONG {c.song ?? '—'}<br />
          DATE — / ROLE &amp; COLLABORATOR CREDITS —<br />
          {c.verified ? 'RECONSTRUCTED FROM SUPPLIED NARRATIVE' : 'PROVISIONAL ANALYSIS / SOURCE RECORDS NEEDED'}
        </div>
      </div>
      <div className="case-visual">
        <div className="evidence-slot">
          <span className="placeholder-shape" aria-hidden="true" />
          <div><strong>Built work belongs here.</strong>PHOTOGRAPH / DRAWING SLOT<br />Original project assets have not been supplied.</div>
        </div>
        <Viewer kind={kind} dock caption="GOVERNING PRINCIPLE" subtitle="Schematic reconstruction" />
      </div>
      <div className="case-jump">
        <span>Built work → Formal principle → Reusable logic</span>
        <Link className="blue" to={logic}>{spine ? 'Open fabrication tool' : 'Open extracted engine'} ↗</Link>
      </div>

      <div className="case-analysis">
        {caseSteps(c).map(([title, conclusion, detail], i) => (
          <details key={title} className="step" open={i === 1}>
            <summary>
              <span className="step-number">0{i + 1}</span>
              <span className="step-title">{title}</span>
              <span className="step-conclusion">{conclusion}</span>
              <span className="plus">+</span>
            </summary>
            <div className="step-body">
              <p>{detail}</p>
              <StepVisual c={c} step={i} kind={kind} />
            </div>
          </details>
        ))}
      </div>

      <div className="extraction-link">
        <div>
          <span className="mono">{spine ? 'Make / production logic' : 'Form / reusable principle'}</span>
          <h2>{spine ? 'Adaptive array → Flatten + Label' : ENGINES[c.engine as keyof typeof ENGINES].name}</h2>
          <span style={{ fontSize: 12 }}>Return this decision to the next design.</span>
        </div>
        <Link className="btn" to={logic}>Test the logic <span>↗</span></Link>
      </div>
    </section>
  );
}

function StepVisual({ c, step, kind }: { c: Case; step: number; kind: Kind }) {
  const chips = (items: string[]) => <div className="chips">{items.map(x => <span key={x}>{x}</span>)}</div>;
  switch (step) {
    case 0: return chips(['Director intent', 'Performer zone', 'Camera', 'Production time']);
    case 1: return (
      <div className="node-strip">
        <span className="node">Intent</span><span className="connector">→</span>
        <span className="node active">{c.engine === 'spine' ? 'Adaptive continuity' : 'Spatial relationship'}</span><span className="connector">→</span>
        <span className="node">Formal strategy</span>
      </div>
    );
    case 2:
    case 4: {
      const names = step === 2 ? ['Aligned', 'Progressive · illustrated choice', 'Displaced'] : ['Low intensity', 'Balanced · illustrated choice', 'High intensity'];
      return (
        <>
          <span className="mono">{step === 2 ? 'Reconstructed design space' : 'Illustrative judgment comparison'}</span>
          <div className="options">
            {names.map((name, n) => (
              <div key={name} className={`option ${n === 1 ? 'selected' : ''}`}>
                <Viewer kind={kind} interactive={false} params={{ count: 8, rotation: n * 33 + 8, depth: n * 75 + 35, profile: 'triangle' }} />
                <div>{name}</div>
              </div>
            ))}
          </div>
        </>
      );
    }
    case 3: {
      const labels = c.engine === 'spine' ? ['Continuous path', 'Adaptive rib sequence', 'Individual component'] : ENGINES[c.engine].scale;
      return (
        <div className="scale-diagram">
          {labels.map((l, n) => (
            <div key={l}>
              <Viewer kind={kind} interactive={false} params={{ count: [12, 5, 2][n], rotation: 35, depth: [180, 80, 10][n], profile: 'triangle' }} />
              <p>{l}</p>
            </div>
          ))}
        </div>
      );
    }
    case 5: return chips(['Intended form', 'Production translation', 'Built result', 'Divergence record']);
    case 6: return (
      <div className="chips">
        {c.placeholder
          ? <span className="mono">Candidate / source check needed</span>
          : <Tag status={c.engine === 'spine' ? 'BUILT' : 'EXTRACTED'} title={c.note ?? 'Provisional extraction'} />}
        {c.id === '09' && <Tag status="USED" title="Source design-stage logic described in the narrative" />}
        <Link className="text-button blue" to={caseLogicPath(c)}>Open logic ↗</Link>
      </div>
    );
    default: return null;
  }
}
