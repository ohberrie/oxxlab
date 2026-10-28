# oxxlab.com

OXX — Algorithmic Design lab. Vite + React + Tailwind v4, deployed on Vercel.

```sh
npm i
npm run dev        # local dev server
npm run typecheck  # tsc --noEmit
npm run build      # -> dist/
```

## Structure

- `src/app/routes.ts` — all routes. Home is in the main bundle; other pages are lazy-loaded chunks.
- `src/app/components/` — pages and shared components (`NavBar`, `ScaledSlide`, `LabShared`, `CrossLinks`).
- `src/assets/img/` — images bundled by Vite (import them, don't hotlink).
- `public/` — files served as-is at the site root (`og-image.png`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `CNAME`).

## Design tokens

Defined twice and kept in sync:

| Token  | Value     | Tailwind (`src/styles/theme.css`) | Inline/SVG (`src/app/tokens.ts`) |
|--------|-----------|-----------------------------------|----------------------------------|
| ink    | `#141414` | `text-ink`, `bg-ink`, `border-ink/10` | `oxx.ink`    |
| paper  | `#f8f8fd` | `bg-paper`                        | `oxx.paper`  |
| void   | `#0a0a0a` | `bg-void`                         | `oxx.void`   |
| accent | `#FF1E00` | `text-accent`, `bg-accent`        | `oxx.accent` |
| studio | `#FF4D00` | `bg-studio`                       | `oxx.studio` |
| mist   | `#e8e8ed` | `bg-mist`                         | `oxx.mist`   |
| mono   | JetBrains Mono | `font-mono`                  | `oxx.mono`   |
| body   | DM Sans   | `font-body`                       | `oxx.body`   |

Fonts are loaded once from Google Fonts in `index.html` (variable weights).
When adding a page, add it to `public/sitemap.xml` too.

## OXX OS v0.2 — Sequential Layering prototype

The root route now provides ENGINE; `/cases?preset=09` and `?preset=10` link the izna and YEONJUN principle studies to the same engine. `/legacy` retains the prior landing; every previous route and dataset remains in place.

- `src/app/engine/model.ts`: shared 3D ribbon geometry, sequential layer placement, ordered Scale/Rotation/Axis/Fold operations with per-operation weight and front/back/all scope.
- The SVG viewport projects actual 3D points orthographically; orbit supports pointer drag and left/right keys. 2D is a front projection, not fabrication output.
- JSON export records the dominant strategy, ordered operators, weights, regions and values. It is not CAD export.
- `/utilities/make.html`: existing panel-flatten simulation copied without code changes from `ohberrie/oxx_os` main at `9ba339ca821ab44c51318bc6d1198d54d95e3caa`. The source repository and all original functionality remain untouched. This utility is a demo; it has no upload/export pipeline.
- izna and YEONJUN presets illustrate the principles supplied in the project brief. They are not measured reconstructions. Actual stage photography, fabrication dimensions and verified project captions were not available in this checkout; Built explicitly states this gap.
- Validation: `npm run typecheck`, `node tests/engine.test.mjs`, `npm run build`, plus browser interaction checks.
