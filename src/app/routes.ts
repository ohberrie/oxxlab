import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';

// Home ships in the main bundle; every other page is split into its own chunk.
export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/about', lazy: () => import('./components/AboutPage').then((m) => ({ Component: m.AboutPage })) },
  { path: '/lab', lazy: () => import('./components/LabPage').then((m) => ({ Component: m.LabPage })) },
  { path: '/lab/systems', lazy: () => import('./components/LabSystemPage').then((m) => ({ Component: m.LabSystemPage })) },
  { path: '/lab/cases', lazy: () => import('./components/LabCasesPage').then((m) => ({ Component: m.LabCasesPage })) },
  { path: '/lab/cases/:id', lazy: () => import('./components/LabCasesPage').then((m) => ({ Component: m.LabCasesPage })) },
  { path: '/projects', lazy: () => import('./components/ProjectsPage').then((m) => ({ Component: m.ProjectsPage })) },
  { path: '/notes', lazy: () => import('./components/NotesPage').then((m) => ({ Component: m.NotesPage })) },
  { path: '/shop', lazy: () => import('./components/ShopPage').then((m) => ({ Component: m.ShopPage })) },
  { path: '/framework', lazy: () => import('./components/FrameworkPage').then((m) => ({ Component: m.FrameworkPage })) },

  // Lab / Selection Logic
  { path: '/lab/selection-logic', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicOverviewPage })) },
  { path: '/lab/selection-logic/overview', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicOverviewPage })) },
  { path: '/lab/selection-logic/principle', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicPrinciplePage })) },
  { path: '/lab/selection-logic/diagram', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicDiagramPage })) },
  { path: '/lab/selection-logic/experiment', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicExperimentPage })) },
  { path: '/lab/selection-logic/observation', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.SelectionLogicObservationPage })) },

  // Lab / Dense Field
  { path: '/lab/dense-field', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldOverviewPage })) },
  { path: '/lab/dense-field/overview', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldOverviewPage })) },
  { path: '/lab/dense-field/principle', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldPrinciplePage })) },
  { path: '/lab/dense-field/diagram', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldDiagramPage })) },
  { path: '/lab/dense-field/experiment', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldExperimentPage })) },
  { path: '/lab/dense-field/observation', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.DenseFieldObservationPage })) },

  // Lab / Modular Fill
  { path: '/lab/modular-fill', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillOverviewPage })) },
  { path: '/lab/modular-fill/overview', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillOverviewPage })) },
  { path: '/lab/modular-fill/principle', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillPrinciplePage })) },
  { path: '/lab/modular-fill/diagram', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillDiagramPage })) },
  { path: '/lab/modular-fill/experiment', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillExperimentPage })) },
  { path: '/lab/modular-fill/observation', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.ModularFillObservationPage })) },

  // Lab / Layer Stack
  { path: '/lab/layer-stack', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackOverviewPage })) },
  { path: '/lab/layer-stack/overview', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackOverviewPage })) },
  { path: '/lab/layer-stack/principle', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackPrinciplePage })) },
  { path: '/lab/layer-stack/diagram', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackDiagramPage })) },
  { path: '/lab/layer-stack/experiment', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackExperimentPage })) },
  { path: '/lab/layer-stack/observation', lazy: () => import('./components/LabProjectPage').then((m) => ({ Component: m.LayerStackObservationPage })) },

  // Projects / SHAPER (Design Selection)
  { path: '/projects/shaper', lazy: () => import('./components/ShaperConfigurePage').then((m) => ({ Component: m.ShaperConfigurePage })) },
  { path: '/projects/shaper/configure', lazy: () => import('./components/ShaperConfigurePage').then((m) => ({ Component: m.ShaperConfigurePage })) },
  { path: '/projects/shaper/logic', lazy: () => import('./components/ShaperLogicPage').then((m) => ({ Component: m.ShaperLogicPage })) },

  // Catch-all
  { path: '*', Component: HomePage },
]);