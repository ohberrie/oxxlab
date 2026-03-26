import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { ScaledSlide } from './ScaledSlide';
import { PlayIcon } from './ProjectSVGs';

const tooltipTexts: Record<string, string> = {
  'up_poly': 'explanation of this parameter',
  'div_st': 'explanation of this parameter explanation of this parameter',
  'srf/depth': 'explanation of this parameter',
  'rec/cir': 'explanation of this parameter explanation of this parameter explanation of this parameter',
  'perf/dyna': 'explanation of this parameter',
  'div_module_count': 'explanation of this parameter explanation of this parameter',
  'plane_st': 'explanation of this parameter',
  'btm_poly': 'explanation of this parameter explanation of this parameter explanation of this parameter',
  'solid_depth': 'explanation of this parameter explanation of this parameter',
};

const sliderPresets: Record<number, Record<string, number>> = {
  1: { f: 85.2, m: 23.7, d: 67.4, v: 91.3 },
  2: { f: 42.8, m: 78.5, d: 31.2, v: 56.9 },
  3: { f: 68.1, m: 45.3, d: 89.7, v: 12.6 },
  4: { f: 29.4, m: 61.8, d: 52.3, v: 77.5 },
  5: { f: 73.9, m: 38.2, d: 84.6, v: 45.1 },
};

const originalValues = { f: 73.6, m: 32.6, d: 79.1, v: 57.4 };

interface ProcessTag {
  label: string;
  x: number;
  y: number;
  color: 'gray' | 'dark-gray' | 'black';
}

const processTags: ProcessTag[] = [
  { label: 'up_poly', x: 737, y: 109, color: 'gray' },
  { label: 'div_st', x: 888, y: 189, color: 'gray' },
  { label: 'srf/depth', x: 771, y: 333, color: 'black' },
  { label: 'rec/cir', x: 1205, y: 325, color: 'gray' },
  { label: 'perf/dyna', x: 1128, y: 38, color: 'dark-gray' },
  { label: 'div_module_count', x: 1253, y: 177, color: 'black' },
  { label: 'plane_st', x: 1454, y: 423, color: 'dark-gray' },
  { label: 'btm_poly', x: 850, y: 496, color: 'gray' },
  { label: 'rec/cir', x: 602, y: 578, color: 'gray' },
  { label: 'solid_depth', x: 797, y: 655, color: 'black' },
  { label: 'MID_POLY', x: 1680, y: 120, color: 'black' },
  { label: 'BTM_SC', x: 1920, y: 45, color: 'gray' },
  { label: 'MID_SC', x: 2150, y: 180, color: 'dark-gray' },
  { label: 'UP_SC', x: 1750, y: 280, color: 'gray' },
  { label: 'LOFT_ST', x: 2380, y: 90, color: 'black' },
  { label: 'G1', x: 2050, y: 340, color: 'dark-gray' },
  { label: 'GR1', x: 1850, y: 420, color: 'black' },
  { label: 'G2', x: 2280, y: 250, color: 'gray' },
  { label: 'GR2', x: 2480, y: 380, color: 'dark-gray' },
  { label: 'Z_G1', x: 1980, y: 520, color: 'gray' },
  { label: 'Z_GR1', x: 2600, y: 180, color: 'black' },
  { label: 'PLANAR/DYNA/CIR/CLOSED', x: 2750, y: 450, color: 'dark-gray' },
  { label: 'CRV_CTRL_PTS', x: 2200, y: 580, color: 'black' },
  { label: 'BOUNCY_SOLVER', x: 2900, y: 320, color: 'gray' },
  { label: 'WAVE_NUM', x: 3150, y: 150, color: 'dark-gray' },
  { label: 'CRV_EXTRUDE', x: 3380, y: 260, color: 'gray' },
  { label: 'GEO_ST', x: 3050, y: 480, color: 'black' },
  { label: 'GEO_VAR', x: 3280, y: 550, color: 'dark-gray' },
  { label: 'PLANE_ST', x: 3500, y: 380, color: 'black' },
  { label: 'DIV_VAR', x: 3650, y: 120, color: 'gray' },
  { label: 'ARRAY_VAR', x: 3450, y: 620, color: 'dark-gray' },
  { label: 'ORG_VAR', x: 3780, y: 450, color: 'gray' },
];

const tagColorClass: Record<string, string> = {
  gray: 'bg-[#D2D2D2] text-[#141414]',
  'dark-gray': 'bg-[#7C7B7B] text-white',
  black: 'bg-[#141414] text-white',
};

const numberedPoints = [
  { num: 1, x: 494, y: 193, dotX: 516, dotY: 206 },
  { num: 2, x: 542, y: 234, dotX: 567, dotY: 247 },
  { num: 3, x: 570, y: 298, dotX: 594, dotY: 311 },
  { num: 4, x: 542, y: 364, dotX: 567, dotY: 377 },
  { num: 5, x: 494, y: 403, dotX: 516, dotY: 418 },
];

export function ShaperFormStrategyPage() {
  const [sliderValues, setSliderValues] = useState(originalValues);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [tooltip, setTooltip] = useState<{ visible: boolean; text: string; x: number; y: number }>({
    visible: false, text: '', x: 0, y: 0,
  });
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const maxScroll = -2415;

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScrollX(prev => Math.max(maxScroll, Math.min(0, prev - e.deltaY * 2)));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleNumberClick = (num: number) => {
    setActiveNumber(num);
    const preset = sliderPresets[num];
    if (preset) {
      setSliderValues({ f: preset.f, m: preset.m, d: preset.d, v: preset.v });
    }
  };

  const handleStyleSelClick = () => {
    setActiveNumber(null);
    setSliderValues(originalValues);
  };

  const fmdvItems = [
    { key: 'f', label: 'F', top: 159 },
    { key: 'm', label: 'M', top: 228 },
    { key: 'd', label: 'D', top: 297 },
    { key: 'v', label: 'V', top: 366 },
  ] as const;

  return (
    <ScaledSlide>
      <h1
        className="absolute font-['JetBrains_Mono'] text-[#141414] font-bold leading-[1]"
        style={{ left: 58, top: 100, fontSize: 64, letterSpacing: '-0.02em' }}
      >
        DESIGN SELECTION
      </h1>

      {/* Menu */}
      {[
        { label: 'intent', path: '/lab/design-selection/intent', active: false },
        { label: 'form strategy', path: '/lab/design-selection/form-strategy', active: true },
        { label: 'experiment', path: '/lab/design-selection/experiment', active: false },
        { label: 'observation', path: '/lab/design-selection/observation', active: false },
      ].map((item, index) => {
        const top = 340 + index * 52;
        const left = item.active ? 90 : 60;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`absolute text-[20px] font-bold leading-[1] no-underline transition-all duration-300 hover:opacity-60 font-['JetBrains_Mono'] ${
              item.active ? 'text-[#141414]' : 'text-[#141414] opacity-25'
            }`}
            style={{ left, top }}
          >
            {item.label}
          </Link>
        );
      })}
      {/* Play icon for active item */}
      <div className="absolute w-[16px] h-[14px] text-[#141414]" style={{ left: 60, top: 341 }}>
        <PlayIcon />
      </div>

      {/* Scrollable area */}
      <div className="absolute overflow-hidden" style={{ width: 1480, height: 830, top: 180, left: 380 }}>
        <div
          ref={scrollContentRef}
          className="relative h-full transition-transform duration-300"
          style={{ width: 4025, transform: `translateX(${scrollX}px)` }}
        >
          {/* Process container box */}
          <div className="absolute rounded-[10px] border-[1.5px] border-[#2E2C2D]" style={{ left: 1, top: 123, width: 219, height: 307 }} />

          {/* FMDV sliders */}
          {fmdvItems.map(item => (
            <div key={item.key}>
              <div className="absolute text-center text-[#141414] text-[28px] font-extrabold tracking-[5.6px] font-['JetBrains_Mono']" style={{ left: 13, top: item.top, width: 43 }}>
                {item.label}
              </div>
              <div className="absolute border border-[#141414] bg-[#F8F8FD] cursor-pointer" style={{ left: 63, top: item.top, width: 129, height: 30 }}>
                <div className="h-full bg-[#141414] transition-[width] duration-300" style={{ width: `${sliderValues[item.key]}%` }} />
              </div>
            </div>
          ))}

          {/* Connection line + dot + style_sel */}
          <div className="absolute bg-[#2E2C2D]" style={{ left: 220, top: 314, width: 57, height: 1.5 }} />
          <div className="absolute w-2 h-2 rounded-full bg-[#2E2C2D]" style={{ left: 273, top: 311 }} />
          <div
            className="absolute bg-[#141414] flex items-center cursor-pointer z-10 hover:opacity-80"
            style={{ left: 295, top: 294, width: 237, height: 42, paddingLeft: 67 }}
            onClick={handleStyleSelClick}
          >
            <span className="text-[#F8F8FD] text-[20px] font-bold leading-[27px] font-['JetBrains_Mono']">style_sel</span>
          </div>

          {/* Numbered points */}
          {numberedPoints.map(pt => (
            <div key={pt.num}>
              <div
                className="absolute text-[#040404] font-bold cursor-pointer z-10 select-none hover:opacity-70 font-['JetBrains_Mono']"
                style={{ left: pt.x, top: pt.y, fontSize: 25.9 }}
                onClick={() => handleNumberClick(pt.num)}
              >
                {pt.num}
              </div>
              <div className="absolute w-2 h-2 rounded-full bg-[#141414]" style={{ left: pt.dotX, top: pt.dotY }} />
            </div>
          ))}

          {/* Process tags */}
          {processTags.map((tag, i) => (
            <div
              key={`${tag.label}-${i}`}
              className={`absolute flex items-center justify-center cursor-pointer whitespace-nowrap transition-opacity duration-300 hover:opacity-70 z-[2] font-['JetBrains_Mono'] text-[20px] font-normal ${tagColorClass[tag.color]}`}
              style={{
                left: tag.x,
                top: tag.y,
                height: 42,
                paddingLeft: 50,
                paddingRight: 50,
                opacity: activeNumber !== null ? 0.3 : 1,
              }}
              onMouseEnter={(e) => {
                const text = tooltipTexts[tag.label] || 'explanation of this parameter';
                setTooltip({ visible: true, text, x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
              }}
              onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            >
              {tag.label}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-[#FF6726] p-5 max-w-[250px] z-[100] pointer-events-none"
          style={{ left: tooltip.x / (window.innerWidth / 1920), top: tooltip.y / (window.innerHeight / 1080) }}
        >
          <div className="text-black text-[15px] font-normal leading-[21px] break-words font-['JetBrains_Mono']">
            {tooltip.text}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="absolute text-[#141414] text-[16px] font-bold leading-[21px] tracking-[3.2px] font-['JetBrains_Mono']" style={{ width: 243, left: 58, top: 857 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed urna erat, fermentum vel arcu
      </div>
    </ScaledSlide>
  );
}
