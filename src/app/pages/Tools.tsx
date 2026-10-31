import { useState } from 'react';
import { Link } from 'react-router';
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
const ITEMS = [
  { id: '01', title: 'Adaptive Spine Array', kind: 'spine' as const, summary: 'Distribute ribs along a continuous curve.', input: 'Curve + rib geometry', output: 'Oriented ribs' },
  { id: '02', title: 'Flatten + Label', kind: 'flatten' as const, summary: 'Move spatial components into an identifiable flat study.', input: 'Ribs + part IDs', output: 'Labelled SVG' },
];

export function ToolsPage() {
  const download=useDownloads();
  const {showDialog}=useOs();
  return <section className="page archive make-min">
    <Link className="back" to="/engine">← Engine</Link>
    <header className="make-min-heading"><h1>MAKE.</h1><p>From form to parts.</p></header>
    <div className="archive-grid">
      {ITEMS.map(item=><article className="archive-card" key={item.id}>
        <div className="archive-thumb"><Viewer kind={item.kind} interactive={false} params={THUMB} /></div>
        <div className="make-item-head"><span>{item.id}</span><h2>{item.title}</h2></div>
        <p>{item.summary}</p>
        <div className="archive-actions">
          {item.kind==='spine'?<button className="archive-action primary" onClick={()=>showDialog('Adaptive ribs / flat parts',<SpineDemo />)}>Explore ↗</button>:<>
            <button className="archive-action primary" onClick={()=>download.parts()}>SVG ↓</button>
            <button className="archive-action" onClick={download.source}>Source ↓</button>
          </>}
        </div>
        <details className="make-item-notes">
          <summary>About this utility</summary>
          <p>{item.input} → {item.output}</p>
          <p>Linked to <Link to="/field/08">Case 08 / Taeyong ↗</Link>. Reconstructed research utility, not source fabrication documentation.</p>
        </details>
      </article>)}
    </div>
    <details className="make-source-notes"><summary>Limitations</summary>
      <p>Schematic studies only. No tested materials, joints, tolerances, toolpaths or assembly validation. Downloads are not manufacturing-ready.</p>
    </details>
  </section>;
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
