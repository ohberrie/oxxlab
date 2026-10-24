import { useState } from 'react';
import { Link } from 'react-router';
import { flatSvg, saveFile, SAMPLE_SOURCE } from '../os/geometry';
import { useOs } from '../os/Shell';
import { Viewer } from '../os/Viewer';

const RIBS = { count: 15, rotation: 45, depth: 150, profile: 'triangle' } as const;

function useDownloads() {
  const { toast } = useOs();
  return {
    parts: (curvature = 45) => { saveFile('oxx-flat-rib-study.svg', flatSvg(15, curvature), 'image/svg+xml'); toast('Labelled rib study saved as SVG'); },
    source: () => { saveFile('oxx-adaptive-ribs-sample.js', SAMPLE_SOURCE, 'text/javascript'); toast('Schematic sample source saved'); },
  };
}

export function ToolsPage() {
  const download = useDownloads();
  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">Tools / make</span><h1>From form<br />to parts.</h1></div>
        <p>Utilities translate spatial intent into fabrication information. Their origin remains connected to the field.</p>
      </div>
      <div className="tools-list">
        <article className="tool-item">
          <span className="eyebrow">Make / engine</span>
          <h2>Adaptive Spine Array</h2>
          <Viewer kind="spine" params={RIBS} />
          <p>Sample a path, orient each rib, and adapt its local scale.</p>
          <div className="tool-io">INPUT / CURVED PATH + RIB RULE<br />OUTPUT / ORIENTED, IDENTIFIABLE RIBS</div>
          <div className="actions">
            <Link className="btn small" to="/tools/spine">Adjust the array ↗</Link>
            <Link className="btn small secondary" to="/field/08">Field 08 ↗</Link>
          </div>
        </article>
        <article className="tool-item">
          <span className="eyebrow">Make / fabrication utility</span>
          <h2>Flatten + Label</h2>
          <Viewer kind="flatten" interactive={false} params={RIBS} />
          <p>Retain part identity while moving from spatial ribs to a flat drawing.</p>
          <div className="tool-io">INPUT / RIB PROFILES + PART IDS<br />OUTPUT / LABELLED SVG STUDY + SAMPLE SOURCE</div>
          <div className="actions">
            <button className="btn small" onClick={() => download.parts()}>Sample drawing ↓</button>
            <button className="btn small secondary" onClick={download.source}>Sample source ↓</button>
          </div>
        </article>
      </div>
      <p className="field-note">
        Production workflow described in the supplied Stage 08 narrative. These are newly written schematic demos, not original fabrication files.<br />
        No joint design, material thickness, tolerance, toolpath or assembly validation. Downloaded files are study assets.
      </p>
    </section>
  );
}

export function SpinePage() {
  const download = useDownloads();
  const [curve, setCurve] = useState(45);
  const params = { ...RIBS, rotation: curve };
  return (
    <section className="page">
      <Link className="back" to="/tools">← TOOLS</Link>
      <div className="page-heading">
        <div><span className="eyebrow">Make / adaptive array</span><h1>Ribs → flat parts.</h1></div>
        <p>Adjust the same part set in space and in a flat layout. Matching IDs preserve correspondence between each rib and its drawing.</p>
      </div>
      <div className="two-tool-view">
        <Viewer kind="spine" params={params} dock caption="FIELD 08 / ADAPTIVE ARRAY" subtitle="Drag to orbit." />
        <Viewer kind="flatten" interactive={false} params={params} />
      </div>
      <div className="tool-controls">
        <label>Curvature <output>{curve}</output>
          <input type="range" min={0} max={100} value={curve} onChange={e => setCurve(+e.target.value)} aria-label="Spine curvature" />
        </label>
        <button className="btn small" onClick={() => download.parts(curve)}>Save current flat study ↓</button>
        <button className="btn small secondary" onClick={download.source}>Sample source ↓</button>
      </div>
      <p className="field-note">Schematic sample only. Not a fabrication-ready model.</p>
    </section>
  );
}
