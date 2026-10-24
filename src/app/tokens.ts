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

// OXX OS light-theme colors for exported files (SVG downloads). On-screen canvases
// read the themed --os-* variables from os.css instead, so they follow dark mode.
export const os = {
  ink: '#1c1c1c',
  muted: '#8a8a8a',
  blue: '#294bdc',
} as const;
