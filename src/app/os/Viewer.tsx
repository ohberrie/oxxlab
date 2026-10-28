import { useCallback, useEffect, useRef, useState } from 'react';
import { DEFAULT_PARAMS, type EngineId, type Kind, type Params } from './data';
import { model, project, type Vec3, type Line, type Label } from './geometry';

const SPATIAL = { yaw: -0.53, pitch: 0.15 };
const clampPitch = (p: number) => Math.max(-1.3, Math.min(1.3, p));

interface ViewerProps {
  kind: Kind;
  geometry?: { lines: Line[]; labels: Label[] };
  description?: string;
  params?: Params;
  disabled?: ReadonlySet<string>;
  additions?: readonly EngineId[];
  /** Static thumbnails skip orbit controls and draw thinner lines. */
  interactive?: boolean;
  dock?: boolean;
  caption?: string;
  subtitle?: string;
  className?: string;
  angle?: { yaw: number; pitch: number };
  onAngle?: (yaw: number, pitch: number) => void;
}

// A canvas line projection: redraws only when its inputs, size or camera change.
export function Viewer({
  kind, geometry, description, params = DEFAULT_PARAMS, disabled, additions, interactive = true,
  dock, caption = 'FORM STUDY', subtitle = 'One principle. Many possibilities.', className = '', angle, onAngle,
}: ViewerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flat = kind === 'flatten';
  const cam = useRef({ yaw: flat ? 0 : angle?.yaw ?? SPATIAL.yaw, pitch: flat ? 0 : angle?.pitch ?? SPATIAL.pitch, ortho: flat });
  const target = useRef<{ yaw: number; pitch: number } | null>(null);
  const input = useRef({ kind, geometry, params, disabled, additions, interactive, onAngle });
  input.current = { kind, geometry, params, disabled, additions, interactive, onAngle };
  const frame = useRef(0);
  const [camera, setCamera] = useState<'front' | 'spatial'>('spatial');

  const draw = useCallback(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const w = wrap.clientWidth, h = wrap.clientHeight;
    if (!w || !h) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
    }
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const { kind, geometry, params, disabled, additions, interactive } = input.current;
    // Colors come from the theme variables in os.css, so the canvas follows light/dark mode.
    const css = getComputedStyle(wrap);
    const color = (name: string) => css.getPropertyValue(name).trim();
    const { yaw, pitch, ortho } = cam.current;
    const data = geometry ?? model(kind, params, disabled, additions);
    // Fit the whole 3D study, with enough breathing room for the viewer controls.
    const points = geometry?.lines.flatMap(l => l.pts);
    let center: Vec3 = [0,0,0], fit = 1;
    if (points?.length) {
      center = [0,1,2].map(k => (Math.min(...points.map(p=>p[k])) + Math.max(...points.map(p=>p[k]))) / 2) as Vec3;
      const radius = Math.max(...points.map(p => Math.hypot(p[0]-center[0],p[1]-center[1],p[2]-center[2])));
      fit = Math.min(1, 240 / Math.max(radius, 1));
    }
    const pt = (p: Vec3) => project([(p[0]-center[0])*fit,(p[1]-center[1])*fit,(p[2]-center[2])*fit], w, h, yaw, pitch, ortho);

    // Quiet registration marks keep the canvas legible without a UI grid.
    if (interactive) {
      ctx.strokeStyle = color('--os-mark');
      ctx.lineWidth = 0.6;
      for (const [x, y] of [[w * 0.5, h * 0.5], [28, 28], [w - 28, h - 28]]) {
        ctx.beginPath();
        ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
        ctx.stroke();
      }
    }
    const depth = (pts: Vec3[]) => pts.reduce((s, p) => s + p[2], 0) / pts.length;
    const lines = data.lines.map(l => ({ ...l, pts: l.pts.map(pt) })).sort((a, b) => depth(b.pts) - depth(a.pts));
    ctx.lineJoin = 'round';
    for (const l of lines) {
      ctx.beginPath();
      l.pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.strokeStyle = color(l.soft ? '--os-geo-soft' : '--os-geo');
      ctx.lineWidth = (interactive ? 1.25 : 0.95) * l.weight;
      ctx.stroke();
    }
    ctx.fillStyle = color('--os-muted');
    ctx.font = '8px ui-monospace, monospace';
    ctx.textAlign = 'center';
    for (const l of data.labels) { const p = pt(l.at); ctx.fillText(l.text, p[0], p[1]); }
  }, []);

  const tick = useCallback(() => {
    frame.current = 0;
    const t = target.current;
    if (t) {
      const c = cam.current;
      if (Math.abs(t.yaw - c.yaw) + Math.abs(t.pitch - c.pitch) < 0.002) {
        c.yaw = t.yaw; c.pitch = t.pitch; target.current = null;
      } else {
        c.yaw += (t.yaw - c.yaw) * 0.15; c.pitch += (t.pitch - c.pitch) * 0.15;
        frame.current = requestAnimationFrame(tick);
      }
      input.current.onAngle?.(c.yaw, c.pitch);
    }
    draw();
  }, [draw]);
  const schedule = useCallback(() => { if (!frame.current) frame.current = requestAnimationFrame(tick); }, [tick]);

  // Every render may carry new params; drawing is cheap enough to just schedule it.
  useEffect(() => { schedule(); });

  useEffect(() => {
    const ro = new ResizeObserver(schedule);
    ro.observe(wrapRef.current!);
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', schedule);
    return () => { ro.disconnect(); scheme.removeEventListener('change', schedule); cancelAnimationFrame(frame.current); frame.current = 0; };
  }, [schedule]);

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current!;
    let drag: { x: number; y: number; yaw: number; pitch: number } | null = null;
    const orbit = (yaw: number, pitch: number) => {
      target.current = null;
      Object.assign(cam.current, { yaw, pitch: clampPitch(pitch), ortho: false });
      setCamera('spatial');
      input.current.onAngle?.(cam.current.yaw, cam.current.pitch);
      schedule();
    };
    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, yaw: cam.current.yaw, pitch: cam.current.pitch };
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (drag) orbit(drag.yaw + (e.clientX - drag.x) * 0.007, drag.pitch + (e.clientY - drag.y) * 0.006);
    };
    const up = () => { drag = null; };
    const wheel = (e: WheelEvent) => {
      if (!e.shiftKey && Math.abs(e.deltaX) < 2) return;
      e.preventDefault();
      orbit(cam.current.yaw + (e.deltaX || e.deltaY) * 0.003, cam.current.pitch);
    };
    const key = (e: KeyboardEvent) => {
      const step = ({ ArrowLeft: [-0.1, 0], ArrowRight: [0.1, 0], ArrowUp: [0, -0.1], ArrowDown: [0, 0.1] } as Record<string, number[]>)[e.key];
      if (!step) return;
      e.preventDefault();
      orbit(cam.current.yaw + step[0], cam.current.pitch + step[1]);
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('keydown', key);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', key);
    };
  }, [interactive, schedule]);

  const setView = (mode: 'front' | 'spatial') => {
    const front = mode === 'front';
    target.current = front ? { yaw: 0, pitch: 0 } : SPATIAL;
    cam.current.ortho = front;
    setCamera(mode);
    schedule();
  };

  return (
    <div ref={wrapRef} className={`viewer ${interactive ? '' : 'static'} ${className}`}>
      <canvas
        ref={canvasRef}
        role="img"
        tabIndex={interactive ? 0 : -1}
        aria-label={description ?? (interactive ? `Interactive ${kind} geometry. Drag to orbit; use arrow keys to rotate.` : `${kind} geometry study`)}
      />
      {dock && (
        <>
          <div className="viewer-label">{caption}<b>{subtitle}</b></div>
          <div className="view-dock">
            <div className="segmented">
              <button aria-pressed={camera === 'front'} className={camera === 'front' ? 'active' : ''} onClick={() => setView('front')}>2D / FRONT</button>
              <button aria-pressed={camera === 'spatial'} className={camera === 'spatial' ? 'active' : ''} onClick={() => setView('spatial')}>3D / SPATIAL</button>
            </div>
            <span className="gesture">DRAG TO ORBIT · SHIFT + SCROLL TO TURN</span>
          </div>
        </>
      )}
    </div>
  );
}
