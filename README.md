# oxxlab.com — OXX OS

A form engine: formal decisions extracted from built work, returned as engines for new design.
Vite + React + react-router + Tailwind v4, deployed on Vercel.

```sh
npm i
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # -> dist/
```

## Pages

Layout, copy and navigation follow the OXX OS v2 prototype; only the landing differs.

| Route | Page |
|-------|------|
| `/` | Glyph landing (canvas O/X field); slabs lead to Engine, Field, Tools and the "How OXX thinks" dialog |
| `/engine/:principle` | Form finding: profile, count, rotation, depth; bypass operations; connect principles |
| `/engine/:principle/compose` | Same engine with the brief → three strategies test ground (local rules, no AI) |
| `/field` (`?type=`, `?view=atlas`) | Field cases as a grid or atlas table (02–06 are placeholders) |
| `/field/:id` | One case, read through the seven steps |
| `/tools` | Make utilities; "Adjust the array" opens the rib/flat-parts dialog |

"How OXX thinks", "Prototype notes" and "Logic status" are dialogs. Unknown paths redirect to `/`.
Old Lab / Projects / Framework URLs redirect permanently (see `vercel.json`).

## Structure

- `src/app/routes.ts` — routes. Home is in the main bundle; the other pages are lazy chunks.
- `src/app/os/` — the engine: `data.ts` (principles, cases, seven steps), `geometry.ts` (line models + projection), `Viewer.tsx` (canvas), `Shell.tsx` (header, footer, dialogs, engine state).
- `src/app/pages/` — one file per page. `GlyphHero.tsx` (landing) + `components/GlyphField.tsx` (its canvas).
- `src/styles/os.css` — OXX OS styles (in the `components` layer, so Tailwind utilities still win).
- `public/` — served as-is (`brand/oxx-light.svg` + `brand/oxx-dark.svg` logos, `og-image.png`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `CNAME`).

Light/dark theme follows the device (`prefers-color-scheme`); the dark values are the `@media` block at the top of `os.css`. The glyph hero is dark in both.

To fill in a case, edit `CASES` / `caseSteps` in `src/app/os/data.ts` (drop `placeholder`, add it to `public/sitemap.xml`).

## Design tokens

| Token | Value | Where |
|-------|-------|-------|
| paper | `#ffffff` | `--os-paper`, `bg-paper` |
| ink | `#1c1c1c` | `--os-ink`, `os.ink` |
| blue | `#294bdc` | `--os-blue`, `os.blue`, `bg-blue` — live geometry and actions |
| line | `#e4e4e4` | `--os-line`, `os.line` |
| void | `#0a0a0a` | `bg-void` — glyph hero only |
| accent | `#FF1E00` | glyph hero trail only |

CSS variables live in `src/styles/os.css`, canvas/SVG values in `src/app/tokens.ts`, Tailwind tokens in `src/styles/theme.css`.
