import { Link, useParams } from 'react-router';
import { ScaledSlide } from './ScaledSlide';
import { PlayIcon } from './ProjectSVGs';

interface MenuItem {
  label: string;
  path: string;
}

interface LabProjectPageProps {
  projectName: string;
  menuItems: MenuItem[];
  activeItem: string;
  children?: React.ReactNode;
}

export function LabProjectPage({ projectName, menuItems, activeItem, children }: LabProjectPageProps) {
  const menuPositions = [272, 329, 385, 441];

  return (
    <ScaledSlide>
      {/* Main Title */}
      <h1
        className="absolute font-['JetBrains_Mono'] text-[#141414] font-bold leading-[27px]"
        style={{ left: 48, top: 144, fontSize: 76 }}
      >
        {projectName}
      </h1>

      {/* Menu items */}
      {menuItems.map((item, index) => {
        const isActive = item.label === activeItem;
        const top = menuPositions[index] || 272 + index * 56;
        const left = isActive ? 85 : 53;

        return (
          <Link
            key={item.label}
            to={item.path}
            className="absolute text-[#141414] text-[28px] font-bold leading-[27px] no-underline transition-opacity duration-300 hover:opacity-60 font-['JetBrains_Mono']"
            style={{ left, top }}
          >
            {item.label}
          </Link>
        );
      })}

      {/* Arrow icon next to active item */}
      {menuItems.map((item, index) => {
        if (item.label !== activeItem) return null;
        const top = (menuPositions[index] || 272 + index * 56) + 5;
        return (
          <div key="arrow" className="absolute w-5 h-[18px]" style={{ left: 48, top }}>
            <PlayIcon />
          </div>
        );
      })}

      {/* Content Area */}
      <div
        className="absolute overflow-hidden"
        style={{ width: 1610, height: 750, top: 213, left: 310 }}
      >
        {children || (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#141414] text-[20px] font-normal opacity-30 tracking-[4px] font-['JetBrains_Mono']">
            {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
          </div>
        )}
      </div>

      {/* Description */}
      
    </ScaledSlide>
  );
}

// === DESIGN SELECTION (formerly SHAPER) Lab Pages ===

const designSelectionLabMenu: MenuItem[] = [
  { label: 'intent', path: '/lab/design-selection/intent' },
  { label: 'form strategy', path: '/lab/design-selection/form-strategy' },
  { label: 'experiment', path: '/lab/design-selection/experiment' },
  { label: 'observation', path: '/lab/design-selection/observation' },
];

export function DesignSelectionIntentPage() {
  return <LabProjectPage projectName="DESIGN SELECTION" menuItems={designSelectionLabMenu} activeItem="intent" />;
}

export function DesignSelectionExperimentPage() {
  return <LabProjectPage projectName="DESIGN SELECTION" menuItems={designSelectionLabMenu} activeItem="experiment" />;
}

export function DesignSelectionObservationPage() {
  return <LabProjectPage projectName="DESIGN SELECTION" menuItems={designSelectionLabMenu} activeItem="observation" />;
}

// === DENSITY SYSTEMS Lab Pages ===

const densitySystemsLabMenu: MenuItem[] = [
  { label: 'intent', path: '/lab/density-systems/intent' },
  { label: 'form strategy', path: '/lab/density-systems/form-strategy' },
  { label: 'experiment', path: '/lab/density-systems/experiment' },
  { label: 'observation', path: '/lab/density-systems/observation' },
];

export function DensitySystemsIntentPage() {
  return <LabProjectPage projectName="DENSITY SYSTEMS" menuItems={densitySystemsLabMenu} activeItem="intent" />;
}

export function DensitySystemsFormStrategyPage() {
  return <LabProjectPage projectName="DENSITY SYSTEMS" menuItems={densitySystemsLabMenu} activeItem="form strategy" />;
}

export function DensitySystemsExperimentPage() {
  return <LabProjectPage projectName="DENSITY SYSTEMS" menuItems={densitySystemsLabMenu} activeItem="experiment" />;
}

export function DensitySystemsObservationPage() {
  return <LabProjectPage projectName="DENSITY SYSTEMS" menuItems={densitySystemsLabMenu} activeItem="observation" />;
}

// === MODULAR PIXEL FILL LOGIC Lab Pages ===

const modularPixelLabMenu: MenuItem[] = [
  { label: 'intent', path: '/lab/modular-pixel-fill-logic/intent' },
  { label: 'form strategy', path: '/lab/modular-pixel-fill-logic/form-strategy' },
  { label: 'experiment', path: '/lab/modular-pixel-fill-logic/experiment' },
  { label: 'observation', path: '/lab/modular-pixel-fill-logic/observation' },
];

export function ModularPixelIntentPage() {
  return <LabProjectPage projectName="PIXEL FILL" menuItems={modularPixelLabMenu} activeItem="intent" />;
}

export function ModularPixelFormStrategyPage() {
  return <LabProjectPage projectName="PIXEL FILL" menuItems={modularPixelLabMenu} activeItem="form strategy" />;
}

export function ModularPixelExperimentPage() {
  return <LabProjectPage projectName="PIXEL FILL" menuItems={modularPixelLabMenu} activeItem="experiment" />;
}

export function ModularPixelObservationPage() {
  return <LabProjectPage projectName="PIXEL FILL" menuItems={modularPixelLabMenu} activeItem="observation" />;
}

// === DEPTH HIERARCHY Lab Pages ===

const depthHierarchyLabMenu: MenuItem[] = [
  { label: 'intent', path: '/lab/depth-hierarchy/intent' },
  { label: 'form strategy', path: '/lab/depth-hierarchy/form-strategy' },
  { label: 'experiment', path: '/lab/depth-hierarchy/experiment' },
  { label: 'observation', path: '/lab/depth-hierarchy/observation' },
];

export function DepthHierarchyIntentPage() {
  return <LabProjectPage projectName="DEPTH HIERARCHY" menuItems={depthHierarchyLabMenu} activeItem="intent" />;
}

export function DepthHierarchyFormStrategyPage() {
  return <LabProjectPage projectName="DEPTH HIERARCHY" menuItems={depthHierarchyLabMenu} activeItem="form strategy" />;
}

export function DepthHierarchyExperimentPage() {
  return <LabProjectPage projectName="DEPTH HIERARCHY" menuItems={depthHierarchyLabMenu} activeItem="experiment" />;
}

export function DepthHierarchyObservationPage() {
  return <LabProjectPage projectName="DEPTH HIERARCHY" menuItems={depthHierarchyLabMenu} activeItem="observation" />;
}