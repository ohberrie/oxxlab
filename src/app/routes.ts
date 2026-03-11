import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { LabPage } from './components/LabPage';
import { ProjectsPage } from './components/ProjectsPage';
import { NotesPage } from './components/NotesPage';
import { ShopPage } from './components/ShopPage';
import { FrameworkPage } from './components/FrameworkPage';
import {
  DesignSelectionIntentPage,
  DesignSelectionExperimentPage,
  DesignSelectionObservationPage,
  DensitySystemsIntentPage,
  DensitySystemsFormStrategyPage,
  DensitySystemsExperimentPage,
  DensitySystemsObservationPage,
  ModularPixelIntentPage,
  ModularPixelFormStrategyPage,
  ModularPixelExperimentPage,
  ModularPixelObservationPage,
  DepthHierarchyIntentPage,
  DepthHierarchyFormStrategyPage,
  DepthHierarchyExperimentPage,
  DepthHierarchyObservationPage,
} from './components/LabProjectPage';
import { ShaperFormStrategyPage } from './components/ShaperFormStrategyPage';
import { ShaperConfigurePage } from './components/ShaperConfigurePage';
import { ShaperLogicPage } from './components/ShaperLogicPage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/about', Component: AboutPage },
  { path: '/lab', Component: LabPage },
  { path: '/projects', Component: ProjectsPage },
  { path: '/notes', Component: NotesPage },
  { path: '/shop', Component: ShopPage },
  { path: '/framework', Component: FrameworkPage },

  // Lab / Design Selection (formerly SHAPER)
  { path: '/lab/design-selection', Component: DesignSelectionIntentPage },
  { path: '/lab/design-selection/intent', Component: DesignSelectionIntentPage },
  { path: '/lab/design-selection/form-strategy', Component: ShaperFormStrategyPage },
  { path: '/lab/design-selection/experiment', Component: DesignSelectionExperimentPage },
  { path: '/lab/design-selection/observation', Component: DesignSelectionObservationPage },

  // Lab / Density Systems
  { path: '/lab/density-systems', Component: DensitySystemsIntentPage },
  { path: '/lab/density-systems/intent', Component: DensitySystemsIntentPage },
  { path: '/lab/density-systems/form-strategy', Component: DensitySystemsFormStrategyPage },
  { path: '/lab/density-systems/experiment', Component: DensitySystemsExperimentPage },
  { path: '/lab/density-systems/observation', Component: DensitySystemsObservationPage },

  // Lab / Modular Pixel Fill Logic
  { path: '/lab/modular-pixel-fill-logic', Component: ModularPixelIntentPage },
  { path: '/lab/modular-pixel-fill-logic/intent', Component: ModularPixelIntentPage },
  { path: '/lab/modular-pixel-fill-logic/form-strategy', Component: ModularPixelFormStrategyPage },
  { path: '/lab/modular-pixel-fill-logic/experiment', Component: ModularPixelExperimentPage },
  { path: '/lab/modular-pixel-fill-logic/observation', Component: ModularPixelObservationPage },

  // Lab / Depth Hierarchy
  { path: '/lab/depth-hierarchy', Component: DepthHierarchyIntentPage },
  { path: '/lab/depth-hierarchy/intent', Component: DepthHierarchyIntentPage },
  { path: '/lab/depth-hierarchy/form-strategy', Component: DepthHierarchyFormStrategyPage },
  { path: '/lab/depth-hierarchy/experiment', Component: DepthHierarchyExperimentPage },
  { path: '/lab/depth-hierarchy/observation', Component: DepthHierarchyObservationPage },

  // Projects / SHAPER (Design Selection)
  { path: '/projects/shaper', Component: ShaperConfigurePage },
  { path: '/projects/shaper/configure', Component: ShaperConfigurePage },
  { path: '/projects/shaper/logic', Component: ShaperLogicPage },

  // Catch-all
  { path: '*', Component: HomePage },
]);