// OXX OS content: formal principles (engines), field cases and the seven-step case reading.

export type Kind = 'converge' | 'cross' | 'radial' | 'offset' | 'spine' | 'flatten' | 'layer' | 'perspective' | 'division' | 'enclosure';
export type Profile = 'triangle' | 'circle' | 'square';
export type Status = 'USED' | 'BUILT' | 'EXTRACTED' | 'PROPOSED' | 'CANDIDATE';
export type EngineId = 'convergence' | 'crossing' | 'radial' | 'offset' | 'layering' | 'perspective' | 'line' | 'division' | 'enclosure';

export interface Params { count: number; rotation: number; depth: number; profile: Profile; scale?: number; fold?: number; domain?: 'axis' | 'planes' }
export const DEFAULT_PARAMS: Params = { count: 10, rotation: 42, depth: 170, profile: 'triangle' };

export interface Engine {
  name: string;
  kind: Kind;
  source: string;
  status: Status;
  description: string;
  nodes: string[];
  labels: [string, string];
  scale: [string, string, string];
}

export const ENGINES: Record<EngineId, Engine> = {
  layering: { name: 'Depth A / Sequential Layering', kind: 'layer', source: '09', status: 'EXTRACTED', description: 'Repeat one profile through depth. Rotation and scale turn a sequence into spatial rhythm.', nodes: ['Repeat', 'Rotate', 'Scale', 'Depth'], labels: ['Progressive rotation', 'Layer depth'], scale: ['Spatial field', 'Layer sequence', 'Profile'] },
  perspective: { name: 'Depth B / Perspective Convergence', kind: 'perspective', source: '04', status: 'CANDIDATE', description: 'Connect planes toward a shared vanishing point. A candidate reading of IVE and MODYSSEY.', nodes: ['Repeat', 'Scale', 'Depth'], labels: ['Convergence', 'Depth'], scale: ['Focus', 'Plane', 'Edge'] },
  line: { name: 'Line / Trajectory', kind: 'spine', source: '08', status: 'EXTRACTED', description: 'Let a continuous path organize repeated elements. Curvature connects local parts to a whole.', nodes: ['Repeat', 'Curve'], labels: ['Curvature', 'Amplitude'], scale: ['Path', 'Sequence', 'Element'] },
  division: { name: 'Division / Fragmentation', kind: 'division', source: '04', status: 'CANDIDATE', description: 'Subdivide a boundary into unequal fields. An emerging strategy, also usable as a supporting operation.', nodes: ['Repeat', 'Divide'], labels: ['Division bias', 'Separation'], scale: ['Boundary', 'Field', 'Fragment'] },
  enclosure: { name: 'Cube Space / Enclosure', kind: 'enclosure', source: '10', status: 'EXTRACTED', description: 'Define a spatial boundary, layer across its planes, then fold the relationship between floor and elevation.', nodes: ['Repeat', 'Rotate', 'Depth', 'Fold'], labels: ['Axis rotation', 'Boundary depth'], scale: ['Enclosure', 'Plane', 'Boundary'] },
  convergence: { name: 'Progressive Convergence', kind: 'converge', source: '09', status: 'EXTRACTED', description: 'A repeated profile contracts and rotates through depth, drawing attention toward a shared focus.', nodes: ['Repeat', 'Scale', 'Rotate', 'Depth'], labels: ['Rotation', 'Depth'], scale: ['Spatial direction', 'Frame sequence', 'Profile transformation'] },
  crossing: { name: 'Hierarchical Crossing', kind: 'cross', source: '01', status: 'EXTRACTED', description: 'Crossing fields establish a dominant direction. Change their density and angle to shift the hierarchy.', nodes: ['Distribute', 'Cross', 'Weight'], labels: ['Crossing angle', 'Separation'], scale: ['Crossing fields', 'Distributed intersections', 'Line-crossing motif'] },
  radial: { name: 'Radial Propagation', kind: 'radial', source: '07', status: 'EXTRACTED', description: 'A local gesture propagates around a center. Coverage and density shift the balance between gesture and field.', nodes: ['Repeat', 'Radiate', 'Sweep'], labels: ['Sweep', 'Radius'], scale: ['Radial field', 'Repeated arcs', 'Local turn'] },
  offset: { name: 'Offset Frames', kind: 'offset', source: '10', status: 'EXTRACTED', description: 'A repeated frame departs from alignment. Displacement creates a directional rhythm across the field.', nodes: ['Repeat', 'Offset', 'Layer'], labels: ['Displacement', 'Depth'], scale: ['Displaced field', 'Frame relationships', 'Offset edge'] },
};
export const ENGINE_IDS = ['layering', 'perspective', 'line', 'division', 'enclosure'] as EngineId[];
export const isEngineId = (s: string | undefined): s is EngineId => !!s && s in ENGINES;

export type CaseType = 'Form finding' | 'Fabrication';
export interface Case {
  id: string;
  name: string;
  engine: EngineId | 'spine';
  type: CaseType;
  status: Status;
  summary: string;
  note?: string;
  song?: string;
  workingTitle?: string;
  identityNote?: string;
  verified: boolean;
  placeholder?: boolean;
  held?: boolean;
}

// 03–10 follow the user's supplied sequence. Working labels are not official credits.
export const CASES: Case[] = [
  ...['01','02'].map(id => ({ id, name: 'Mapping held', engine: 'layering' as const, type: 'Form finding' as const, status: 'CANDIDATE' as const, summary: 'Mapping held; intent and source identity await confirmation.', verified: false, placeholder: true, held: true })),
  { id: '03', name: 'ALD1', song: 'Freak Alarm', engine: 'enclosure', type: 'Form finding', status: 'CANDIDATE', summary: 'Cube Space / enclosure — candidate dominant strategy.', verified: false },
  { id: '04', name: 'IVE', song: 'BLACKHOLE', engine: 'perspective', type: 'Form finding', status: 'CANDIDATE', summary: 'Perspective convergence + plane variation / Division (provisional).', verified: false },
  { id: '05', name: 'Enclosure / Exhibition', workingTitle: 'ALL(H)OURS stage · enclosure / slave-auction / exhibition', identityNote: 'ALL(H)OURS is a working stage reference. Official artist credit and song title remain unconfirmed.', engine: 'enclosure', type: 'Form finding', status: 'CANDIDATE', summary: 'Closure and the exhibition relationship, read through spatial enclosure.', verified: false },
  { id: '06', name: 'KickFlip', workingTitle: 'Basketball / Love stage', identityNote: 'Basketball / Love are working descriptors; the official song title is unconfirmed.', engine: 'line', type: 'Form finding', status: 'CANDIDATE', summary: 'Line / trajectory — candidate dominant strategy.', verified: false },
  { id: '07', name: 'Time Loop / Clock', workingTitle: 'Park Jihoon stage', identityNote: 'Park Jihoon is the working stage reference. Official artist credit and song title remain unconfirmed.', engine: 'layering', type: 'Form finding', status: 'EXTRACTED', summary: 'Sequential layering + radial / axis variation.', verified: false },
  { id: '08', name: 'Bone / Snake', workingTitle: 'Taeyong stage', identityNote: 'Taeyong is the working stage reference. Official artist credit and song title remain unconfirmed.', engine: 'line', type: 'Form finding', status: 'EXTRACTED', summary: 'Bone, spine and portal; upper snake-spine rigging. Sequential layering + curvature / line dynamics.', verified: true },
  { id: '09', name: 'izna', song: 'Metronome', workingTitle: 'Progressive Convergence', engine: 'layering', type: 'Form finding', status: 'USED', summary: 'Repeated triangular frames + progressive rotation and scale.', verified: true },
  { id: '10', name: 'Layered / Fold', workingTitle: 'Yeonjun stage', identityNote: 'Yeonjun is the working stage reference. Official artist credit and song title remain unconfirmed.', engine: 'enclosure', type: 'Form finding', status: 'EXTRACTED', summary: 'Orthogonal and diagonal frames; folding between frames and the floor plane.', verified: false },
  ...['11','12'].map(id => ({ id, name: 'Analysis pending', engine: 'layering' as const, type: 'Form finding' as const, status: 'CANDIDATE' as const, summary: 'Research corpus entry; identity and formal analysis await confirmation.', verified: false, placeholder: true })),
];
export const HELD_CASES = ['01', '02'];
export const UNNUMBERED_READINGS = [
  ['MODYSSEY', 'Depth B + width / mass variation'],
  ['MEOVV', 'Cube Space / enclosure'],
];
// Editorial card titles describe intent; artist references remain secondary metadata.
const CASE_PRESENTATION: Record<string, { keyword: string; artist: string }> = {
  '01': { keyword: 'Intent pending', artist: 'Artist pending · mapping held' },
  '02': { keyword: 'Intent pending', artist: 'Artist pending · mapping held' },
  '03': { keyword: 'Freak Alarm', artist: 'ALD1 · Freak Alarm' },
  '04': { keyword: 'Blackhole', artist: 'IVE · BLACKHOLE' },
  '05': { keyword: 'Enclosure / Exhibition', artist: 'ALL(H)OURS · working reference / credits pending' },
  '06': { keyword: 'Basketball / Love', artist: 'KickFlip · song title pending' },
  '07': { keyword: 'Time Loop / Clock', artist: 'Park Jihoon · working reference / credits pending' },
  '08': { keyword: 'Bone / Snake', artist: 'Taeyong · working reference / credits pending' },
  '09': { keyword: 'Repetition / Movement', artist: 'izna · Metronome' },
  '10': { keyword: 'Layered / Fold', artist: 'Yeonjun · working reference / credits pending' },
  '11': { keyword: 'Intent pending', artist: 'Artist pending · analysis pending' },
  '12': { keyword: 'Intent pending', artist: 'Artist pending · analysis pending' },
};
export const caseTitle = (c: Case) => `${c.id} — ${CASE_PRESENTATION[c.id].keyword}`;
export const caseMetadata = (c: Case) => CASE_PRESENTATION[c.id].artist;
export const getCase = (id: string | undefined) => CASES.find(c => c.id === id);
export const caseKind = (c: Case): Kind => (c.engine === 'spine' ? 'spine' : ENGINES[c.engine].kind);
export const caseLogicPath = (c: Case) => (c.placeholder ? '/field' : c.id === '09' || c.id === '10' ? `/engine/${c.engine}?preset=${c.id}` : c.engine === 'spine' ? '/tools' : `/engine/${c.engine}`);

export type StepRow = [title: string, conclusion: string, detail: string];

export function caseSteps(c: Case): StepRow[] {
  if (c.id === '09') return [
    ['GIVEN', 'Repetition and movement, within a working stage.', 'The supplied narrative describes a metronome-related intent. Camera composition, performer circulation and production conditions define the problem. Exact dimensions and project records still need verification.'],
    ['MOVE', 'Translate temporal repetition into spatial depth.', 'The formal move is a sequence of nested, rotating frames: repetition becomes a directional space around performance.'],
    ['DESIGN SPACE', 'Choose progressive frames rather than isolated objects.', 'These alternatives reconstruct possible strategies. They do not claim that every alternative was considered during the original design.'],
    ['FORMAL SYSTEM', 'The same directional rule acts across the sequence.', 'At the scale of the stage, the sequence establishes focus. Between frames, scale and rotation establish rhythm. At the profile, the triangular boundary gives that rhythm a silhouette.'],
    ['JUDGMENT', 'Tune the force of convergence without losing legibility.', 'Depth, rotation and the size of the opening shape the camera image. The comparative studies below illustrate that judgment; they are not recovered original variants.'],
    ['REALIZATION', 'Geometry meets structure, camera and production.', 'Insert rigging diagrams, connection details and built photographs here. Compare intended depth with the realized camera image and note the reasons for divergence. No verified divergence record has been supplied.'],
    ['EXTRACTION', 'Keep the behavior. Change the profile.', 'The reconstructed engine abstracts Repeat → Scale → Rotate → Depth from the particular triangular stage. Circle and square inputs test whether the behavior remains useful.'],
  ];
  if (c.id === '08') return [
    ['GIVEN', 'A continuous spine must become buildable components.', 'The supplied narrative describes a desired curved spine and a production workflow for generating fabrication geometry. Original fabrication files are still required.'],
    ['MOVE', 'Preserve continuity through locally varying ribs.', 'One organizing path carries repeated modules. Orientation and local scale allow each rib to differ while belonging to the whole.'],
    ['DESIGN SPACE', 'Use an adaptive array to translate the curve.', 'Uniform ribs, manually adjusted ribs and an adaptive array provide a reconstructed comparison of production strategies.'],
    ['FORMAL SYSTEM', 'Path → rib sequence → individual plate.', 'The continuous curve organizes the overall form. Tangent orientation relates neighboring ribs. Individual plate geometry carries local variation.'],
    ['JUDGMENT', 'Balance continuity, spacing and part variation.', 'The schematic allows curvature, count and rib scale to be compared. It does not validate the original material, joints or dimensions.'],
    ['REALIZATION', 'Generate, flatten and identify the ribs.', 'Curve → Segment → Orient → Adapt → Generate ribs → Flatten → Label. The narrative connects this workflow to fabrication; assembled-stage and drawing evidence must be added.'],
    ['EXTRACTION', 'An adaptive array and a flattening utility.', 'The reusable tool preserves correspondence between the spatial rib and the labelled flat part. The downloadable sample is a schematic starting point.'],
  ];
  return [
    ['GIVEN', 'Recover the brief and conditions from the archive.', 'Original director intent and industrial constraints need to be supplied.'],
    ['MOVE', c.summary, 'A provisional spatial reading, pending the original project material.'],
    ['DESIGN SPACE', 'Reconstruct the decision, then identify its evidence.', 'Candidate alternatives shown here are analytical comparisons, not documented original options.'],
    ['FORMAL SYSTEM', 'Follow one relationship through different scales.', 'The diagrams illustrate a candidate principle. Confirm where this relationship actually appears in the work.'],
    ['JUDGMENT', 'Make the selection criteria explicit.', 'Compare density, silhouette, directional force and depth. Record why the selected configuration served this particular brief.'],
    ['REALIZATION', 'Connect the intended form to the built record.', 'Photographs, fabrication drawings, credits and divergence notes still need to be supplied.'],
    ['EXTRACTION', c.placeholder ? 'A candidate logic, not yet a verified extraction.' : 'A reusable formal principle to test.', 'The associated simulator illustrates the proposed reading. Its parameters do not reproduce the original project files.'],
  ];
}

export const STATUS_DEFS: [Status, string][] = [
  ['CANDIDATE', 'An emerging reading awaiting source confirmation.'],
  ['USED', 'Used in the actual design process.'],
  ['BUILT', 'Used in actual production or fabrication.'],
  ['EXTRACTED', 'Formalized retrospectively from a completed work.'],
  ['PROPOSED', 'Considered at the time, but not implemented.'],
];

export interface Proposal { title: string; engine: EngineId; additions: EngineId[]; params: Params; reason: string }

// Local keyword rules, not an AI service: a brief maps to three compatible strategies.
export function strategyPlan(brief: string, profile: Profile): Proposal[] {
  const lower = brief.toLowerCase();
  const open = /open|void|clear|performer|비우|빈|중앙|퍼포머/.test(lower);
  const asym = /asym|offset|tension|비대칭|긴장/.test(lower);
  const dense = /dense|density|밀도|촘촘/.test(lower);
  const count = dense ? 17 : 10;
  return [
    { title: asym ? 'Directional tension' : 'Inward sequence', engine: 'layering', additions: asym ? ['line'] : [], params: { count, rotation: 40, depth: 190, profile }, reason: 'Progressive frames make depth legible. Check the opening against the performer zone.' },
    { title: 'Layered enclosure', engine: 'enclosure', additions: ['layering'], params: { count: count - 2, rotation: 63, depth: 145, profile }, reason: 'A spatial boundary carries a supporting layer sequence. Compare single-axis and multiple-plane domains.' },
    { title: open ? 'Continuous edge' : 'Line rhythm', engine: 'line', additions: [], params: { count: count + 3, rotation: open ? 83 : 63, depth: 190, profile }, reason: open ? 'Use a continuous path to organize a lighter field of ribs. Check clearance manually; dimensions remain unvalidated.' : 'Curvature organizes a continuous sequence. Compare path amplitude and the rhythm between ribs.' },
  ];
}
