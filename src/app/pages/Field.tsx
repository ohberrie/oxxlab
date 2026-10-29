import { Link, useSearchParams } from 'react-router';
import { CASES, HELD_CASES, UNNUMBERED_READINGS, caseKind, type CaseType } from '../os/data';
import { Viewer } from '../os/Viewer';

const FILTERS: ('All' | CaseType)[] = ['All', 'Form finding', 'Fabrication'];
const THUMB = { count: 9, rotation: 35, depth: 150, profile: 'triangle' } as const;

export function FieldPage() {
  const [search] = useSearchParams();
  const type = FILTERS.find(f => f === search.get('type')) ?? 'All';
  const atlas = search.get('view') === 'atlas';
  const cases = CASES.filter(c => type === 'All' || c.type === type || (type === 'Fabrication' && c.id === '08'));
  const href = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(search);
    for (const [k, v] of Object.entries(patch)) if (v === null) next.delete(k); else next.set(k, v);
    const qs = next.toString();
    return qs ? `?${qs}` : '/field';
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Cases / evidence</span><h1>Where the rules<br />come from.</h1></div>
        <p>Real stage practice, read through formal decisions. Each case connects Intent → Formal Choice → Realization / Built → Extraction.</p>
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
            <thead><tr><th>CASE / PROJECT</th><th>FORMAL READING</th><th>EVIDENCE</th><th>EXTRACTION</th></tr></thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}>
                  <td><Link to={`/field/${c.id}`}>{c.id} / {c.name} ↗</Link></td>
                  <td>{c.placeholder ? 'Unassigned' : c.summary}</td>
                  <td>{c.placeholder ? 'Source index pending' : 'Narrative / schematic'}</td>
                  <td>{c.placeholder ? 'Pending' : <Link to={`/engine/${c.engine}${c.id === '09' || c.id === '10' ? `?preset=${c.id}` : ''}`}>OPEN STUDY ↗</Link>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="field-grid">
          {cases.map(c => (
            <Link key={c.id} className="field-card" to={`/field/${c.id}`}>
              {c.placeholder ? <div className="pending-card mono">{c.id} / SOURCE INDEX PENDING</div> : <Viewer kind={caseKind(c)} interactive={false} params={THUMB} angle={{ yaw: -0.5, pitch: 0.15 }} />}
              <div className="card-info">
                <div>
                  <span className="mono">Case {c.id} / {c.type}{c.placeholder && ' / Placeholder'}</span>
                  <h2>{c.name}</h2>
                  <span className="mono">{c.verified ? 'Narrative-based study' : 'Provisional reading'}</span>
                </div>
                <span>↗</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="mapping-notes"><span className="eyebrow">Emerging vocabulary / numbering unconfirmed</span>{UNNUMBERED_READINGS.map(([artist, reading]) => <p key={artist}><b>{artist}</b> / {reading}</p>)}<p>Held outside the corpus: {HELD_CASES.map(id => <Link key={id} to={`/field/${id}`}>Case {id} ↗ </Link>)}</p></div>
      <p className="field-note">03–12 form the research corpus. 11–12 analysis remains pending. Unconfirmed numbered identities remain unassigned.<br />All geometry is schematic; original photographs and project records are still needed.</p>
    </section>
  );
}
