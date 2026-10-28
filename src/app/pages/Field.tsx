import { Link, useSearchParams } from 'react-router';
import { CASES, caseKind, caseLogicPath, type CaseType } from '../os/data';
import { layeringModel, presetStudy } from '../os/layering';
import { Viewer } from '../os/Viewer';

const FILTERS: ('All' | CaseType)[] = ['All', 'Form finding', 'Fabrication'];
const THUMB = { count: 9, rotation: 35, depth: 150, profile: 'triangle' } as const;

export function FieldPage() {
  const [search] = useSearchParams();
  const type = FILTERS.find(f => f === search.get('type')) ?? 'All';
  const atlas = search.get('view') === 'atlas';
  const cases = CASES.filter(c => type === 'All' || c.type === type);
  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(search);
    for (const [k, v] of Object.entries(patch)) if (v === null) next.delete(k); else next.set(k, v);
    const qs = next.toString();
    return qs ? `?${qs}` : '/field';
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Field / evidence</span><h1>Where the rules<br />come from.</h1></div>
        <p>Real stage practice, read through formal decisions. Each case connects intent, judgment and reusable logic.</p>
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

      {atlas ? (
        <div className="atlas">
          <table>
            <thead><tr><th>CASE / FORMAL PRINCIPLE</th><th>FORM FINDING</th><th>FABRICATION</th><th>DEPTH</th><th>REPETITION</th><th>LOGIC ORIGIN</th></tr></thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/field/${c.id}`}>{c.id} / {c.name} ↗</Link></td>
                  <td>{c.type === 'Form finding' ? <span className="dot" aria-label="primary route" /> : '—'}</td>
                  <td>{c.type === 'Fabrication' ? <span className="dot" aria-label="primary route" /> : '—'}</td>
                  <td>{c.engine === 'convergence' || c.engine === 'offset' ? <span className="dot" aria-label="depth lens" /> : '—'}</td>
                  <td><span className="dot" aria-label="repetition lens" /></td>
                  <td><Link to={caseLogicPath(c)}>{c.placeholder ? 'CANDIDATE' : 'OPEN LOGIC'} ↗</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="field-grid">
          {cases.map(c => (
            <Link key={c.id} className="field-card" to={`/field/${c.id}`}>
              <Viewer geometry={c.id === '09' || c.id === '10' ? layeringModel(presetStudy(c.id)) : undefined} kind={caseKind(c)} interactive={false} params={THUMB} angle={{ yaw: -0.5, pitch: 0.15 }} />
              <div className="card-info">
                <div>
                  <span className="mono">Field {c.id} / {c.type}{c.placeholder && ' / Placeholder'}</span>
                  <h2>{c.name}</h2>
                  <span className="mono">{c.verified ? 'Narrative-based study' : 'Provisional reading'}</span>
                </div>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <p className="field-note">
        Case labels describe the dominant route into OXX, not exclusive categories. Each case can link both form and fabrication logics.<br />
        All geometry is schematic. 02–06 are corpus placeholders; other analyses require source verification. Artist/song credits remain inside cases.
      </p>
    </section>
  );
}
