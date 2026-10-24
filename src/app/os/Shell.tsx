import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router';
import { DEFAULT_PARAMS, STATUS_DEFS, type EngineId, type Params, type Proposal } from './data';

// Engine settings survive navigation, so a study can be checked against its field case and resumed.
export interface EngineState {
  params: Params;
  disabled: Set<string>;
  additions: EngineId[];
  brief: string;
  proposals: Proposal[];
  selected: number;
}
const INITIAL: EngineState = {
  params: DEFAULT_PARAMS,
  disabled: new Set(),
  additions: [],
  brief: 'Keep the central performer area open. Use repetition and depth to draw attention inward.',
  proposals: [],
  selected: -1,
};

type DialogId = 'status' | 'notes' | 'method';
interface OsContext {
  engine: EngineState;
  setEngine: (patch: Partial<EngineState>) => void;
  resetEngine: () => void;
  angle: MutableRefObject<{ yaw: number; pitch: number }>;
  toast: (message: string) => void;
  openDialog: (id: DialogId) => void;
  showDialog: (title: string, body: ReactNode) => void;
  closeDialog: () => void;
}
const Ctx = createContext<OsContext | null>(null);
export const useOs = () => useContext(Ctx)!;

export function Tag({ status, title }: { status: string; title?: string }) {
  const { openDialog } = useOs();
  return (
    <button className={`tag ${status === 'USED' || status === 'BUILT' ? 'used' : ''}`} title={title ?? status} onClick={() => openDialog('status')}>
      {status}
    </button>
  );
}

const STATUS_BODY = (
  <>
    <p>Tags apply to particular logics, with evidence from a source case. They can coexist; they are not a maturity ladder.</p>
    {STATUS_DEFS.map(([k, v]) => <div key={k} className="tag-def"><b>{k}</b><span>{v}</span></div>)}
    <p style={{ marginTop: 14 }}>09’s design logic and 08’s production workflow are described in the supplied narrative. Simulator implementations are new reconstructions. Unverified case slots do not establish historical status.</p>
  </>
);
const NOTES_BODY = (
  <>
    <p>This is a local interaction prototype for OXX’s research direction. Geometry is schematic; original stage photographs and project files have not been supplied.</p>
    <p>Field 09 and 08 follow the supplied narrative. Other cases are provisional; 02–06 are corpus placeholders. Artist, date and collaboration credits remain unfilled. No fake built photographs are used.</p>
    <p>Engine studies are newly written implementations. AI strategy exploration and reference extraction are explicitly simulated. No prompts, briefs or files leave this browser.</p>
    <p>Form studies can be saved as JSON. Fabrication samples can be downloaded as SVG and JavaScript. They are not manufacturing-ready outputs.</p>
  </>
);
const METHOD_BODY = (
  <>
    <span className="eyebrow">Practice → Extraction → Engine → New practice</span>
    <p>OXX extracts tacit formal decisions from real design and turns them into reusable formal and production logics. The starting point is a particular decision under particular conditions.</p>
    <p><b>Shaper → Real-world stage practice → OXX.</b><br />Controlled formal generation came first. Stage practice brought direction, camera, material, fabrication and time into the design problem. OXX formalizes what can be learned from those decisions.</p>
    <h3>From a brief to a design space</h3>
    <p>Industry rules + director intent + production conditions + designer intent define the problem. A spatial move makes it actionable. Operators and their combinations generate possibilities; human judgment selects among them.</p>
    <h3>Two kinds of reusable knowledge</h3>
    <p><b>Form finding</b> expresses spatial relationships: convergence, crossing, propagation, displacement.<br /><b>Make</b> translates selected form into constructible and identifiable parts.</p>
    <h3>Evidence stays attached</h3>
    <p>Every principle links to its source case. Seven steps trace Given, Move, Design Space, Formal System, Judgment, Realization and Extraction. Reconstructed alternatives are marked as such.</p>
    <h3>A strategy engine in development</h3>
    <p>The test ground illustrates how a brief might lead to different compatible combinations. A future AI assistant could propose, explain and organize those strategies. The current demo uses local rules and does not perform AI inference, automatic structural validation or an objective assessment of design quality.</p>
  </>
);

export function Shell() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  // Tools belong to the engine side of the site, as in the v2 prototype.
  const section = pathname.startsWith('/field') ? 'field' : pathname.startsWith('/engine') || pathname.startsWith('/tools') ? 'engine' : '';
  const [engine, setEngineState] = useState(INITIAL);
  const angle = useRef({ yaw: -0.53, pitch: 0.15 });
  const [dialog, setDialog] = useState<{ title: string; body: ReactNode } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(0);

  const setEngine = useCallback((patch: Partial<EngineState>) => setEngineState(s => ({ ...s, ...patch })), []);
  const resetEngine = useCallback(() => {
    angle.current = { yaw: -0.53, pitch: 0.15 };
    setEngineState(s => ({ ...INITIAL, brief: s.brief, proposals: s.proposals, disabled: new Set() }));
  }, []);
  const toast = useCallback((message: string) => {
    setToastMsg(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(''), 3000);
  }, []);
  const showDialog = useCallback((title: string, body: ReactNode) => setDialog({ title, body }), []);
  const openDialog = useCallback((id: DialogId) => {
    if (id === 'status') showDialog('Logic status', STATUS_BODY);
    else if (id === 'method') showDialog('How OXX thinks', METHOD_BODY);
    else showDialog('Prototype notes', NOTES_BODY);
  }, [showDialog]);
  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const el = dialogRef.current;
    if (dialog && el && !el.open) el.showModal();
  }, [dialog]);
  useEffect(() => { dialogRef.current?.close(); }, [pathname]);

  const value = useMemo(
    () => ({ engine, setEngine, resetEngine, angle, toast, openDialog, showDialog, closeDialog }),
    [engine, setEngine, resetEngine, toast, openDialog, showDialog, closeDialog],
  );

  return (
    <Ctx.Provider value={value}>
      <div className="os">
        {/* data-glyph-quiet: the hero's glyph field leaves no pointer trail under the header */}
        <header className={`os-header ${home ? 'over' : ''}`} data-glyph-quiet>
          <Link className="brand" to="/" aria-label="OXX OS home">
            {home ? (
              <img src="/brand/oxx-dark.svg" alt="OXX" width={72} height={30} />
            ) : (
              <picture>
                <source srcSet="/brand/oxx-dark.svg" media="(prefers-color-scheme: dark)" />
                <img src="/brand/oxx-light.svg" alt="OXX" width={72} height={30} />
              </picture>
            )}
            <span>OS</span>
          </Link>
          <nav className="os-nav" aria-label="Main navigation">
            <Link to="/engine" className={section === 'engine' ? 'active' : ''}>Engine</Link>
            <Link to="/field" className={section === 'field' ? 'active' : ''}>Field</Link>
          </nav>
          <div className="header-end">
            <Link className="text-button" to="/tools">Tools <span>↗</span></Link>
          </div>
        </header>
        <main className="os-main"><Outlet /></main>
        <footer className="os-footer">
          <Link to="/">OXX / An evolving design system</Link>
          <button className="text-button" onClick={() => openDialog('method')}>How OXX thinks <span>↗</span></button>
          <button className="text-button" onClick={() => openDialog('notes')}>Prototype notes <span>↗</span></button>
        </footer>
        <dialog ref={dialogRef} className="os-dialog" aria-labelledby="dialog-title" onClose={() => setDialog(null)}>
          {dialog && (
            <>
              <div className="dialog-head">
                <h2 id="dialog-title">{dialog.title}</h2>
                <button onClick={closeDialog} aria-label="Close dialog">×</button>
              </div>
              <div className="dialog-content">{dialog.body}</div>
            </>
          )}
        </dialog>
        <div className={`toast ${toastMsg ? 'show' : ''}`} role="status">{toastMsg}</div>
      </div>
      {/* Keyed by path: every fresh page load shares the key 'default', which would carry scroll across pages. */}
      <ScrollRestoration getKey={loc => loc.pathname} />
    </Ctx.Provider>
  );
}
