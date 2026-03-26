// ─── LAB DATA & CONSTANTS ───────────────────────────────────────

export const STEPS = [
  { id: "base", label: "Base Rules", num: "01" },
  { id: "intent", label: "Intent Vector", num: "02" },
  { id: "constraint", label: "Constraint Compiler", num: "03" },
  { id: "strategy", label: "Form Strategy", num: "04" },
  { id: "implementation", label: "Implementation", num: "05" },
  { id: "evaluation", label: "Evaluation", num: "06" },
];

export const DOMAINS = ["Stage", "Exhibition", "Object", "Architecture", "Interface"];
export const WORLD_AXES = ["Space", "Time", "Medium"];
export const VISIBILITY = ["Human-emphasis", "System-emphasis"];
export const ACTORS = ["Primary", "Secondary", "Dual"];
export const CONSTRAINT_TYPES = ["Hard", "Soft"];

export const EMOTIONAL_TONES = [
  "Tension", "Stillness", "Gravity", "Fluidity", "Disruption",
  "Intimacy", "Monumentality", "Fragility", "Precision", "Rawness",
];
export const IDENTITY_POSITIONS = [
  "Authoritative", "Invitational", "Confrontational", "Contemplative", "Institutional", "Personal",
];
export const NARRATIVE_FUNCTIONS = [
  "Reveal", "Conceal", "Transform", "Anchor", "Fragment", "Amplify",
];

export const SPATIAL_GRAMMAR: Record<string, string[]> = {
  centrality: ["Centered", "Decentered", "Distributed", "Peripheral"],
  hierarchy: ["Single-dominant", "Layered", "Flat", "Nested"],
  symmetry: ["Bilateral", "Radial", "Asymmetric", "Broken"],
  continuity: ["Continuous", "Segmented", "Fractured", "Looping"],
};
export const FORM_GEN: Record<string, string[]> = {
  repetition: ["Uniform", "Gradient", "Stochastic", "Singular"],
  curvature: ["Linear", "Organic", "Parametric", "Angular"],
  scale: ["Monumental", "Human", "Intimate", "Variable"],
};
export const MATERIAL: Record<string, string[]> = {
  materiality: ["Transparent", "Opaque", "Translucent", "Mixed"],
  light: ["Ambient", "Directional", "Projected", "Emissive"],
  media: ["Physical", "Digital", "Hybrid", "Reactive"],
};

export const EVAL_METRICS = [
  "Visual Saliency", "Perceived Density", "Hierarchical Clarity",
  "Attention Flow", "Arousal Level",
];

export const COMPARE_METRICS = [
  { key: "meaningFit", label: "Intended Meaning Fit" },
  { key: "perceptualDensity", label: "Perceptual Density Tendency" },
  { key: "fabrication", label: "Fabrication Complexity" },
  { key: "stageSuit", label: "Stage Suitability" },
  { key: "cameraSuit", label: "Camera Suitability" },
];

export const GLOSSARY: Record<string, string> = {
  "Base Rules": "The world-level premises that every downstream decision inherits from — domain, constraints, actors, visibility emphasis.",
  "Intent Vector": "A structured meaning input composed of emotional tone, identity positioning, and narrative function. Not a mood board.",
  "Constraint Compiler": "The stage where base rules and intent compress the available strategy space — some paths open, others close.",
  "Form Strategy": "Structural translation of meaning into spatial grammar, form generation logic, and material/light/media choices.",
  "Implementation": "Where strategy meets reality — complexity, fabrication, camera, and cost constraints shape the final form.",
  "Evaluation": "Perceptual metrics that test whether the perceived outcome aligns with the intended meaning vector.",
  "Emotional Tone": "The affective register of the design — what the viewer should feel, not what the designer prefers.",
  "Identity Positioning": "How the design positions itself relative to its audience — authoritative, invitational, confrontational, etc.",
  "Narrative Function": "The structural role the design plays in the viewer's experience — reveal, conceal, transform, anchor, fragment, amplify.",
  "Spatial Grammar": "The organizational logic of space — centrality, hierarchy, symmetry, continuity.",
  "Visual Saliency": "How strongly elements attract initial visual attention within the perceptual field.",
  "Perceived Density": "The subjective sense of information/form density — not actual count, but felt complexity.",
  "Hierarchical Clarity": "How clearly the viewer can distinguish primary, secondary, and tertiary elements.",
  "Attention Flow": "The sequential path that attention follows through the design — directed vs. scattered.",
  "Arousal Level": "The degree of physiological/psychological activation the design produces — calm to intense.",
  "Mismatch": "A gap between intended meaning and perceived outcome. Not a failure — a data point for iteration.",
};

export const EXAMPLE_PRESETS = {
  base: { label: "Load Stage Example", data: { domain: "Stage" as string | null, world: ["Space", "Time"], visibility: "Human-emphasis" as string | null, actor: "Primary" as string | null, constraints: ["Hard"] } },
  intent: { label: "Load Exhibition Example", data: { tones: ["Tension", "Monumentality"], positions: ["Authoritative"], narratives: ["Reveal"] } },
};

export interface CaseData {
  id: number;
  title: string;
  domain: string;
  year: number;
  intents: string[];
  strategies: string[];
  desc: string;
  scores: number[];
  intentScores: number[];
  snapshot: Record<string, string>;
  baseRules: { domain: string; world: string[]; visibility: string; actor: string; constraints: string[] };
  strategyDetail: Record<string, string>;
  observation: Record<string, string>;
}

export const CASES: CaseData[] = [
  {
    id: 1, title: "Folded Horizon", domain: "Stage", year: 2025,
    intents: ["Tension", "Monumentality"], strategies: ["Asymmetric", "Parametric"],
    desc: "A stage installation exploring gravitational perception through folded aluminum surfaces and directional lighting.",
    scores: [0.85, 0.7, 0.9, 0.6, 0.75], intentScores: [0.9, 0.65, 0.85, 0.7, 0.8],
    snapshot: { role: "Lead designer", timeline: "3 months", collaborators: "Studio KAI, lighting — J.Park" },
    baseRules: { domain: "Stage", world: ["Space", "Time"], visibility: "Human-emphasis", actor: "Primary", constraints: ["Hard"] },
    strategyDetail: { spatial: "Asymmetric + Layered", form: "Parametric curvature, gradient repetition", material: "Opaque aluminum, directional light, physical" },
    observation: {
      worked: "Front-camera saliency was extremely strong. The folded planes created a clear hierarchical depth that read well from 30m+.",
      failed: "Side-angle perception collapsed — the layered depth flattened when viewed from wings. Audience at lateral seats lost the intended hierarchy.",
      mismatch: "Intended attention flow was center→periphery, but perceived flow was top→bottom due to lighting angle overpowering spatial grammar.",
      nextIteration: "Test with dual-directional light to maintain hierarchy from multiple viewing angles. Consider breaking bilateral assumption for side-seat legibility.",
    },
  },
  {
    id: 2, title: "Negative Register", domain: "Exhibition", year: 2024,
    intents: ["Stillness", "Precision"], strategies: ["Centered", "Linear"],
    desc: "A spatial exhibition where absence defines the perceptual hierarchy — objects removed to reveal structural logic.",
    scores: [0.6, 0.4, 0.95, 0.85, 0.5], intentScores: [0.65, 0.45, 0.9, 0.8, 0.55],
    snapshot: { role: "Spatial designer", timeline: "6 weeks", collaborators: "Curator — M.Lee" },
    baseRules: { domain: "Exhibition", world: ["Space"], visibility: "Human-emphasis", actor: "Dual", constraints: ["Soft"] },
    strategyDetail: { spatial: "Centered + Single-dominant", form: "Linear, singular, human scale", material: "Transparent + ambient light, physical" },
    observation: {
      worked: "Hierarchical clarity was near-perfect. Visitors naturally understood the removal logic and read absence as intentional structure.",
      failed: "Arousal level was too low — several visitors described the space as 'empty' rather than 'precise'. Stillness read as absence of content.",
      mismatch: "Intended: stillness as active quality. Perceived: stillness as vacancy. Precision intent landed, but emotional tone undershot.",
      nextIteration: "Introduce one high-contrast element to anchor arousal without breaking overall stillness. Sound or light pulse could work.",
    },
  },
  {
    id: 3, title: "Woven Protocol", domain: "Object", year: 2025,
    intents: ["Fluidity", "Fragility"], strategies: ["Distributed", "Organic"],
    desc: "Computationally woven textile objects negotiating between structural integrity and perceptual softness.",
    scores: [0.75, 0.85, 0.55, 0.9, 0.7], intentScores: [0.7, 0.8, 0.6, 0.85, 0.75],
    snapshot: { role: "Computational designer", timeline: "4 months", collaborators: "Fabrication — TextileLab" },
    baseRules: { domain: "Object", world: ["Space", "Medium"], visibility: "Human-emphasis", actor: "Primary", constraints: ["Soft"] },
    strategyDetail: { spatial: "Distributed + Radial", form: "Organic curvature, stochastic repetition, intimate scale", material: "Translucent, ambient light, hybrid" },
    observation: {
      worked: "Attention flow was excellent — woven structure guided touch-based exploration naturally. Fluidity intent was clearly perceived.",
      failed: "Hierarchical clarity suffered. With distributed stochastic logic, there was no clear primary element. Visitors couldn't identify a 'center'.",
      mismatch: "Fragility intent partially missed — textile read as 'soft' but not 'fragile'. Material choice (high-tenacity fiber) undermined perceptual fragility.",
      nextIteration: "Test with thinner gauge fiber or deliberate breakage points to restore fragility perception. Or reframe intent as 'softness' rather than 'fragility'.",
    },
  },
];

// Related projects mapping for cases
export const CASE_RELATED_PROJECTS: Record<number, { label: string; path: string }[]> = {
  1: [
    { label: "Shaper — Configure", path: "/projects/shaper/configure" },
    { label: "MAMA Opening VCR", path: "#" },
  ],
  2: [
    { label: "Shaper — Logic", path: "/projects/shaper/logic" },
    { label: "AIAA", path: "#" },
  ],
  3: [
    { label: "Shaper", path: "/projects/shaper" },
    { label: "Intuition Encoder", path: "#" },
  ],
};

export interface BaseRules {
  domain: string | null;
  world: string[];
  visibility: string | null;
  actor: string | null;
  constraints: string[];
}

export interface Intents {
  tones: string[];
  positions: string[];
  narratives: string[];
}

export interface StrategySelections {
  spatial: Record<string, string>;
  form: Record<string, string>;
  material: Record<string, string>;
}

export interface ImplSettings {
  complexity: string;
  fabrication: boolean;
  camera: boolean;
  costSensitivity: string;
}

export interface SavedStrategy {
  id: number;
  label: string;
  color: string;
  spatial: Record<string, string>;
  form: Record<string, string>;
  material: Record<string, string>;
  scores: number[];
  compareScores: Record<string, number>;
}
