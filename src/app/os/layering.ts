import type { Profile } from './data';
import type { Line, Vec3 } from './geometry';

export type PresetId = '09' | '10';
export type OperationKind = 'Scale' | 'Rotation' | 'Axis' | 'Fold';
export interface Operation {
  kind: OperationKind;
  enabled: boolean;
  strength: number;
  region: 'all' | 'front' | 'back';
}
export interface LayerStudy {
  schema: 'oxx-layering/1';
  source: PresetId;
  base: { strategy: 'Sequential Layering'; profile: Profile; count: number; spacing: number };
  values: { scale: number; rotation: number; axis: number; fold: number };
  operators: Operation[];
}
export const STUDIES = {
  '09': { artist: 'izna', title: 'Rotational progression', recipe: 'Scale → Rotation', intent: 'Repetition becomes rhythm. Rhythm becomes space.', intentKo: '메트로놈의 반복과 운동성을 공간의 깊이와 리듬으로 번역한다.', choice: 'A triangular profile repeats through depth. Progressive scale and rotation keep the sequence directed toward a shared focus.', extraction: 'Separate the profile from the rule. Keep sequential depth; vary the scale and rotation gradients.', note: 'Metronome / narrative-based principle study' },
  '10': { artist: 'YEONJUN', title: 'Folded continuity', recipe: 'Fold → Axis', intent: 'Let the floor and elevation read as one continuous form.', intentKo: '바닥과 입면이 하나의 조형으로 이어지도록 면의 방향과 연결을 조직한다.', choice: 'Repeated planes cross a hinge between floor and elevation. Axis reorientation changes the relationship between successive layers.', extraction: 'Keep layering as the common structure. Treat local folding and frame-axis rotation as separate operations.', note: 'Fold / axis reorientation · working interpretation' },
} as const;
export const presetStudy = (source: PresetId): LayerStudy => ({
  schema: 'oxx-layering/1', source,
  base: { strategy: 'Sequential Layering', profile: source === '09' ? 'triangle' : 'square', count: source === '09' ? 12 : 10, spacing: source === '09' ? 19 : 24 },
  values: { scale: source === '09' ? 0.32 : 0.78, rotation: source === '09' ? 68 : 0, axis: source === '09' ? 0 : 34, fold: source === '09' ? 0 : 90 },
  operators: (source === '09' ? ['Scale', 'Rotation', 'Fold', 'Axis'] : ['Fold', 'Axis', 'Scale', 'Rotation']).map(kind => ({ kind: kind as OperationKind, enabled: source === '09' ? ['Scale','Rotation'].includes(kind) : ['Fold','Axis','Scale'].includes(kind), strength: 1, region: 'all' })),
});
const radians = (n: number) => n * Math.PI / 180;
const close = (pts: Vec3[]) => [...pts, pts[0]];
function profile(shape: Profile, r: number): Vec3[] {
  if (shape === 'square') return close([[-r,-r * .72,0],[r,-r * .72,0],[r,r * .72,0],[-r,r * .72,0]]);
  const n = shape === 'triangle' ? 3 : 64;
  return close(Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 - Math.PI / 2; return [Math.cos(a)*r, Math.sin(a)*r, 0] as Vec3; }));
}
// Split each edge at y=0 before folding, so the hinge is an actual shared edge.
function splitAtHinge(points: Vec3[]): Vec3[] {
  const out: Vec3[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i];
    if (a[1] * b[1] < 0) { const t = -a[1] / (b[1] - a[1]); out.push([a[0] + (b[0]-a[0])*t, 0, a[2] + (b[2]-a[2])*t]); }
    out.push(b);
  }
  return out;
}
export function applyOperation(points: Vec3[], op: Operation, study: LayerStudy, t: number): Vec3[] {
  if (!op.enabled || op.strength === 0 || (op.region === 'front' && t > .5) || (op.region === 'back' && t <= .5)) return points;
  const v = study.values, strength = op.strength;
  if (op.kind === 'Scale') { const s = 1 + (v.scale - 1) * t * strength; return points.map(([x,y,z]) => [x*s,y*s,z*s]); }
  const a = radians((op.kind === 'Rotation' ? v.rotation*t : op.kind === 'Axis' ? v.axis*t : v.fold) * strength), c = Math.cos(a), s = Math.sin(a);
  if (op.kind === 'Rotation') return points.map(([x,y,z]) => [x*c-y*s,x*s+y*c,z]);
  if (op.kind === 'Axis') return points.map(([x,y,z]) => [x*c+z*s,y,-x*s+z*c]);
  const split = splitAtHinge(points), hinge = split.filter(p => Math.abs(p[1]) < 1e-8);
  if (hinge.length < 2) return points;
  const origin = hinge.reduce((a,b) => a[0] < b[0] ? a : b);
  const end = hinge.reduce((a,b) => Math.hypot(...a.map((v,k)=>v-origin[k])) > Math.hypot(...b.map((v,k)=>v-origin[k])) ? a : b);
  const length = Math.hypot(...end.map((v,k)=>v-origin[k]));
  if (length < 1e-8) return points;
  const u = end.map((v,k)=>(v-origin[k])/length) as Vec3;
  // Rodrigues rotation around the actual plane/hinge intersection keeps the seam connected.
  return split.map(point => {
    if (point[1] <= 0) return point;
    const q = point.map((v,k)=>v-origin[k]) as Vec3;
    const dot = q[0]*u[0]+q[1]*u[1]+q[2]*u[2];
    const cross: Vec3 = [u[1]*q[2]-u[2]*q[1],u[2]*q[0]-u[0]*q[2],u[0]*q[1]-u[1]*q[0]];
    return q.map((v,k)=>origin[k]+v*c+cross[k]*s+u[k]*dot*(1-c)) as Vec3;
  });
}
export function layeringModel(study: LayerStudy): { lines: Line[]; labels: [] } {
  const lines: Line[] = [];
  const { count, spacing } = study.base;
  for (let i = 0; i < count; i++) {
    const t = i / Math.max(1,count-1);
    for (const inner of [false, true]) {
      let pts = profile(study.base.profile, inner ? 162 : 175);
      for (const op of study.operators) pts = applyOperation(pts,op,study,t);
      pts = pts.map(([x,y,z]) => [x,y,z+(t-.5)*(count-1)*spacing]);
      lines.push({ pts, g:i, weight:i===0?1.45: .85, soft:inner });
    }
  }
  return { lines, labels: [] };
}
export const activeRecipe = (study: LayerStudy) => study.operators.filter(o=>o.enabled && o.strength>0).map(o=>o.kind);
