import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from './NavBar';
import { PlayIcon, ShaperSVG, AIASVG, IntuitionEncoderSVG, MamaVCRSVG } from './ProjectSVGs';

function PixelSquare() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-[70%] h-[70%] bg-current" />
    </div>
  );
}

interface Project {
  name: string;
  displayName: string;
  description: string;
  link: string;
  SvgComponent: React.FC;
}

const labProjects: Project[] = [
  {
    name: 'SELECTION\nLOGIC',
    displayName: 'SELECTION LOGIC',
    description: 'Constraint-based filtering and decision-making in form generation',
    link: '/lab/selection-logic',
    SvgComponent: PixelSquare,
  },
  {
    name: 'DENSE\nFIELD',
    displayName: 'DENSE FIELD',
    description: 'Spatial concentration and distribution of visual intensity',
    link: '/lab/dense-field',
    SvgComponent: PixelSquare,
  },
  {
    name: 'MODULAR\nFILL',
    displayName: 'MODULAR FILL',
    description: 'Form generation through discrete and repeatable units',
    link: '/lab/modular-fill',
    SvgComponent: PixelSquare,
  },
  {
    name: 'LAYER\nSTACK',
    displayName: 'LAYER STACK',
    description: 'Organization of depth, dominance, and spatial hierarchy',
    link: '/lab/layer-stack',
    SvgComponent: PixelSquare,
  },
];

const worksProjects: Project[] = [
  {
    name: 'SHAPER',
    displayName: 'SHAPER',
    description: 'Brief info about the project',
    link: '/projects/shaper',
    SvgComponent: ShaperSVG,
  },
  {
    name: 'AIAA',
    displayName: 'AIAA',
    description: 'Brief info about the project',
    link: '#',
    SvgComponent: AIASVG,
  },
  {
    name: 'MAMA\nOpening VCR',
    displayName: 'MAMA Opening VCR',
    description: 'Brief info about the project',
    link: '#',
    SvgComponent: MamaVCRSVG,
  },
  {
    name: 'INTUITION\nENCODER',
    displayName: 'INTUITION ENCODER',
    description: 'Brief info about the project',
    link: '#',
    SvgComponent: IntuitionEncoderSVG,
  },
];

interface Position {
  x: number;
  y: number;
}

function getRandomPositions(count: number, containerWidth: number, containerHeight: number, itemSize: number): Position[] {
  const positions: Position[] = [];
  const textSpace = 50;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let pos: Position = { x: 0, y: 0 };
    let found = false;

    while (attempts < 100 && !found) {
      pos = {
        x: Math.random() * Math.max(0, containerWidth - itemSize),
        y: Math.random() * Math.max(0, containerHeight - itemSize - textSpace),
      };

      let overlaps = false;
      for (const existing of positions) {
        if (
          Math.abs(pos.x - existing.x) < itemSize + 20 &&
          Math.abs(pos.y - existing.y) < itemSize + textSpace + 20
        ) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) found = true;
      attempts++;
    }

    positions.push(pos);
  }

  return positions;
}

interface ProjectGalleryPageProps {
  type: 'lab' | 'works';
}

export function ProjectGalleryPage({ type }: ProjectGalleryPageProps) {
  const projects = type === 'lab' ? labProjects : worksProjects;
  const defaultTitle = type === 'lab' ? 'Systems' : 'Projects';
  const navigate = useNavigate();

  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const resetTimeoutRef = useRef<number | null>(null);

  const getLogoSize = useCallback(() => {
    const vw = window.innerWidth;
    if (vw <= 680) return 120;
    return Math.min(200, Math.max(100, vw * 0.104));
  }, []);

  const calculatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const logoSize = getLogoSize();
    setPositions(getRandomPositions(projects.length, rect.width, rect.height, logoSize));
  }, [projects.length, getLogoSize]);

  useEffect(() => {
    calculatePositions();
    let timer: number;
    const handleResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(calculatePositions, 250);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [calculatePositions]);

  const handleMouseEnter = (project: Project) => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setHoveredProject(project);
  };

  const handleMouseLeave = (project: Project) => {
    if (hoveredProject === project) {
      resetTimeoutRef.current = window.setTimeout(() => {
        setHoveredProject(null);
        resetTimeoutRef.current = null;
      }, 3000);
    }
  };

  const logoSize = getLogoSize();
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 680;

  const title = hoveredProject ? hoveredProject.displayName : defaultTitle;
  const description = hoveredProject ? hoveredProject.description : (type === 'lab' ? 'Form experiments and research systems' : '');
  const showDescription = type === 'lab' ? true : !!hoveredProject;

  return (
    <div className="bg-[#f8f8fd] w-full h-screen relative overflow-hidden max-md:overflow-auto max-md:h-auto max-md:min-h-screen max-md:flex max-md:flex-col">
      <header className="max-md:relative absolute top-0 left-0 right-0 z-20">
        <NavBar />
      </header>

      <div className="absolute top-0 left-0 w-[34%] min-w-[300px] max-w-[500px] h-full flex items-center pl-[58px] max-lg:w-[260px] max-lg:min-w-[220px] max-lg:pl-8 max-md:relative max-md:w-full max-md:max-w-none max-md:min-w-0 max-md:h-auto max-md:px-5 max-md:pt-10 max-md:pb-5 max-md:pl-6 max-md:block">
        <div className="flex flex-col gap-8 max-md:gap-4">
          <div className="flex items-start gap-3 max-md:items-center max-md:gap-2.5">
            <div
              className="w-5 h-[18px] text-[#141414] shrink-0 transition-colors duration-300"
              style={{ marginTop: 'calc((clamp(36px, 3.75vw, 72px) * 1.07 - 18px) / 2)' }}
            >
              <PlayIcon />
            </div>
            <div className="transition-transform duration-300">
              <h1 className="font-['DM_Sans'] text-[clamp(36px,3.75vw,72px)] font-bold leading-[1.07] tracking-[-0.02em] text-[#141414] mb-5 transition-opacity duration-300 max-md:text-[32px] max-md:mb-2">
                {title}
              </h1>
              <p
                className={`font-['DM_Sans'] text-[clamp(14px,1vw,19px)] font-bold leading-[1.47] tracking-[-0.02em] text-[#141414] max-w-[310px] transition-opacity duration-300 max-md:text-[14px] ${
                  showDescription ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {description}
              </p>
            </div>
          </div>

          {/* Services & Contact — Studio only */}
          {type === 'works' && !hoveredProject && (
            <div className="flex flex-col gap-6 mt-4 max-md:mt-2">
              <div>
                <div className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.1em] uppercase text-[#141414] opacity-30 mb-3">Services</div>
                {['Stage & Set Design', 'Exhibition Spatial Design', 'Computational Object Design', 'Design Strategy Consultation', 'Perception Evaluation Research'].map(s => (
                  <div key={s} className="py-1.5 border-b border-[#141414]/[0.04] font-['DM_Sans'] text-[12px] text-[#141414] opacity-50 last:border-b-0">
                    {s}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.1em] uppercase text-[#141414] opacity-30 mb-2">Contact</div>
                <p className="font-['DM_Sans'] text-[12px] text-[#141414] opacity-40 leading-[1.6]">
                  For collaboration, research inquiries, or studio projects — reach out directly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="absolute top-[70px] right-0 left-[34%] bottom-0 max-lg:left-[260px] max-lg:top-[70px] max-md:relative max-md:top-0 max-md:left-0 max-md:right-0 max-md:bottom-auto max-md:w-full max-md:min-h-[60vh] max-md:p-5"
      >
        {projects.map((project, index) => {
          const pos = positions[index] || { x: 0, y: 0 };
          return (
            <div
              key={project.name}
              className={`flex flex-col items-center cursor-pointer transition-all duration-300 group ${
                isMobile
                  ? 'relative mx-auto mb-10'
                  : 'absolute'
              }`}
              style={isMobile ? {} : { left: pos.x, top: pos.y }}
              onClick={() => {
                if (project.link !== '#') navigate(project.link);
              }}
              onMouseEnter={() => handleMouseEnter(project)}
              onMouseLeave={() => handleMouseLeave(project)}
            >
              <div
                className="flex items-center justify-center text-[#141414] transition-colors duration-300 group-hover:text-[#FF4D00] shrink-0"
                style={{ width: logoSize, height: logoSize }}
              >
                <project.SvgComponent />
              </div>
              <div className="font-['JetBrains_Mono'] text-[clamp(16px,1.35vw,26px)] font-bold leading-[1.04] tracking-[-0.025em] text-[#141414] text-center mt-1 transition-colors duration-300 group-hover:text-[#FF4D00] whitespace-pre-line max-md:text-[16px] max-md:mt-0.5">
                {project.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}