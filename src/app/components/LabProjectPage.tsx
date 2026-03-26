import { Link } from 'react-router';
import { ScaledSlide, useIsMobile } from './ScaledSlide';
import { PlayIcon } from './ProjectSVGs';
import { CrossLinks } from './CrossLinks';

interface MenuItem {
  label: string;
  path: string;
}

interface ApplicationLink {
  label: string;
  path: string;
}

interface LabProjectPageProps {
  projectName: string;
  subtitle: string;
  menuItems: MenuItem[];
  activeItem: string;
  applications?: ApplicationLink[];
  children?: React.ReactNode;
}

function LabProjectContent({ projectName, subtitle, menuItems, activeItem, applications, children }: LabProjectPageProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="px-5 pt-6 pb-10">
        <h1 className="font-['JetBrains_Mono'] font-bold text-[36px] leading-[1.05] tracking-[-0.02em] mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {projectName}
        </h1>
        <p className="font-['JetBrains_Mono'] text-[13px] leading-[1.5] mb-6 max-w-[400px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {subtitle}
        </p>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 mb-8">
          {menuItems.map((item) => {
            const isActive = item.label === activeItem;
            return (
              <Link
                key={item.label}
                to={item.path}
                className="font-['JetBrains_Mono'] text-[16px] font-bold no-underline transition-opacity duration-300 hover:opacity-60 flex items-center gap-2"
                style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)' }}
              >
                {isActive && (
                  <span className="w-4 h-3.5 shrink-0" style={{ color: '#FF1E00' }}><PlayIcon /></span>
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="w-full min-h-[50vh] mb-8">
          {children || (
            <span className="text-[16px] tracking-[4px] font-['JetBrains_Mono'] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
              {activeItem}
            </span>
          )}
        </div>

        {applications && <CrossLinks label="Applications" links={applications} dark />}
      </div>
    );
  }

  const menuStartY = 340;
  const menuGap = 52;

  return (
    <>
      <h1
        className="absolute font-['JetBrains_Mono'] font-bold leading-[1]"
        style={{ left: 58, top: 100, fontSize: 64, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}
      >
        {projectName}
      </h1>

      <p
        className="absolute font-['JetBrains_Mono'] leading-[1.5] whitespace-nowrap"
        style={{ left: 60, top: 180, fontSize: 16, letterSpacing: '0.02em', color: 'rgba(255,255,255,0.2)' }}
      >
        {subtitle}
      </p>

      {menuItems.map((item, index) => {
        const isActive = item.label === activeItem;
        const top = menuStartY + index * menuGap;
        const left = isActive ? 90 : 60;

        return (
          <Link
            key={item.label}
            to={item.path}
            className="absolute text-[20px] font-bold leading-[1] no-underline transition-all duration-300 hover:opacity-60 font-['JetBrains_Mono']"
            style={{ left, top, color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)' }}
          >
            {item.label}
          </Link>
        );
      })}

      {menuItems.map((item, index) => {
        if (item.label !== activeItem) return null;
        const top = menuStartY + index * menuGap + 1;
        return (
          <div key="arrow" className="absolute w-[16px] h-[14px]" style={{ left: 60, top, color: '#FF1E00' }}>
            <PlayIcon />
          </div>
        );
      })}

      {applications && applications.length > 0 && (
        <div className="absolute" style={{ left: 58, bottom: 55 }}>
          <CrossLinks label="Applications" links={applications} dark />
        </div>
      )}

      <div
        className="absolute overflow-hidden"
        style={{ left: 380, top: 340, width: 1480, height: 670 }}
      >
        {children || (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-normal tracking-[6px] font-['JetBrains_Mono'] uppercase" style={{ color: 'rgba(255,255,255,0.15)' }}>
            {activeItem}
          </div>
        )}
      </div>
    </>
  );
}

export function LabProjectPage(props: LabProjectPageProps) {
  return (
    <ScaledSlide dark>
      <LabProjectContent {...props} />
    </ScaledSlide>
  );
}

// === SELECTION LOGIC ===

const selectionLogicMenu: MenuItem[] = [
  { label: 'overview', path: '/lab/selection-logic/overview' },
  { label: 'principle', path: '/lab/selection-logic/principle' },
  { label: 'diagram', path: '/lab/selection-logic/diagram' },
  { label: 'experiment', path: '/lab/selection-logic/experiment' },
  { label: 'observation', path: '/lab/selection-logic/observation' },
];

const selectionLogicApps: ApplicationLink[] = [
  { label: 'Shaper — Configure', path: '/projects/shaper/configure' },
  { label: 'Shaper — Presets', path: '/projects/shaper/logic' },
];

const SL_SUBTITLE = 'Constraint-based filtering and decision-making in form generation';

export function SelectionLogicOverviewPage() {
  return (
    <LabProjectPage projectName="SELECTION LOGIC" subtitle={SL_SUBTITLE} menuItems={selectionLogicMenu} activeItem="overview" applications={selectionLogicApps}>
      <div className="pt-0 px-12 pb-12 max-w-[900px]">
        <p className="font-['JetBrains_Mono'] text-[18px] leading-[1.8] mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Selection Logic determines how a system chooses one outcome among many possible configurations.
        </p>
        <p className="font-['JetBrains_Mono'] text-[14px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          It is the engine behind algorithmic decision-making in form generation — filtering possibilities through constraints, weights, and intent until a single result emerges.
        </p>
      </div>
    </LabProjectPage>
  );
}

export function SelectionLogicPrinciplePage() {
  const principles = ['constraint filtering', 'weighted selection', 'seed variation', 'rule-based pruning'];
  return (
    <LabProjectPage projectName="SELECTION LOGIC" subtitle={SL_SUBTITLE} menuItems={selectionLogicMenu} activeItem="principle" applications={selectionLogicApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {principles.map((p, i) => (
          <div key={p} className="flex items-center gap-6">
            <span className="font-['JetBrains_Mono'] text-[48px] font-bold w-[60px] text-right" style={{ color: 'rgba(255,255,255,0.08)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="font-['JetBrains_Mono'] text-[24px] font-bold tracking-[2px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function SelectionLogicDiagramPage() {
  return (
    <LabProjectPage projectName="SELECTION LOGIC" subtitle={SL_SUBTITLE} menuItems={selectionLogicMenu} activeItem="diagram" applications={selectionLogicApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col items-center justify-center h-full gap-10">
        <div className="font-['JetBrains_Mono'] text-[14px] tracking-[3px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>All Possibilities</div>
        <div className="flex gap-4">
          {['A','B','C','D','E','F','G'].map(l => (
            <div key={l} className="w-[50px] h-[50px] flex items-center justify-center font-['JetBrains_Mono'] text-[18px] font-bold" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)' }}>{l}</div>
          ))}
        </div>
        <div className="font-['JetBrains_Mono'] text-[20px]" style={{ color: 'rgba(255,255,255,0.15)' }}>↓ filter</div>
        <div className="flex gap-4">
          {['B','D','F'].map(l => (
            <div key={l} className="w-[50px] h-[50px] flex items-center justify-center font-['JetBrains_Mono'] text-[18px] font-bold" style={{ border: '2px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.65)' }}>{l}</div>
          ))}
        </div>
        <div className="font-['JetBrains_Mono'] text-[20px]" style={{ color: 'rgba(255,255,255,0.15)' }}>↓ selection</div>
        <div className="w-[60px] h-[60px] flex items-center justify-center font-['JetBrains_Mono'] text-[22px] font-bold" style={{ background: '#FF1E00', color: '#0a0a0a' }}>D</div>
      </div>
    </LabProjectPage>
  );
}

export function SelectionLogicExperimentPage() {
  return (
    <LabProjectPage projectName="SELECTION LOGIC" subtitle={SL_SUBTITLE} menuItems={selectionLogicMenu} activeItem="experiment" applications={selectionLogicApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-5">
        {['random vs constrained selection', 'parameter sweeps', 'preset generation'].map(e => (
          <div key={e} className="flex items-center gap-4">
            <span className="w-2 h-2 bg-[#FF1E00] rounded-full shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[18px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{e}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function SelectionLogicObservationPage() {
  return (
    <LabProjectPage projectName="SELECTION LOGIC" subtitle={SL_SUBTITLE} menuItems={selectionLogicMenu} activeItem="observation" applications={selectionLogicApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {[
          { key: 'unconstrained', result: 'noise' },
          { key: 'constraints', result: 'clarity' },
          { key: 'good selection', result: 'identity' },
        ].map(o => (
          <div key={o.key} className="flex items-baseline gap-4">
            <span className="font-['JetBrains_Mono'] text-[16px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.key}</span>
            <span className="font-['JetBrains_Mono'] text-[14px]" style={{ color: 'rgba(255,255,255,0.15)' }}>→</span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>{o.result}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

// === DENSE FIELD ===

const denseFieldMenu: MenuItem[] = [
  { label: 'overview', path: '/lab/dense-field/overview' },
  { label: 'principle', path: '/lab/dense-field/principle' },
  { label: 'diagram', path: '/lab/dense-field/diagram' },
  { label: 'experiment', path: '/lab/dense-field/experiment' },
  { label: 'observation', path: '/lab/dense-field/observation' },
];

const denseFieldApps: ApplicationLink[] = [
  { label: 'Shaper', path: '/projects/shaper' },
];

const DF_SUBTITLE = 'Spatial concentration and distribution of visual intensity';

export function DenseFieldOverviewPage() {
  return (
    <LabProjectPage projectName="DENSE FIELD" subtitle={DF_SUBTITLE} menuItems={denseFieldMenu} activeItem="overview" applications={denseFieldApps}>
      <div className="pt-0 px-12 pb-12 max-w-[900px]">
        <p className="font-['JetBrains_Mono'] text-[18px] leading-[1.8] mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Dense Field defines how visual intensity is distributed across space.
        </p>
        <p className="font-['JetBrains_Mono'] text-[14px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          It determines where attention accumulates and how spatial tension is perceived. Used when shaping visual intensity, focus, and spatial rhythm.
        </p>
      </div>
    </LabProjectPage>
  );
}

export function DenseFieldPrinciplePage() {
  const principles = ['uniform distribution', 'gradient distribution', 'clustered density', 'void vs concentration'];
  return (
    <LabProjectPage projectName="DENSE FIELD" subtitle={DF_SUBTITLE} menuItems={denseFieldMenu} activeItem="principle" applications={denseFieldApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {principles.map((p, i) => (
          <div key={p} className="flex items-center gap-6">
            <span className="font-['JetBrains_Mono'] text-[48px] font-bold w-[60px] text-right" style={{ color: 'rgba(255,255,255,0.08)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="font-['JetBrains_Mono'] text-[24px] font-bold tracking-[2px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function DenseFieldDiagramPage() {
  return (
    <LabProjectPage projectName="DENSE FIELD" subtitle={DF_SUBTITLE} menuItems={denseFieldMenu} activeItem="diagram" applications={denseFieldApps}>
      <div className="pt-0 px-12 pb-12 flex items-center justify-center h-full gap-20">
        <div className="flex flex-col items-center gap-4">
          <div className="font-['JetBrains_Mono'] text-[12px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Low Density</div>
          <div className="grid grid-cols-3 gap-6">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>
        </div>
        <div className="font-['JetBrains_Mono'] text-[28px]" style={{ color: 'rgba(255,255,255,0.12)' }}>→</div>
        <div className="flex flex-col items-center gap-4">
          <div className="font-['JetBrains_Mono'] text-[12px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>High Density</div>
          <div className="grid grid-cols-6 gap-1">
            {Array(36).fill(0).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />
            ))}
          </div>
        </div>
      </div>
    </LabProjectPage>
  );
}

export function DenseFieldExperimentPage() {
  return (
    <LabProjectPage projectName="DENSE FIELD" subtitle={DF_SUBTITLE} menuItems={denseFieldMenu} activeItem="experiment" applications={denseFieldApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-5">
        {['voxel density variations', 'lighting concentration tests', 'stage attention mapping'].map(e => (
          <div key={e} className="flex items-center gap-4">
            <span className="w-2 h-2 bg-[#FF1E00] rounded-full shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[18px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{e}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function DenseFieldObservationPage() {
  return (
    <LabProjectPage projectName="DENSE FIELD" subtitle={DF_SUBTITLE} menuItems={denseFieldMenu} activeItem="observation" applications={denseFieldApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {[
          { key: 'clustered density', result: 'focal point generation' },
          { key: 'gradient density', result: 'movement induction' },
          { key: 'uniform density', result: 'stability' },
        ].map(o => (
          <div key={o.key} className="flex items-baseline gap-4">
            <span className="font-['JetBrains_Mono'] text-[16px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.key}</span>
            <span className="font-['JetBrains_Mono'] text-[14px]" style={{ color: 'rgba(255,255,255,0.15)' }}>→</span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>{o.result}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

// === MODULAR FILL ===

const modularFillMenu: MenuItem[] = [
  { label: 'overview', path: '/lab/modular-fill/overview' },
  { label: 'principle', path: '/lab/modular-fill/principle' },
  { label: 'diagram', path: '/lab/modular-fill/diagram' },
  { label: 'experiment', path: '/lab/modular-fill/experiment' },
  { label: 'observation', path: '/lab/modular-fill/observation' },
];

const modularFillApps: ApplicationLink[] = [
  { label: 'Shaper', path: '/projects/shaper' },
  { label: 'AIAA', path: '#' },
];

const MF_SUBTITLE = 'Form generation through discrete and repeatable units';

export function ModularFillOverviewPage() {
  return (
    <LabProjectPage projectName="MODULAR FILL" subtitle={MF_SUBTITLE} menuItems={modularFillMenu} activeItem="overview" applications={modularFillApps}>
      <div className="pt-0 px-12 pb-12 max-w-[900px]">
        <p className="font-['JetBrains_Mono'] text-[18px] leading-[1.8] mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Modular Fill generates complex forms by aggregating simple repeated units.
        </p>
        <p className="font-['JetBrains_Mono'] text-[14px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          It drives pattern generation and structural fill across compositions — building larger form fields through discrete, repeatable modules at multiple scales.
        </p>
      </div>
    </LabProjectPage>
  );
}

export function ModularFillPrinciplePage() {
  const principles = ['unit repetition', 'rule-based filling', 'inside-out filling logic', 'boundary-driven growth'];
  return (
    <LabProjectPage projectName="MODULAR FILL" subtitle={MF_SUBTITLE} menuItems={modularFillMenu} activeItem="principle" applications={modularFillApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {principles.map((p, i) => (
          <div key={p} className="flex items-center gap-6">
            <span className="font-['JetBrains_Mono'] text-[48px] font-bold w-[60px] text-right" style={{ color: 'rgba(255,255,255,0.08)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="font-['JetBrains_Mono'] text-[24px] font-bold tracking-[2px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function ModularFillDiagramPage() {
  return (
    <LabProjectPage projectName="MODULAR FILL" subtitle={MF_SUBTITLE} menuItems={modularFillMenu} activeItem="diagram" applications={modularFillApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col items-center justify-center h-full gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="font-['JetBrains_Mono'] text-[12px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Step 1 — Boundary</div>
          <div className="w-[300px] h-[60px] rounded-lg" style={{ border: '2px dashed rgba(255,255,255,0.15)' }} />
        </div>
        <div className="font-['JetBrains_Mono'] text-[20px]" style={{ color: 'rgba(255,255,255,0.12)' }}>↓</div>
        <div className="flex flex-col items-center gap-3">
          <div className="font-['JetBrains_Mono'] text-[12px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Step 2 — Large modules</div>
          <div className="flex gap-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="w-[44px] h-[44px]" style={{ background: 'rgba(255,255,255,0.55)' }} />
            ))}
          </div>
        </div>
        <div className="font-['JetBrains_Mono'] text-[20px]" style={{ color: 'rgba(255,255,255,0.12)' }}>↓</div>
        <div className="flex flex-col items-center gap-3">
          <div className="font-['JetBrains_Mono'] text-[12px] tracking-[2px] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Step 3 — Fill gaps</div>
          <div className="flex gap-0.5">
            {Array(24).fill(0).map((_, i) => (
              <div key={i} className="w-[12px] h-[44px]" style={{ background: `rgba(255,255,255,${0.2 + Math.random() * 0.5})` }} />
            ))}
          </div>
        </div>
      </div>
    </LabProjectPage>
  );
}

export function ModularFillExperimentPage() {
  return (
    <LabProjectPage projectName="MODULAR FILL" subtitle={MF_SUBTITLE} menuItems={modularFillMenu} activeItem="experiment" applications={modularFillApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-5">
        {['grid fill vs adaptive fill', 'voxel vs custom module', 'density-aware filling'].map(e => (
          <div key={e} className="flex items-center gap-4">
            <span className="w-2 h-2 bg-[#FF1E00] rounded-full shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[18px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{e}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function ModularFillObservationPage() {
  return (
    <LabProjectPage projectName="MODULAR FILL" subtitle={MF_SUBTITLE} menuItems={modularFillMenu} activeItem="observation" applications={modularFillApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {[
          { key: 'large modules', result: 'structure formation' },
          { key: 'small modules', result: 'detail filling' },
          { key: 'fill order', result: 'determines character' },
        ].map(o => (
          <div key={o.key} className="flex items-baseline gap-4">
            <span className="font-['JetBrains_Mono'] text-[16px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.key}</span>
            <span className="font-['JetBrains_Mono'] text-[14px]" style={{ color: 'rgba(255,255,255,0.15)' }}>→</span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>{o.result}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

// === LAYER STACK ===

const layerStackMenu: MenuItem[] = [
  { label: 'overview', path: '/lab/layer-stack/overview' },
  { label: 'principle', path: '/lab/layer-stack/principle' },
  { label: 'diagram', path: '/lab/layer-stack/diagram' },
  { label: 'experiment', path: '/lab/layer-stack/experiment' },
  { label: 'observation', path: '/lab/layer-stack/observation' },
];

const layerStackApps: ApplicationLink[] = [
  { label: 'MAMA Opening VCR', path: '#' },
  { label: 'AIAA', path: '#' },
];

const LS_SUBTITLE = 'Organization of depth, dominance, and spatial hierarchy';

export function LayerStackOverviewPage() {
  return (
    <LabProjectPage projectName="LAYER STACK" subtitle={LS_SUBTITLE} menuItems={layerStackMenu} activeItem="overview" applications={layerStackApps}>
      <div className="pt-0 px-12 pb-12 max-w-[900px]">
        <p className="font-['JetBrains_Mono'] text-[18px] leading-[1.8] mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Layer Stack organizes spatial depth and establishes visual hierarchy.
        </p>
        <p className="font-['JetBrains_Mono'] text-[14px] leading-[1.8]" style={{ color: 'rgba(255,255,255,0.35)' }}>
          It defines how foreground and background relate in any composition — managing overlap, occlusion, and depth contrast to create structured spatial experiences.
        </p>
      </div>
    </LabProjectPage>
  );
}

export function LayerStackPrinciplePage() {
  const principles = ['foreground / midground / background', 'overlap', 'occlusion', 'depth contrast'];
  return (
    <LabProjectPage projectName="LAYER STACK" subtitle={LS_SUBTITLE} menuItems={layerStackMenu} activeItem="principle" applications={layerStackApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {principles.map((p, i) => (
          <div key={p} className="flex items-center gap-6">
            <span className="font-['JetBrains_Mono'] text-[48px] font-bold w-[60px] text-right" style={{ color: 'rgba(255,255,255,0.08)' }}>{String(i + 1).padStart(2, '0')}</span>
            <span className="font-['JetBrains_Mono'] text-[24px] font-bold tracking-[2px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{p}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function LayerStackDiagramPage() {
  return (
    <LabProjectPage projectName="LAYER STACK" subtitle={LS_SUBTITLE} menuItems={layerStackMenu} activeItem="diagram" applications={layerStackApps}>
      <div className="pt-0 px-12 pb-12 flex items-center justify-center h-full">
        <div className="relative" style={{ width: 400, height: 300 }}>
          <div className="absolute rounded" style={{ width: 280, height: 180, left: 0, top: 120, background: 'rgba(255,255,255,0.08)' }}>
            <span className="absolute bottom-2 left-3 font-['JetBrains_Mono'] text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Layer 3 — Back</span>
          </div>
          <div className="absolute rounded" style={{ width: 280, height: 180, left: 60, top: 60, background: 'rgba(255,255,255,0.2)' }}>
            <span className="absolute bottom-2 left-3 font-['JetBrains_Mono'] text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Layer 2 — Mid</span>
          </div>
          <div className="absolute rounded" style={{ width: 280, height: 180, left: 120, top: 0, background: 'rgba(255,255,255,0.5)' }}>
            <span className="absolute bottom-2 left-3 font-['JetBrains_Mono'] text-[11px]" style={{ color: 'rgba(255,255,255,0.8)' }}>Layer 1 — Front</span>
          </div>
        </div>
      </div>
    </LabProjectPage>
  );
}

export function LayerStackExperimentPage() {
  return (
    <LabProjectPage projectName="LAYER STACK" subtitle={LS_SUBTITLE} menuItems={layerStackMenu} activeItem="experiment" applications={layerStackApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-5">
        {['flat vs layered composition', 'stage depth illusion', 'transparency layering'].map(e => (
          <div key={e} className="flex items-center gap-4">
            <span className="w-2 h-2 bg-[#FF1E00] rounded-full shrink-0" />
            <span className="font-['JetBrains_Mono'] text-[18px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{e}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}

export function LayerStackObservationPage() {
  return (
    <LabProjectPage projectName="LAYER STACK" subtitle={LS_SUBTITLE} menuItems={layerStackMenu} activeItem="observation" applications={layerStackApps}>
      <div className="pt-0 px-12 pb-12 flex flex-col gap-6">
        {[
          { key: 'depth', result: 'increased spatiality' },
          { key: 'overlap', result: 'hierarchy generation' },
          { key: 'layer contrast', result: 'gaze direction' },
        ].map(o => (
          <div key={o.key} className="flex items-baseline gap-4">
            <span className="font-['JetBrains_Mono'] text-[16px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{o.key}</span>
            <span className="font-['JetBrains_Mono'] text-[14px]" style={{ color: 'rgba(255,255,255,0.15)' }}>→</span>
            <span className="font-['JetBrains_Mono'] text-[20px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>{o.result}</span>
          </div>
        ))}
      </div>
    </LabProjectPage>
  );
}
