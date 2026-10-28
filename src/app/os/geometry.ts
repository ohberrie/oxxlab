// Line geometry for every engine, a small perspective projection, and the fabrication samples.
import type { EngineId, Kind, Params, Profile } from './data';
import { os } from '../tokens';

export type Vec3 = [number, number, number];
export interface Line { pts: Vec3[]; g: number; weight: number; soft: boolean }
export interface Label { at: Vec3; text: string }

const sides = (shape: Profile) => (shape === 'circle' ? 64 : shape === 'square' ? 4 : 3);

export function model(kind: Kind, p: Params, disabled: ReadonlySet<string> = new Set(), additions: readonly EngineId[] = []) {
  const lines: Line[] = [];
  const labels: Label[] = [];
  const on = (n: string) => !disabled.has(n);
  const add = (pts: Vec3[], g = 0, weight = 1, soft = false) => lines.push({ pts, g, weight, soft });
  const profile = (r: number, z = 0, rot = 0): Vec3[] => {
    const n = sides(p.profile);
    return Array.from({ length: n }, (_, j) => {
      const t = (j / n) * Math.PI * 2 - Math.PI / 2 + rot;
      return [r * Math.cos(t), r * Math.sin(t), z];
    });
  };
  const closed = (pts: Vec3[]) => [...pts, pts[0]];
  let count = p.count;

  if (kind === 'converge') {
    if (!on('Repeat')) count = 1;
    let prev: Vec3[] | null = null;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1);
      const r = on('Scale') ? 175 * (1 - 0.65 * t) : 175;
      const rot = on('Rotate') ? (t * p.rotation * Math.PI) / 100 : 0;
      const z = on('Depth') ? (t - 0.5) * p.depth * 1.8 : 0;
      const pts = profile(r, z, rot);
      add(closed(pts), i, i === 0 ? 1.5 : 1);
      if (prev && p.profile !== 'circle') for (let j = 0; j < pts.length; j++) add([prev[j], pts[j]], i, 0.55, true);
      prev = pts;
    }
  } else if (kind === 'offset') {
    if (!on('Repeat')) count = 1;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1);
      const dx = on('Offset') ? (t - 0.5) * p.rotation * 2 : 0;
      const dy = on('Offset') ? (t - 0.5) * p.rotation * 0.6 : 0;
      const pts = profile(130, on('Layer') ? (t - 0.5) * p.depth * 1.3 : 0, 0.1).map(([x, y, z]): Vec3 => [x + dx, y + dy, z]);
      add(closed(pts), i);
    }
  } else if (kind === 'radial') {
    if (!on('Repeat')) count = 1;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1);
      const angle = on('Radiate') ? t * Math.PI * 2 * (on('Sweep') ? 0.2 + p.rotation / 125 : 1) : 0;
      const r = 65 + p.depth * 0.35, cx = Math.cos(angle) * r, cy = Math.sin(angle) * r;
      const pts = profile(35, Math.sin(angle * 2) * p.depth * 0.12, angle + Math.PI / 2).map(([x, y, z]): Vec3 => [x + cx, y + cy, z]);
      add(closed(pts), i);
      add([[cx * 0.6, cy * 0.6, 0], [cx * 1.25, cy * 1.25, 0]], i, 0.8, true);
    }
  } else if (kind === 'cross') {
    if (!on('Distribute')) count = 1;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1), x = (t - 0.5) * 290, z = (t - 0.5) * p.depth * 0.5;
      const main = on('Weight') && i === Math.floor(count / 2);
      add([[x, -150, z], [x, 150, z]], i, main ? 3.4 : 1);
      if (on('Cross')) {
        const a = ((15 + p.rotation * 0.8) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
        add([[x * c + 150 * s, -150 * c + x * s, z + 30], [x * c - 150 * s, 150 * c + x * s, z + 30]], i, main ? 2 : 1);
      }
    }
  } else if (kind === 'spine') {
    const path: Vec3[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const x = (t - 0.5) * 430, z = Math.sin(t * Math.PI * 2) * p.rotation * 1.2, y = Math.sin(t * Math.PI) * 15;
      const r = 25 + (40 + p.depth / 6) * Math.sin(Math.PI * t);
      const angle = Math.atan((Math.cos(t * Math.PI * 2) * p.rotation * 1.2 * Math.PI * 2) / 430);
      path.push([x, y, z]);
      const rw = 5 + r * 0.18;
      const pts = ([[-rw, -r], [rw, -r], [rw + 3, r], [-rw - 3, r]] as const).map(([u, v]): Vec3 => [x - Math.sin(angle) * u, y + v, z + Math.cos(angle) * u]);
      add(closed(pts), i, 1.2);
      labels.push({ at: [x, y + r + 14, z], text: ribId(i) });
    }
    add(path, 0, 1.1, true);
  } else if (kind === 'flatten') {
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(count - 1, 1), r = 25 + (40 + p.depth / 6) * Math.sin(t * Math.PI);
      const x = ((i % 8) - 3.5) * 52, y = (Math.floor(i / 8) - 0.5) * 145, rw = (5 + r * 0.18) * 0.65, h = r * 0.65;
      add([[x - rw, y - h, 0], [x + rw, y - h, 0], [x + rw + 1.95, y + h, 0], [x - rw - 1.95, y + h, 0], [x - rw, y - h, 0]], i);
      labels.push({ at: [x, y + h + 17, 0], text: ribId(i) });
    }
  }

  // Connected principles are spatial transforms applied in their displayed order.
  for (const principle of additions) {
    const maxGroup = Math.max(...lines.map(l => l.g), 1);
    if (principle === 'offset') {
      lines.forEach(l => { l.pts = l.pts.map(([x, y, z]) => [x + (l.g / maxGroup - 0.5) * p.rotation * 1.4, y, z]); });
    } else if (principle === 'convergence') {
      lines.forEach(l => { const t = l.g / maxGroup, f = 1 - 0.5 * t; l.pts = l.pts.map(([x, y, z]) => [x * f, y * f, z + (t - 0.5) * p.depth]); });
    } else if (principle === 'radial') {
      lines.forEach(l => {
        const angle = (l.g / maxGroup) * Math.PI * 1.4, c = Math.cos(angle), s = Math.sin(angle);
        l.pts = l.pts.map(([x, y, z]) => [x * c - y * s, y * c + x * s, z + Math.sin(angle) * p.depth * 0.22]);
      });
    } else if (principle === 'crossing') {
      lines.push(...lines.map(l => ({ ...l, pts: l.pts.map(([x, y, z]): Vec3 => [-y, x, z + 70]), soft: true })));
    }
  }
  return { lines, labels };
}

export function project([x, y, z]: Vec3, width: number, height: number, yaw: number, pitch: number, ortho = false): Vec3 {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const xx = x * c + z * s, zz = -x * s + z * c;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const yy = y * cp - zz * sp, zzz = y * sp + zz * cp;
  const persp = ortho ? 1 : 900 / (900 + zzz), scale = Math.min(width / 580, height / 500);
  return [width / 2 + xx * scale * persp, height / 2 + yy * scale * persp, zzz];
}

const ribId = (i: number) => 'R' + String(i + 1).padStart(2, '0');

export function flatSvg(count = 15, curvature = 45) {
  const paths = Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(count - 1, 1), r = 25 + 65 * Math.sin(Math.PI * t);
    const x = 50 + (i % 8) * 75, y = 100 + Math.floor(i / 8) * 180, rw = 5 + r * 0.18;
    return `<g transform="translate(${x} ${y})"><path d="M-${rw} -${r}H${rw}L${rw + 3} ${r}H-${rw + 3}Z" fill="none" stroke="${os.blue}" stroke-width="1"/><text x="-10" y="${r + 17}" fill="${os.ink}" font-family="monospace" font-size="9">${ribId(i)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 430"><title>OXX schematic rib layout</title><desc>Illustrative parts; curvature ${curvature}. Not fabrication ready. Units are unspecified.</desc><rect width="640" height="430" fill="#ffffff"/>${paths}<text x="25" y="420" font-family="monospace" font-size="9" fill="${os.muted}">OXX / SCHEMATIC STUDY / NOT FOR FABRICATION</text></svg>`;
}

export const SAMPLE_SOURCE = `// OXX / schematic adaptive rib study. Not a fabrication-ready model.
// All dimensions are illustrative. No joints, tolerances or material validation.
export function ribs(count = 15, curvature = 45) {
  return Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(1, count - 1);
    return {
      id: 'R' + String(i + 1).padStart(2, '0'),
      center: [(t - 0.5) * 430, Math.sin(t * Math.PI) * 15, Math.sin(t * Math.PI * 2) * curvature * 1.2],
      angle: Math.atan(Math.cos(t * Math.PI * 2) * curvature * 1.2 * Math.PI * 2 / 430),
      halfHeight: 25 + 65 * Math.sin(Math.PI * t),
    };
  });
}
export function flatSvg(parts = ribs()) {
  const paths = parts.map((p, i) => {
    const x = 50 + (i % 8) * 75, y = 100 + Math.floor(i / 8) * 180, h = p.halfHeight, w = 5 + h * 0.18;
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-' + w + ' -' + h + 'H' + w + 'L' + (w + 3) + ' ' + h + 'H-' + (w + 3) + 'Z" fill="none" stroke="blue"/><text x="-10" y="' + (h + 16) + '" font-size="9">' + p.id + '</text></g>';
  }).join('');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 430">' + paths + '</svg>';
}
`;

export function saveFile(name: string, data: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}
