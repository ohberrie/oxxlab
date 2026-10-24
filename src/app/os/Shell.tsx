import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router';
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

type DialogId = 'status' | 'notes';
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
    <p style={{ marginTop: 14 }}>09’s design logic and 08’s production workflow are described in the supplied narrative. Simulator implementations are new reconstructions.</p>
  </>
);
const NOTES_BODY = (
  <>
    <p>OXX OS is an interaction prototype for OXX’s research direction. Geometry is schematic; original stage photographs and project files have not been supplied yet.</p>
    <p>Field 09 and 08 follow the supplied narrative. Other cases are provisional readings. Artist, date and collaboration credits remain unfilled. No fake built photographs are used.</p>
    <p>Engine studies are newly written implementations. Strategy exploration and reference extraction are simulated with local rules. No prompts, briefs or files leave this browser.</p>
    <p>Form studies can be saved as JSON. Fabrication samples can be downloaded as SVG and JavaScript. They are not manufacturing-ready outputs.</p>
  </>
);

export function Shell() {
  const { pathname } = useLocation();
  const home = pathname === '/';
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
        <header className={`os-header ${home ? 'over' : ''}`}>
          <Link className="brand" to="/" aria-label="OXX OS home">OXX<span>OS</span></Link>
          <nav className="os-nav" aria-label="Main navigation">
            <NavLink to="/engine">Engine</NavLink>
            <NavLink to="/field">Field</NavLink>
            <NavLink to="/method">Method</NavLink>
          </nav>
          <div className="header-end">
            <Link className="text-button" to="/tools">Tools <span>↗</span></Link>
          </div>
        </header>
        <main className="os-main"><Outlet /></main>
        <footer className="os-footer">
          <Link to="/">OXX OS / An evolving form engine</Link>
          <Link className="text-button" to="/method">How OXX thinks <span>↗</span></Link>
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
      <ScrollRestoration />
    </Ctx.Provider>
  );
}
