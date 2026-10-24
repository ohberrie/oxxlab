// OXX design tokens for inline styles, canvas and SVG.
// Keep in sync with src/styles/theme.css (Tailwind utilities) and the --os-* variables in src/styles/os.css.
export const oxx = {
  ink: '#141414',
  paper: '#ffffff',
  void: '#0a0a0a',
  accent: '#FF1E00',
  mono: "'JetBrains Mono', monospace",
  body: "'DM Sans', sans-serif",
} as const;

// OXX OS: white paper, near-black ink, one blue for live geometry and actions.
export const os = {
  ink: '#1c1c1c',
  muted: '#8a8a8a',
  line: '#e4e4e4',
  blue: '#294bdc',
  mark: '#d8d8d8',
} as const;
