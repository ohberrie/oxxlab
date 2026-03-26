import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { ScaledSlide, useIsMobile } from './ScaledSlide';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CrossLinks } from './CrossLinks';

const imageUrls = [
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr1.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr2.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr3.png',
];

const researchOrigins = [
  { label: 'Selection Logic', path: '/lab/selection-logic' },
  { label: 'Dense Field', path: '/lab/dense-field' },
  { label: 'Modular Fill', path: '/lab/modular-fill' },
];

function ShaperConfigureContent() {
  const isMobile = useIsMobile();
  const [sliderA, setSliderA] = useState(50);
  const [sliderB, setSliderB] = useState(50);
  const [sliderC, setSliderC] = useState(50);
  const [code, setCode] = useState('#0018475');
  const [imageIndex, setImageIndex] = useState(0);

  const updateVisualization = useCallback(() => {
    const randomCode = Math.floor(1000000 + Math.random() * 9000000);
    setCode('#' + randomCode.toString());
    setImageIndex(Math.floor(Math.random() * imageUrls.length));
  }, []);

  const handleSliderClick = (slider: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    if (slider === 'a') setSliderA(clamped);
    else if (slider === 'b') setSliderB(clamped);
    else if (slider === 'c') setSliderC(clamped);
    updateVisualization();
  };

  const sliders = [
    { key: 'a', label: 'parameter A', value: sliderA },
    { key: 'b', label: 'parameter B', value: sliderB },
    { key: 'c', label: 'parameter C', value: sliderC },
  ];

  if (isMobile) {
    return (
      <div className="px-5 pt-6 pb-10">
        <h1 className="font-['JetBrains_Mono'] text-[#141414] font-bold text-[36px] leading-[1.05] tracking-[-0.02em] mb-3">
          SHAPER
        </h1>

        <nav className="flex gap-6 mb-8 border-b border-[#141414]/10 pb-3">
          <Link to="/projects/shaper/configure" className="font-['JetBrains_Mono'] text-[14px] font-bold no-underline text-[#141414] flex items-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-[#FF4D00] shrink-0" />
            configure
          </Link>
          <Link to="/projects/shaper/logic" className="font-['JetBrains_Mono'] text-[14px] font-bold no-underline text-[#141414] opacity-35 hover:opacity-60 transition-opacity">
            logic
          </Link>
        </nav>

        <div className="w-full aspect-square max-w-[320px] bg-[#e8e8ed] flex items-center justify-center mb-8 overflow-hidden">
          <ImageWithFallback
            src={imageUrls[imageIndex]}
            alt="Transform visualization"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-8 mb-8">
          {sliders.map(s => (
            <div key={s.key}>
              <div className="font-['JetBrains_Mono'] text-[#141414] text-[12px] font-bold tracking-[2px] uppercase mb-3 opacity-50">{s.label}</div>
              <div className="relative h-[5px] bg-[#141414] cursor-pointer" onClick={(e) => handleSliderClick(s.key, e)}>
                <div className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[28px] bg-[#141414]" style={{ left: `calc(${s.value}% - 5px)` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center border-[1.5px] border-[#141414] h-[32px] max-w-[220px]">
          <span className="font-['JetBrains_Mono'] text-[#141414] text-[14px] font-extrabold tracking-[3px]">{code}</span>
        </div>

        <CrossLinks label="Research Origins" links={researchOrigins} />
      </div>
    );
  }

  // Desktop layout
  const desktopSliders = [
    { key: 'a', label: 'parameter A', value: sliderA, labelTop: 380, trackTop: 415 },
    { key: 'b', label: 'parameter B', value: sliderB, labelTop: 530, trackTop: 565 },
    { key: 'c', label: 'parameter C', value: sliderC, labelTop: 680, trackTop: 715 },
  ];

  return (
    <>
      <h1
        className="absolute font-['JetBrains_Mono'] text-[#141414] font-bold leading-[1]"
        style={{ left: 58, top: 95, fontSize: 64, letterSpacing: '-0.02em' }}
      >
        SHAPER
      </h1>

      {/* Menu */}
      <div className="absolute flex gap-10" style={{ left: 58, top: 190 }}>
        <Link to="/projects/shaper/configure" className="font-['JetBrains_Mono'] text-[20px] font-bold no-underline text-[#141414] flex items-center gap-2 transition-opacity duration-300 hover:opacity-60">
          <span className="w-[6px] h-[6px] rounded-full bg-[#FF4D00] shrink-0" />
          configure
        </Link>
        <Link to="/projects/shaper/logic" className="font-['JetBrains_Mono'] text-[20px] font-bold no-underline text-[#141414] opacity-25 transition-opacity duration-300 hover:opacity-60">
          logic
        </Link>
      </div>

      {/* Research Origins — bottom-left */}
      <div className="absolute" style={{ left: 58, bottom: 55 }}>
        <CrossLinks label="Research Origins" links={researchOrigins} />
      </div>

      {/* Center image */}
      <div className="absolute flex items-center justify-center overflow-hidden bg-[#F8F8FD]" style={{ width: 480, height: 480, left: 480, top: 290 }}>
        <ImageWithFallback
          src={imageUrls[imageIndex]}
          alt="Transform visualization"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Parameter sliders */}
      {desktopSliders.map(s => {
        const handleLeft = 1160 + (s.value / 100) * 468;
        return (
          <div key={s.key}>
            <div className="absolute text-[#141414] text-[13px] font-bold tracking-[3px] uppercase font-['JetBrains_Mono']" style={{ left: 1160, top: s.labelTop }}>
              {s.label}
            </div>
            <div className="absolute bg-[#141414]" style={{ left: 1160, top: s.trackTop, width: 480, height: 5 }} />
            <div
              className="absolute cursor-pointer"
              style={{ left: 1160, top: s.trackTop - 10, width: 480, height: 25 }}
              onClick={(e) => handleSliderClick(s.key, e)}
            />
            <div
              className="absolute bg-[#141414] cursor-ew-resize transition-colors duration-200 hover:bg-[#FF4D00]"
              style={{ left: handleLeft, top: s.trackTop - 16, width: 12, height: 36 }}
            />
          </div>
        );
      })}

      {/* Code display */}
      <div className="absolute flex items-center justify-center border-[1.5px] border-[#141414]" style={{ width: 260, height: 34, left: 1270, top: 840 }}>
        <span className="text-center text-[#141414] text-[18px] font-extrabold tracking-[4px] font-['JetBrains_Mono']">{code}</span>
      </div>
    </>
  );
}

export function ShaperConfigurePage() {
  return (
    <ScaledSlide>
      <ShaperConfigureContent />
    </ScaledSlide>
  );
}