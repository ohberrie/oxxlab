import { createBrowserRouter, redirect } from 'react-router';
import { Shell } from './os/Shell';
import { GlyphHero } from './pages/GlyphHero';

// The landing ships in the main bundle; every other page is split into its own chunk.
export const router = createBrowserRouter([
  {
    Component: Shell,
    HydrateFallback: () => null,
    children: [
      { path: '/', Component: GlyphHero },
      { path: '/engine', loader: () => redirect('/engine/layering') },
      { path: '/engine/:principle/:mode?', lazy: () => import('./pages/Engine').then(m => ({ Component: m.EnginePage })) },
      { path: '/field', lazy: () => import('./pages/Field').then(m => ({ Component: m.FieldPage })) },
      { path: '/field/:id', lazy: () => import('./pages/Case').then(m => ({ Component: m.CasePage })) },
      { path: '/tools', lazy: () => import('./pages/Tools').then(m => ({ Component: m.ToolsPage })) },
      // Unknown paths fall back to the landing, like unknown hashes in the v2 prototype.
      { path: '*', loader: () => redirect('/') },
    ],
  },
]);
