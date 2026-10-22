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
