import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { NavBar } from './NavBar';

// --- Data ---

interface FrameworkNode {
  id: string;
  label: string;
  tag: string;
  description: string;
  insideOxx: string;
  labLinks: { label: string; path: string }[];
  studioLinks: { label: string; path: string }[];
  objects: string[];
  connections: string[];
}

const frameworkNodes: FrameworkNode[] = [
  {
    id: 'dense-field',
    label: 'Dense Field',
    tag: 'Spatial System',
    description: 'Controls how concentrated or dispersed a form feels in space.',
    insideOxx: 'Used when shaping visual intensity, focus, and spatial rhythm.',
    labLinks: [
      { label: 'Dense Field', path: '/lab/dense-field' },
    ],
    studioLinks: [
      { label: 'Shaper', path: '/projects/shaper' },
    ],
    objects: ['OXX Density Object'],
    connections: ['modular-fill', 'layer-stack'],
  },
  {
    id: 'modular-fill',
    label: 'Modular Fill',
    tag: 'Form Logic',
    description: 'Builds larger form fields through repeated modular units.',
    insideOxx: 'Drives pattern generation and structural fill across compositions.',
    labLinks: [
      { label: 'Modular Fill', path: '/lab/modular-fill' },
    ],
    studioLinks: [
      { label: 'Shaper', path: '/projects/shaper' },
      { label: 'AIAA', path: '#' },
    ],
    objects: ['Pixel Grid Structure 03'],
    connections: ['dense-field', 'selection-logic'],
  },
  {
    id: 'layer-stack',
    label: 'Layer Stack',
    tag: 'Spatial Grammar',
    description: 'Organizes visual layers and dominance across spatial depth.',
    insideOxx: 'Defines how foreground and background relate in any composition.',
    labLinks: [
      { label: 'Layer Stack', path: '/lab/layer-stack' },
    ],
    studioLinks: [
      { label: 'MAMA Opening VCR', path: '#' },
      { label: 'AIAA', path: '#' },
    ],
    objects: ['Layer Stack Print'],
    connections: ['dense-field', 'selection-logic'],
  },
  {
    id: 'selection-logic',
    label: 'Selection Logic',
    tag: 'Decision Logic',
    description: 'Filters possible outcomes under design constraints and intent.',
    insideOxx: 'The engine behind algorithmic decision-making in form generation.',
    labLinks: [
      { label: 'Selection Logic', path: '/lab/selection-logic' },
    ],
    studioLinks: [
      { label: 'Shaper presets', path: '/projects/shaper' },
    ],
    objects: ['Form Strategy Notebook'],
    connections: ['modular-fill', 'layer-stack'],
  },
];

// Node positions (percentage-based for the graph canvas)
const nodePositions: Record<string, { x: number; y: number }> = {
  'dense-field': { x: 25, y: 30 },
  'modular-fill': { x: 70, y: 25 },
  'layer-stack': { x: 20, y: 70 },
  'selection-logic': { x: 68, y: 72 },
};

// --- Component ---

type ViewMode = 'lab' | 'studio';

export function FrameworkPage() {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('lab');
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });

  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasSize({ w: rect.width, h: rect.height });
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  const selected = frameworkNodes.find((n) => n.id === selectedNode) || null;
  const hovered = hoveredNode;

  const getNodeState = (id: string) => {
    if (selectedNode === id) return 'selected';
    if (hoveredNode === id) return 'hover';
    if (selectedNode && selected?.connections.includes(id)) return 'connected';
    if (selectedNode) return 'dimmed';
    return 'idle';
  };

  const getLineState = (from: string, to: string) => {
    if (!selectedNode) return 'default';
    if (selectedNode === from || selectedNode === to) {
      const other = selectedNode === from ? to : from;
      if (selected?.connections.includes(other)) return 'highlighted';
    }
    return 'dimmed';
  };

  // Build unique connection lines
  const lines: { from: string; to: string }[] = [];
  const seen = new Set<string>();
  for (const node of frameworkNodes) {
    for (const conn of node.connections) {
      const key = [node.id, conn].sort().join('-');
      if (!seen.has(key)) {
        seen.add(key);
        lines.push({ from: node.id, to: conn });
      }
    }
  }

  const getPixelPos = (id: string) => {
    const p = nodePositions[id];
    return { x: (p.x / 100) * canvasSize.w, y: (p.y / 100) * canvasSize.h };
  };

  const accent = '#FF1E00';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <header className="relative z-20">
        <NavBar mode="lab" dark />
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Intro + Toggle */}
        <div className="px-[58px] pt-10 pb-6 flex items-end justify-between max-md:flex-col max-md:items-start max-md:gap-4 max-md:px-6">
          <div>
            <h1 className="font-['DM_Sans'] text-[34px] font-semibold tracking-[-0.03em] leading-[1.1] max-md:text-[28px]" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Framework
            </h1>
            <p className="font-['DM_Sans'] text-[14px] mt-2 leading-[1.5] max-w-[520px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Explore how research systems, form strategies, and studio works connect inside OXX Lab.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 shrink-0 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setViewMode('lab')}
              className={`font-['JetBrains_Mono'] text-[11px] font-bold tracking-[0.08em] uppercase px-5 py-2 transition-all duration-250 cursor-pointer border-none rounded-lg`}
              style={{
                background: viewMode === 'lab' ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: viewMode === 'lab' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                boxShadow: viewMode === 'lab' ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              Lab
            </button>
            <button
              onClick={() => setViewMode('studio')}
              className={`font-['JetBrains_Mono'] text-[11px] font-bold tracking-[0.08em] uppercase px-5 py-2 transition-all duration-250 cursor-pointer border-none rounded-lg`}
              style={{
                background: viewMode === 'studio' ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: viewMode === 'studio' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                boxShadow: viewMode === 'studio' ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              Studio
            </button>
          </div>
        </div>

        {/* Graph + Panel */}
        <div className="flex-1 flex min-h-0 px-[58px] pb-10 gap-6 max-md:flex-col max-md:px-6">
          {/* Strategy Graph Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative min-h-[400px] rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.02)', boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.2)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedNode(null);
            }}
          >
            {/* SVG Connection Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {lines.map(({ from, to }) => {
                const p1 = getPixelPos(from);
                const p2 = getPixelPos(to);
                const state = getLineState(from, to);
                return (
                  <line
                    key={`${from}-${to}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={state === 'highlighted' ? accent : 'rgba(255,255,255,0.5)'}
                    strokeOpacity={state === 'dimmed' ? 0.06 : state === 'highlighted' ? 0.6 : 0.12}
                    strokeWidth={state === 'highlighted' ? 1.5 : 1}
                    strokeDasharray={state === 'highlighted' ? 'none' : '4 4'}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {frameworkNodes.map((node) => {
              const pos = nodePositions[node.id];
              const state = getNodeState(node.id);
              const isSelected = state === 'selected';
              const isConnected = state === 'connected';
              const isDimmed = state === 'dimmed';
              const isHover = state === 'hover';

              return (
                <div
                  key={node.id}
                  className="absolute flex flex-col items-center cursor-pointer select-none"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 10 : isHover ? 5 : 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(selectedNode === node.id ? null : node.id);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Node dot */}
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: isSelected ? 14 : isHover ? 12 : 10,
                      height: isSelected ? 14 : isHover ? 12 : 10,
                      backgroundColor: isSelected || isConnected ? accent : 'rgba(255,255,255,0.6)',
                      opacity: isDimmed ? 0.15 : 1,
                      boxShadow: isSelected ? `0 0 0 4px rgba(255,30,0,0.15)` : 'none',
                    }}
                  />
                  {/* Label */}
                  <span
                    className="font-['JetBrains_Mono'] font-bold text-[12px] tracking-[-0.01em] mt-2 whitespace-nowrap transition-all duration-300"
                    style={{
                      color: isSelected || isConnected ? accent : 'rgba(255,255,255,0.7)',
                      opacity: isDimmed ? 0.2 : 1,
                    }}
                  >
                    {node.label}
                  </span>
                  {/* Tag */}
                  <span
                    className="font-['JetBrains_Mono'] text-[9px] tracking-[0.06em] uppercase mt-0.5 whitespace-nowrap transition-all duration-300"
                    style={{
                      color: isSelected ? accent : 'rgba(255,255,255,0.5)',
                      opacity: isDimmed ? 0.1 : 0.35,
                    }}
                  >
                    {node.tag}
                  </span>
                </div>
              );
            })}

            {/* Empty state hint */}
            {!selectedNode && !hovered && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-['JetBrains_Mono'] text-[11px] tracking-[0.04em]" style={{ color: 'rgba(255,255,255,0.15)' }}>
                Select a strategy node to explore related research, projects, and objects.
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div
            className={`transition-all duration-300 overflow-y-auto rounded-2xl ${
              selected
                ? 'w-[340px] max-md:w-full opacity-100 p-8'
                : 'w-0 max-md:h-0 opacity-0 p-0 overflow-hidden'
            }`}
            style={{
              background: selected ? 'rgba(255,255,255,0.03)' : 'transparent',
              boxShadow: selected ? '0 0 0 1px rgba(255,255,255,0.04), 0 2px 12px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {selected && (
              <div className="flex flex-col gap-6 min-w-[290px]">
                {/* Header */}
                <div>
                  <h2 className="font-['DM_Sans'] text-[20px] font-bold tracking-[-0.02em] leading-[1.2]" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {selected.label}
                  </h2>
                  <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.08em] uppercase mt-1 inline-block" style={{ color: accent }}>
                    {selected.tag}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <p className="font-['DM_Sans'] text-[12px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {selected.description}
                  </p>
                </div>

                {/* Inside OXX */}
                <div>
                  <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Inside OXX
                  </h3>
                  <p className="font-['JetBrains_Mono'] text-[11px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {selected.insideOxx}
                  </p>
                </div>

                {/* Context-shifted content */}
                {viewMode === 'lab' ? (
                  <>
                    {/* Lab Links first */}
                    <div>
                      <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Related Research
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selected.labLinks.map((link) => (
                          <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className="font-['JetBrains_Mono'] text-[12px] text-left bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Studio Links below */}
                    <div>
                      <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Studio Applications
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selected.studioLinks.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => link.path !== '#' && navigate(link.path)}
                            className={`font-['JetBrains_Mono'] text-[12px] text-left bg-transparent border-none p-0 transition-colors duration-200 ${
                              link.path !== '#'
                                ? 'cursor-pointer'
                                : 'cursor-default'
                            }`}
                            style={{
                              color: link.path !== '#' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
                                                          }}
                            onMouseEnter={(e) => { if (link.path !== '#') e.currentTarget.style.color = accent; }}
                            onMouseLeave={(e) => { if (link.path !== '#') e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Studio first */}
                    <div>
                      <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Studio Work
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selected.studioLinks.map((link) => (
                          <button
                            key={link.label}
                            onClick={() => link.path !== '#' && navigate(link.path)}
                            className={`font-['JetBrains_Mono'] text-[12px] text-left bg-transparent border-none p-0 transition-colors duration-200 ${
                              link.path !== '#'
                                ? 'cursor-pointer'
                                : 'cursor-default'
                            }`}
                            style={{
                              color: link.path !== '#' ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
                                                          }}
                            onMouseEnter={(e) => { if (link.path !== '#') e.currentTarget.style.color = accent; }}
                            onMouseLeave={(e) => { if (link.path !== '#') e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Objects */}
                    <div>
                      <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Objects
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selected.objects.map((obj) => (
                          <span
                            key={obj}
                            className="font-['JetBrains_Mono'] text-[12px]"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                          >
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Research Origins below */}
                    <div>
                      <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Research Origins
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {selected.labLinks.map((link) => (
                          <button
                            key={link.path}
                            onClick={() => navigate(link.path)}
                            className="font-['JetBrains_Mono'] text-[12px] text-left bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = accent; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Objects (lab mode only) */}
                {viewMode === 'lab' && (
                  <div>
                    <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Related Objects
                    </h3>
                    <div className="flex flex-col gap-1.5">
                      {selected.objects.map((obj) => (
                        <span
                          key={obj}
                          className="font-['JetBrains_Mono'] text-[12px]"
                          style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected nodes */}
                <div>
                  <h3 className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Connected Systems
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {selected.connections.map((connId) => {
                      const connNode = frameworkNodes.find((n) => n.id === connId);
                      if (!connNode) return null;
                      return (
                        <button
                          key={connId}
                          onClick={() => setSelectedNode(connId)}
                          className="font-['JetBrains_Mono'] text-[12px] hover:opacity-70 transition-opacity duration-200 text-left bg-transparent border-none cursor-pointer p-0"
                          style={{ color: accent }}
                        >
                          {connNode.label}
                          <span className="text-[9px] opacity-50 ml-2 uppercase tracking-[0.06em]">
                            {connNode.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
