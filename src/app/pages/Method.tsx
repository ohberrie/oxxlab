import { Link } from 'react-router';
import { STATUS_DEFS, STEPS } from '../os/data';

const PHASES = [
  { name: 'Problem', note: 'From conditions to one actionable move.' },
  { name: 'Form', note: 'From a move to a rule, and the judgment that selects.' },
  { name: 'Return', note: 'From built reality back to something reusable.' },
] as const;

export function MethodPage() {
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Method / how OXX thinks</span><h1>Seven steps,<br />one loop.</h1></div>
        <p>Every field case is read in the same order. The last step returns a rule to the engine, so the next design starts from what the last one learned.</p>
      </div>

      <div className="loop" aria-label="The OXX loop">
        <span>PRACTICE</span><span>→</span><span>SEVEN-STEP READING</span><span>→</span><b>EXTRACTION</b><span>→</span>
        <Link to="/engine" className="blue">ENGINE ↗</Link><span>→</span><span>NEW PRACTICE</span>
      </div>

      <div className="phases">
        {PHASES.map(ph => (
          <div key={ph.name} className="phase">
            <span className="eyebrow">{ph.name}</span>
            <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>{ph.note}</p>
            <ol>
              {STEPS.map((s, i) => s.phase === ph.name && (
                <li key={s.id}>
                  <span className="mono">0{i + 1} · {s.question}</span>
                  <b>{s.title}</b>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="prose">
        <div>
          <h3>Shaper → stage practice → OXX</h3>
          <p>Controlled formal generation came first. Stage practice brought direction, camera, material, fabrication and time into the design problem. OXX formalizes what can be learned from those decisions.</p>
        </div>
        <div>
          <h3>Two kinds of reusable knowledge</h3>
          <p><b>Form finding</b> expresses spatial relationships: convergence, crossing, propagation, displacement. <b>Make</b> translates selected form into constructible and identifiable parts.</p>
        </div>
        <div>
          <h3>Read backward, run forward</h3>
          <p>A finished work is read from Given to Extraction. A new brief runs the same steps forward: conditions and a move go in, the engine opens a design space, and judgment stays with the designer. <Link className="blue" to="/engine/convergence/compose">Try it in Compose ↗</Link></p>
        </div>
        <div>
          <h3>Evidence stays attached</h3>
          <p>Every principle links to its source case. Reconstructed alternatives are marked as such. The strategy flow uses local rules; it does not perform AI inference, structural validation or an objective assessment of design quality.</p>
        </div>
      </div>

      <div className="prose" style={{ paddingTop: 30 }}>
        <div>
          <h3>Logic status</h3>
          <p>Tags apply to particular logics, with evidence from a source case. They can coexist; they are not a maturity ladder.</p>
        </div>
        <div>{STATUS_DEFS.map(([k, v]) => <div key={k} className="tag-def"><b>{k}</b><span>{v}</span></div>)}</div>
      </div>
    </section>
  );
}
