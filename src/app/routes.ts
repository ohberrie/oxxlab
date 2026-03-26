import { createBrowserRouter } from 'react-router';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { LabPage } from './components/LabPage';
import { LabSystemPage } from './components/LabSystemPage';
import { LabCasesPage } from './components/LabCasesPage';
import { ProjectsPage } from './components/ProjectsPage';
import { NotesPage } from './components/NotesPage';
import { ShopPage } from './components/ShopPage';
import { FrameworkPage } from './components/FrameworkPage';
import {
  SelectionLogicOverviewPage,
  SelectionLogicPrinciplePage,
  SelectionLogicDiagramPage,
  SelectionLogicExperimentPage,
  SelectionLogicObservationPage,
  DenseFieldOverviewPage,
  DenseFieldPrinciplePage,
  DenseFieldDiagramPage,
  DenseFieldExperimentPage,
  DenseFieldObservationPage,
  ModularFillOverviewPage,
  ModularFillPrinciplePage,
  ModularFillDiagramPage,
  ModularFillExperimentPage,
  ModularFillObservationPage,
  LayerStackOverviewPage,
  LayerStackPrinciplePage,
  LayerStackDiagramPage,
  LayerStackExperimentPage,
  LayerStackObservationPage,
} from './components/LabProjectPage';
import { ShaperConfigurePage } from './components/ShaperConfigurePage';
import { ShaperLogicPage } from './components/ShaperLogicPage';

export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '/about', Component: AboutPage },
  { path: '/lab', Component: LabPage },
  { path: '/lab/systems', Component: LabSystemPage },
  { path: '/lab/cases', Component: LabCasesPage },
  { path: '/lab/cases/:id', Component: LabCasesPage },
  { path: '/projects', Component: ProjectsPage },
  { path: '/notes', Component: NotesPage },
  { path: '/shop', Component: ShopPage },
  { path: '/framework', Component: FrameworkPage },

  // Lab / Selection Logic
  { path: '/lab/selection-logic', Component: SelectionLogicOverviewPage },
  { path: '/lab/selection-logic/overview', Component: SelectionLogicOverviewPage },
  { path: '/lab/selection-logic/principle', Component: SelectionLogicPrinciplePage },
  { path: '/lab/selection-logic/diagram', Component: SelectionLogicDiagramPage },
  { path: '/lab/selection-logic/experiment', Component: SelectionLogicExperimentPage },
  { path: '/lab/selection-logic/observation', Component: SelectionLogicObservationPage },

  // Lab / Dense Field
  { path: '/lab/dense-field', Component: DenseFieldOverviewPage },
  { path: '/lab/dense-field/overview', Component: DenseFieldOverviewPage },
  { path: '/lab/dense-field/principle', Component: DenseFieldPrinciplePage },
  { path: '/lab/dense-field/diagram', Component: DenseFieldDiagramPage },
  { path: '/lab/dense-field/experiment', Component: DenseFieldExperimentPage },
  { path: '/lab/dense-field/observation', Component: DenseFieldObservationPage },

  // Lab / Modular Fill
  { path: '/lab/modular-fill', Component: ModularFillOverviewPage },
  { path: '/lab/modular-fill/overview', Component: ModularFillOverviewPage },
  { path: '/lab/modular-fill/principle', Component: ModularFillPrinciplePage },
  { path: '/lab/modular-fill/diagram', Component: ModularFillDiagramPage },
  { path: '/lab/modular-fill/experiment', Component: ModularFillExperimentPage },
  { path: '/lab/modular-fill/observation', Component: ModularFillObservationPage },

  // Lab / Layer Stack
  { path: '/lab/layer-stack', Component: LayerStackOverviewPage },
  { path: '/lab/layer-stack/overview', Component: LayerStackOverviewPage },
  { path: '/lab/layer-stack/principle', Component: LayerStackPrinciplePage },
  { path: '/lab/layer-stack/diagram', Component: LayerStackDiagramPage },
  { path: '/lab/layer-stack/experiment', Component: LayerStackExperimentPage },
  { path: '/lab/layer-stack/observation', Component: LayerStackObservationPage },

  // Projects / SHAPER (Design Selection)
  { path: '/projects/shaper', Component: ShaperConfigurePage },
  { path: '/projects/shaper/configure', Component: ShaperConfigurePage },
  { path: '/projects/shaper/logic', Component: ShaperLogicPage },

  // Catch-all
  { path: '*', Component: HomePage },
]);