// OXX OS content: formal principles (engines), field cases and the seven-step case reading.

export type Kind = 'converge' | 'cross' | 'radial' | 'offset' | 'spine' | 'flatten';
export type Profile = 'triangle' | 'circle' | 'square';
export type Status = 'USED' | 'BUILT' | 'EXTRACTED' | 'PROPOSED' | 'CANDIDATE';
export type EngineId = 'convergence' | 'crossing' | 'radial' | 'offset';

export interface Params { count: number; rotation: number; depth: number; profile: Profile }
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
  convergence: { name: 'Progressive Convergence', kind: 'converge', source: '09', status: 'EXTRACTED', description: 'A repeated profile contracts and rotates through depth, drawing attention toward a shared focus.', nodes: ['Repeat', 'Scale', 'Rotate', 'Depth'], labels: ['Rotation', 'Depth'], scale: ['Spatial direction', 'Frame sequence', 'Profile transformation'] },
  crossing: { name: 'Hierarchical Crossing', kind: 'cross', source: '01', status: 'EXTRACTED', description: 'Crossing fields establish a dominant direction. Change their density and angle to shift the hierarchy.', nodes: ['Distribute', 'Cross', 'Weight'], labels: ['Crossing angle', 'Separation'], scale: ['Crossing fields', 'Distributed intersections', 'Line-crossing motif'] },
  radial: { name: 'Radial Propagation', kind: 'radial', source: '07', status: 'EXTRACTED', description: 'A local gesture propagates around a center. Coverage and density shift the balance between gesture and field.', nodes: ['Repeat', 'Radiate', 'Sweep'], labels: ['Sweep', 'Radius'], scale: ['Radial field', 'Repeated arcs', 'Local turn'] },
  offset: { name: 'Offset Frames', kind: 'offset', source: '10', status: 'EXTRACTED', description: 'A repeated frame departs from alignment. Displacement creates a directional rhythm across the field.', nodes: ['Repeat', 'Offset', 'Layer'], labels: ['Displacement', 'Depth'], scale: ['Displaced field', 'Frame relationships', 'Offset edge'] },
};
export const ENGINE_IDS = Object.keys(ENGINES) as EngineId[];
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
  verified: boolean;
}

// Only cases with a readable analysis are published. The 02–06 corpus slots stay out until source material exists.
export const CASES: Case[] = [
  { id: '09', name: 'Progressive Convergence', engine: 'convergence', type: 'Form finding', status: 'USED', note: 'Design-stage logic described in the supplied narrative.', summary: 'Translate repetition into a directional spatial sequence.', song: 'Metronome · supplied narrative', verified: true },
  { id: '08', name: 'Adaptive Spine', engine: 'spine', type: 'Fabrication', status: 'BUILT', note: 'Production workflow described in the supplied narrative.', summary: 'Translate a continuous curve into adaptive, identifiable ribs.', verified: true },
  { id: '01', name: 'Hierarchical Crossing', engine: 'crossing', type: 'Form finding', status: 'EXTRACTED', summary: 'Make a hierarchy from crossing fields.', verified: false },
  { id: '07', name: 'Radial Propagation', engine: 'radial', type: 'Form finding', status: 'EXTRACTED', summary: 'Carry one gesture through a radial field.', verified: false },
  { id: '10', name: 'Offset Frames', engine: 'offset', type: 'Form finding', status: 'EXTRACTED', summary: 'Establish tension through progressive displacement.', verified: false },
];
export const getCase = (id: string | undefined) => CASES.find(c => c.id === id);
export const caseKind = (c: Case): Kind => (c.engine === 'spine' ? 'spine' : ENGINES[c.engine].kind);
export const caseLogicPath = (c: Case) => (c.engine === 'spine' ? '/tools/spine' : `/engine/${c.engine}`);

// The seven steps every case is read through, from the brief to the reusable rule.
export const STEPS = [
  { id: 'given', title: 'Given', phase: 'Problem', question: 'What conditions defined the problem?', body: 'Industry rules, director intent, production conditions and the designer’s own intent. Nothing formal yet — only the constraints and the people.' },
  { id: 'move', title: 'Move', phase: 'Problem', question: 'Which spatial move made it actionable?', body: 'The one relationship that turns a brief into something that can be drawn: a sequence, a crossing, a center, a displacement.' },
  { id: 'design-space', title: 'Design Space', phase: 'Form', question: 'What else could the move have become?', body: 'Operators and their combinations generate alternatives. Reconstructed alternatives are labelled as such; they are not claimed as historical options.' },
  { id: 'formal-system', title: 'Formal System', phase: 'Form', question: 'How does the rule act across scales?', body: 'The same relationship followed from the whole space, through the relation between parts, down to a single profile.' },
  { id: 'judgment', title: 'Judgment', phase: 'Form', question: 'Why this configuration and not another?', body: 'The criteria that selected one possibility: legibility, silhouette, directional force, depth, camera. Judgment stays human.' },
  { id: 'realization', title: 'Realization', phase: 'Return', question: 'What changed when it met structure and time?', body: 'Built photographs, drawings and the divergence between intended and realized form, with the reasons for it.' },
  { id: 'extraction', title: 'Extraction', phase: 'Return', question: 'What can the next design reuse?', body: 'The behavior is kept and the particulars are dropped. The result is an engine or a tool, linked back to this case.' },
] as const;

export type StepRow = [title: string, conclusion: string, detail: string];

export function caseSteps(c: Case): StepRow[] {
  if (c.id === '09') return [
    ['GIVEN', 'Repetition and movement, within a working stage.', 'The supplied narrative describes a metronome-related intent. Camera composition, performer circulation and production conditions define the problem. Exact dimensions and project records still need verification.'],
    ['MOVE', 'Translate temporal repetition into spatial depth.', 'The formal move is a sequence of nested, rotating frames: repetition becomes a directional space around performance.'],
    ['DESIGN SPACE', 'Choose progressive frames rather than isolated objects.', 'These alternatives reconstruct possible strategies. They do not claim that every alternative was considered during the original design.'],
    ['FORMAL SYSTEM', 'The same directional rule acts across the sequence.', 'At the scale of the stage, the sequence establishes focus. Between frames, scale and rotation establish rhythm. At the profile, the triangular boundary gives that rhythm a silhouette.'],
    ['JUDGMENT', 'Tune the force of convergence without losing legibility.', 'Depth, rotation and the size of the opening shape the camera image. The comparative studies below illustrate that judgment; they are not recovered original variants.'],
    ['REALIZATION', 'Geometry meets structure, camera and production.', 'Rigging diagrams, connection details and built photographs belong here, compared against the intended depth. No verified divergence record has been supplied yet.'],
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
    ['EXTRACTION', 'A reusable formal principle to test.', 'The associated simulator illustrates the proposed reading. Its parameters do not reproduce the original project files.'],
  ];
}

export const STATUS_DEFS: [Status, string][] = [
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
    { title: asym ? 'Directional tension' : 'Inward sequence', engine: 'convergence', additions: asym ? ['offset'] : [], params: { count, rotation: 40, depth: 190, profile }, reason: 'Progressive frames make depth legible. Check the opening against the performer zone.' },
    { title: 'Displaced rhythm', engine: 'offset', additions: ['convergence'], params: { count: count - 2, rotation: 63, depth: 145, profile }, reason: 'Offset and contraction trade symmetry for a directional rhythm. Compare front and side views.' },
    { title: open ? 'Open-center field' : 'Radial field', engine: 'radial', additions: [], params: { count: count + 3, rotation: open ? 83 : 63, depth: 190, profile }, reason: open ? 'Move the repetition to a perimeter and preserve a central void. Dimensions remain unvalidated.' : 'Distribute the focus around a center. Coverage changes the reading from a gesture to a field.' },
  ];
}
