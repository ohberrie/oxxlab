import { createBrowserRouter, redirect } from 'react-router';
import { Shell } from './os/Shell';
import { Home } from './pages/Home';

// Home ships in the main bundle; every other page is split into its own chunk.
export const router = createBrowserRouter([
  {
    Component: Shell,
    HydrateFallback: () => null,
    children: [
      { path: '/', Component: Home },
      { path: '/engine', loader: () => redirect('/engine/convergence') },
      { path: '/engine/:principle/:mode?', lazy: () => import('./pages/Engine').then(m => ({ Component: m.EnginePage })) },
      { path: '/field', lazy: () => import('./pages/Field').then(m => ({ Component: m.FieldPage })) },
      { path: '/field/:id', lazy: () => import('./pages/Case').then(m => ({ Component: m.CasePage })) },
      { path: '/tools', lazy: () => import('./pages/Tools').then(m => ({ Component: m.ToolsPage })) },
      { path: '/tools/spine', lazy: () => import('./pages/Tools').then(m => ({ Component: m.SpinePage })) },
      { path: '/method', lazy: () => import('./pages/Method').then(m => ({ Component: m.MethodPage })) },
      { path: '*', lazy: () => import('./pages/NotFound').then(m => ({ Component: m.NotFound })) },
    ],
  },
]);
