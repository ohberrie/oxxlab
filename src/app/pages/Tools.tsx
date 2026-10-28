import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { flatSvg, saveFile, SAMPLE_SOURCE } from '../os/geometry';
import { useOs } from '../os/Shell';
import { Viewer } from '../os/Viewer';

const RIBS = { count: 15, rotation: 45, depth: 150, profile: 'triangle' } as const;
const THUMB = { ...RIBS, count: 8 };

function useDownloads() {
  const { toast } = useOs();
  return {
    parts: (curvature = 45) => { saveFile('oxx-flat-rib-study.svg', flatSvg(15, curvature), 'image/svg+xml'); toast('Labelled rib study saved as SVG'); },
    source: () => { saveFile('oxx-adaptive-ribs-sample.js', SAMPLE_SOURCE, 'text/javascript'); toast('Schematic sample source saved'); },
  };
}

interface ArchiveItem {
  id: string;
  title: string;
  type: string;
  kind: 'spine' | 'flatten';
  summary: string;
  input: string;
  output: string;
  format: string;
}

// The Make archive: each utility is catalogued like a library record, linked to its source case.
const ITEMS: ArchiveItem[] = [
  { id: 'T-01', title: 'Adaptive Spine Array', type: 'Make / engine', kind: 'spine', summary: 'Sample a path, orient each rib, and adapt its local scale.', input: 'Curved path + rib rule', output: 'Oriented, identifiable ribs', format: 'Interactive' },
  { id: 'T-02', title: 'Flatten + Label', type: 'Make / fabrication utility', kind: 'flatten', summary: 'Retain part identity while moving from spatial ribs to a flat drawing.', input: 'Rib profiles + part IDs', output: 'Labelled SVG study + sample source', format: 'SVG · JS' },
];

export function ToolsPage() {
  const download = useDownloads();
  const { showDialog } = useOs();
  const [search] = useSearchParams();
  const index = search.get('view') === 'index';
  const actions = (item: ArchiveItem) => item.kind === 'spine' ? (
    <>
      <button className="archive-action primary" onClick={() => showDialog('Adaptive ribs → flat parts', <SpineDemo />)}>Adjust the array ↗</button>
    </>
  ) : (
    <>
      <button className="archive-action primary" onClick={() => download.parts()} title="Sample drawing">SVG drawing ↓</button>
      <button className="archive-action" onClick={download.source} title="Sample source">JS source ↓</button>
    </>
  );

  return (
    <section className="page archive">
      <Link className="back" to="/engine">← ENGINE</Link>
      <div className="page-heading">
        <div><span className="eyebrow">Tools / make / archive</span><h1>From form<br />to parts.</h1></div>
        <p>Utilities translate spatial intent into fabrication information. Their origin remains connected to the field.</p>
      </div>

      <div className="archive-toolbar">
        <span className="mono">{ITEMS.length} records · origin Field 08 · sorted by ID</span>
        <div className="segmented">
          <Link to="/tools" replace className={index ? '' : 'active'}>CARDS</Link>
          <Link to="?view=index" replace className={index ? 'active' : ''}>INDEX</Link>
        </div>
      </div>

      {index ? (
        <div className="atlas">
          <table className="archive-index">
            <thead><tr><th>NO.</th><th>TITLE</th><th>TYPE</th><th>INPUT → OUTPUT</th><th>FORMAT</th><th>ORIGIN</th><th /></tr></thead>
            <tbody>
              {ITEMS.map(item => (
                <tr key={item.id}>
                  <td className="archive-no">{item.id}</td>
                  <td>{item.title}</td>
                  <td className="mono">{item.type}</td>
                  <td>{item.input} → {item.output}</td>
                  <td className="mono">{item.format}</td>
                  <td><Link to="/field/08">Field 08 ↗</Link></td>
                  <td><div className="archive-actions">{actions(item)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="archive-grid">
          {ITEMS.map(item => (
            <article key={item.id} className="archive-card">
              <header>
                <span className="archive-no">{item.id}</span>
                <span className="archive-type">{item.type}</span>
              </header>
              <div className="archive-thumb">
                <Viewer kind={item.kind} interactive={false} params={THUMB} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <dl>
                <dt>In</dt><dd>{item.input}</dd>
                <dt>Out</dt><dd>{item.output}</dd>
                <dt>Format</dt><dd>{item.format}</dd>
                <dt>Origin</dt><dd><Link to="/field/08">Field 08 ↗</Link></dd>
              </dl>
              <div className="archive-actions">{actions(item)}</div>
            </article>
          ))}
        </div>
      )}

      <div className="archive-entry">
        <div><span className="eyebrow">PRESERVED UTILITY / PANEL FLATTEN</span><p>The original panel and box flattening simulation remains available.</p></div>
        <a href="/utilities/make.html">Open original utility ↗</a>
      </div>
      <p className="field-note">
        Production workflow described in the supplied Stage 08 narrative. These are newly written schematic demos, not original fabrication files.<br />
        No joint design, material thickness, tolerance, toolpath or assembly validation. Downloaded files are study assets.
      </p>
    </section>
  );
}

// Rendered inside the shared dialog, so it keeps its own curvature state.
function SpineDemo() {
  const download = useDownloads();
  const [curve, setCurve] = useState(45);
  const params = { ...RIBS, rotation: curve };
  return (
    <div className="archive">
      <p>Adjust the same part set in space and in a flat layout.</p>
      <div className="two-tool-view">
        <Viewer kind="spine" params={params} className="tool-live" dock subtitle="Drag to orbit." />
        <Viewer kind="flatten" interactive={false} params={params} className="tool-flat" />
      </div>
      <label style={{ fontSize: 12 }}>Curvature <output>{curve}</output>
        <input type="range" min={0} max={100} value={curve} onChange={e => setCurve(+e.target.value)} aria-label="Spine curvature" />
      </label>
      <p style={{ marginTop: 14 }}>Matching IDs preserve correspondence. Schematic sample only.</p>
      <button className="btn small" onClick={() => download.parts(curve)}>Save current flat study ↓</button>
    </div>
  );
}
