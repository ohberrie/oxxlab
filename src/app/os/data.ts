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
// Cases 01 and 02 remain in the archive, but are intentionally excluded from
// extracted formal-strategy mapping: they were early stage-design work.
export const CASES: Case[] = [
  { id: '01', name: 'MONSTA X', song: 'N THE FRONT / 10th Anniversary', engine: 'layering', type: 'Form finding', status: 'CANDIDATE', summary: 'Early stage work. Formal mapping deliberately held.', verified: false, placeholder: true, held: true },
  { id: '02', name: 'BABYMONSTER', song: 'WE GO UP', engine: 'layering', type: 'Form finding', status: 'CANDIDATE', summary: 'Early stage work. Formal mapping deliberately held.', verified: false, placeholder: true, held: true },
  { id: '03', name: 'ALD1', song: 'Freak Alarm', engine: 'enclosure', type: 'Form finding', status: 'CANDIDATE', summary: 'Fragmented room + enclosure. Displaced rectangular panels and object fields.', verified: false },
  { id: '04', name: 'IVE', song: 'BLACKHOLE', engine: 'perspective', type: 'Form finding', status: 'CANDIDATE', summary: 'Layered depth + directional convergence; selective plane subdivision.', verified: false },
  { id: '05', name: 'ALL(H)OURS', workingTitle: 'Enclosure / Exhibition', identityNote: 'Song title remains unconfirmed.', engine: 'enclosure', type: 'Form finding', status: 'CANDIDATE', summary: 'Low ceiling, gridded confinement and a minimally rotated rectangular spatial boundary.', verified: false },
  { id: '06', name: 'KickFlip', workingTitle: 'Basketball / Love', identityNote: 'Working stage descriptor; song title remains unconfirmed.', engine: 'line', type: 'Form finding', status: 'CANDIDATE', summary: 'Line continuity and curved connections across separate performance-set zones.', verified: false },
  { id: '07', name: 'Park Jihoon', workingTitle: 'Time Loop / Clock', identityNote: 'Song title remains unconfirmed.', engine: 'layering', type: 'Form finding', status: 'EXTRACTED', summary: 'Concentric repeated arches with radial and axial variation.', verified: false },
  { id: '08', name: 'Taeyong', workingTitle: 'Bone / Snake', identityNote: 'Song title remains unconfirmed.', engine: 'line', type: 'Fabrication', status: 'BUILT', summary: 'Curvature-guided adaptive spine rib array; separate monumental portal in the built stage.', verified: true },
  { id: '09', name: 'izna', song: 'Metronome', engine: 'layering', type: 'Form finding', status: 'USED', summary: 'Sequential triangular frames + progressive scale, rotation and depth.', verified: true },
  { id: '10', name: 'Yeonjun', workingTitle: 'Layered / Fold', identityNote: 'Song title remains unconfirmed.', engine: 'enclosure', type: 'Form finding', status: 'EXTRACTED', summary: 'Enclosure + layered rectangular frames across multiple planes; intended floor–wall folding.', verified: false },
  { id: '11', name: 'MEOVV', song: 'GO HARD', engine: 'enclosure', type: 'Form finding', status: 'CANDIDATE', summary: 'Fractured cuboid enclosure and damaged club interior; fragmentation is an emerging formal reading.', verified: false },
  { id: '12', name: 'MODYSSEY', workingTitle: 'Suspended Frame / Enclosure', identityNote: 'Project title and full production records pending.', engine: 'perspective', type: 'Form finding', status: 'CANDIDATE', summary: 'Suspended thick rectangular masses framing an open center; perspective/width reading provisional.', verified: false },
];
export const HELD_CASES = ['01', '02'];
// Editorial titles lead with the project itself, not a generic engine preset.
const CASE_PRESENTATION: Record<string, { keyword: string; artist: string }> = {
  '01': { keyword: 'N THE FRONT', artist: 'MONSTA X · 10th Anniversary · mapping held' },
  '02': { keyword: 'WE GO UP', artist: 'BABYMONSTER · mapping held' },
  '03': { keyword: 'Freak Alarm', artist: 'ALD1' },
  '04': { keyword: 'BLACKHOLE', artist: 'IVE' },
  '05': { keyword: 'Enclosure / Exhibition', artist: 'ALL(H)OURS · title pending' },
  '06': { keyword: 'Basketball / Love', artist: 'KickFlip · title pending' },
  '07': { keyword: 'Time Loop / Clock', artist: 'Park Jihoon · title pending' },
  '08': { keyword: 'Bone / Snake', artist: 'Taeyong · title pending' },
  '09': { keyword: 'Metronome', artist: 'izna' },
  '10': { keyword: 'Layered / Fold', artist: 'Yeonjun · title pending' },
  '11': { keyword: 'GO HARD', artist: 'MEOVV' },
  '12': { keyword: 'Suspended Frame', artist: 'MODYSSEY · project title pending' },
};
export const caseTitle = (c: Case) => CASE_PRESENTATION[c.id].keyword;
export const caseMetadata = (c: Case) => CASE_PRESENTATION[c.id].artist;

export const CASE_STRATEGY: Record<string, { dominant: string; variation: string }> = {
  '01': { dominant: 'MAPPING HELD', variation: 'EARLY PRACTICE' },
  '02': { dominant: 'MAPPING HELD', variation: 'EARLY PRACTICE' },
  '03': { dominant: 'SPATIAL ENCLOSURE', variation: 'SURFACE DIVISION + DISPLACEMENT' },
  '04': { dominant: 'DEPTH / CONVERGENCE', variation: 'LAYERED PLANES + DIVISION' },
  '05': { dominant: 'SPATIAL ENCLOSURE', variation: 'COMPRESSION + GRID' },
  '06': { dominant: 'LINE / CONTINUITY', variation: 'CURVED LINKS + ZONING' },
  '07': { dominant: 'SEQUENTIAL LAYERING', variation: 'RADIAL / AXIS VARIATION' },
  '08': { dominant: 'PATH-GUIDED ARRAY', variation: 'CURVATURE + ADAPTIVE RIBS' },
  '09': { dominant: 'SEQUENTIAL LAYERING', variation: 'ROTATION + SCALE PROGRESSION' },
  '10': { dominant: 'SPATIAL ENCLOSURE', variation: 'MULTI-PLANE LAYERING + FOLD' },
  '11': { dominant: 'DISRUPTED ENCLOSURE', variation: 'FRACTURE + COLLAPSE / STUDY' },
  '12': { dominant: 'SUSPENDED ENCLOSURE', variation: 'THICKNESS / WIDTH / STUDY' },
};

// Historical observations and current OXX reconstruction are deliberately
// separated; none of these captions invent an original procedural algorithm.
export const CASE_READING: Record<string, { intent: string; choice: string; realization: string; extraction: string; condition: string }> = {
  '03': {
    intent: 'An uncanny, fragmented escape-room environment: ordinary objects and rectangular surfaces are displaced from their expected positions.',
    choice: 'A cubical room containing irregular subdivisions, protruding panels and displaced object fields. The proposed randomized placement system was not implemented at the time.',
    realization: 'The original directing references favored a densely populated monochrome room. Exact built geometry, object placements and fabrication records still require documentation.',
    extraction: 'Reconstruct an enclosure whose surfaces are subdivided and displaced; classify the randomized placement as retrospective rather than used-at-production.',
    condition: 'The enclosed room, door-related direction and the framing needs of performers constrain where dense components can sit.',
  },
  '04': {
    intent: 'BLACKHOLE: create a strong sensation of depth in a broadcast stage.',
    choice: 'Receding LED/truss planes and framed thresholds were composed to establish axial depth, with localized division as a secondary reading.',
    realization: 'Production revisions simplified the composition toward LED surfaces, reducing the initially intended layered depth.',
    extraction: 'Test convergence and layered-planar thresholds, then ask when added LED surfaces flatten rather than intensify the perceived depth.',
    condition: 'The camera image, lighting, available LED surfaces and the director’s revisions significantly affect the perceived depth.',
  },
  '05': {
    intent: 'A constricted, auction/exhibition-like room with a low-ceiling sense of enclosure.',
    choice: 'A mostly orthogonal cube-space vocabulary: overhead grids, vertical bars and display elements communicate confinement without dramatic rotation.',
    realization: 'Budget and camera feedback affected scenic density; removed elements were partially reintroduced to fill tighter shots.',
    extraction: 'Enclosure + ceiling compression + grid can be tested as the dominant spatial relationship; display elements are supporting details.',
    condition: 'Camera close-ups, budget reductions and the density of side zones altered what could be removed.',
  },
  '06': {
    intent: 'A playful basketball/love-themed stage containing multiple recognizable performance zones.',
    choice: 'Curved arch and lighting lines connect otherwise disjoint scenic zones, creating a legible continuous gesture.',
    realization: 'An earlier stacked-hoop computational concept was rejected. The built black-and-pink set followed a more literal, detailed brief with line-based connections.',
    extraction: 'Study how a governing trajectory can connect zones and remain legible amid additional literal props.',
    condition: 'Director-defined zones, available space and many scene-specific props made the hierarchy difficult to maintain.',
  },
  '07': {
    intent: 'Time loop and clock imagery, articulated through a repeating spatial sequence.',
    choice: 'Concentric/repeated arches and radial-axis variation create a temporal rhythm translated into physical depth.',
    realization: 'A procedural radial/flow-like floor proposal was not selected. Some overhead curved structures visible in event images belong to the existing stage infrastructure, not this design.',
    extraction: 'Compare concentric arch spacing, radial distribution and changing axis relationships without attributing host-stage structures to the designer.',
    condition: 'Existing venue/stage infrastructure and the director’s revisions must be separated from the custom scenic geometry.',
  },
  '08': {
    intent: 'Snake/bone imagery translated into a suspended vertebral sequence.',
    choice: 'Adaptive rib modules follow a curved path, changing orientation and local geometry. A monumental rear portal is a separate visual system.',
    realization: 'Grasshopper-driven rib variation and flattening supported fabrication. The built stage emphasized the portal more strongly; floor vertebrae were a later direction.',
    extraction: 'Curvature-guided array and geometry-to-flat-part identification become reusable studies and MAKE utilities.',
    condition: 'Suspension, module construction, drawing preparation, installation and client decisions affected final hierarchy.',
  },
  '09': {
    intent: 'Metronome, rhythm and repetition in a system/electrical-heavy stage with minimal literal scenery.',
    choice: 'Repeated triangular frames progressively change scale and rotation through depth, creating a strong center convergence.',
    realization: 'The built stage retained the dominant triangular frame sequence and system-lighting rhythm. Rigging and alignment were important production constraints.',
    extraction: 'Sequential Layering + progressive scale/rotation/depth. Explore the same relationship with different profiles in Engine.',
    condition: 'Camera framing and the practical precision of rigging several large frames shaped the realized depth sequence.',
  },
  '10': {
    intent: 'A minimal, layered rectilinear spatial environment.',
    choice: 'An enclosed set of planes is organized by sequential layering across floor and elevation, with an intended positive/negative folding relation.',
    realization: 'The more oblique folded proposal was simplified in the built version. The original floor/frame correspondence was not fully realized.',
    extraction: 'Compose Spatial Enclosure + Sequential Layering + Fold; test whether one planar grammar can continue across different axes.',
    condition: 'Budget, approval speed and requested scenic density constrained the final angle, depth and detail.',
  },
  '11': {
    intent: 'A damaged or collapsing club environment.',
    choice: 'Read the stage through a fractured cubical enclosure: broken walls, discontinuous building edges and exposed systems.',
    realization: 'The shared built-view reference depicts shattered concrete-like walls and stage structures. A specific procedural fragmentation system has not been documented.',
    extraction: 'Provisional study: subdivide, displace and break an enclosing volume. Do not label this reconstruction as an algorithm used at production.',
    condition: 'Physical fragmentation, support structure and theatrical staging are practical concerns; original detailed fabrication notes are pending.',
  },
  '12': {
    intent: 'A visually enclosed stage organized around large suspended rectangular masses.',
    choice: 'Thick rectilinear overhead frames and a central opening establish mass, direction and compressed spatial volume. Convergence is still a hypothesis.',
    realization: 'A shared image documents the large suspended form. Exact source brief, mounting details and what was changed during realization are still pending.',
    extraction: 'Provisional study: compare thickness, frame spacing and aperture ratio; verify whether Perspective Convergence is really dominant.',
    condition: 'Rigging geometry, safe overhead clearance and module thickness need documentation before being treated as actual constraints.',
  },
};
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
