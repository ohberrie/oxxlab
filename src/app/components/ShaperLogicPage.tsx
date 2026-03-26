import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ScaledSlide, useIsMobile } from './ScaledSlide';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CrossLinks } from './CrossLinks';

const logicImages = [
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/logic1_1.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/logic1_2.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/logic1_3.png',
];

const logic2Img = 'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/logic2.png';
const logic3Img = 'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/logic3.png';

const researchOrigins = [
  { label: 'Selection Logic', path: '/lab/selection-logic' },
  { label: 'Dense Field', path: '/lab/dense-field' },
  { label: 'Modular Fill', path: '/lab/modular-fill' },
];

function ShaperLogicContent() {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const maxScroll = -2940;

  useEffect(() => {
    if (isMobile) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScrollY(prev => Math.max(maxScroll, Math.min(0, prev - e.deltaY)));
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setScrollY(prev => Math.max(maxScroll, prev - 50));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setScrollY(prev => Math.min(0, prev + 50));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobile]);

  const showImage2 = Math.abs(scrollY) >= 980;
  const showImage3 = Math.abs(scrollY) >= 1960;

  if (isMobile) {
    return (
      <div className="px-5 pt-6 pb-10">
        <h1 className="font-['JetBrains_Mono'] text-[#141414] font-bold text-[36px] leading-[1.05] tracking-[-0.02em] mb-3">
          SHAPER
        </h1>

        <nav className="flex gap-6 mb-8 border-b border-[#141414]/10 pb-3">
          <Link to="/projects/shaper/configure" className="font-['JetBrains_Mono'] text-[14px] font-bold no-underline text-[#141414] opacity-35 hover:opacity-60 transition-opacity">
            configure
          </Link>
          <Link to="/projects/shaper/logic" className="font-['JetBrains_Mono'] text-[14px] font-bold no-underline text-[#141414] flex items-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-[#FF4D00] shrink-0" />
            logic
          </Link>
        </nav>

        <div className="flex flex-col gap-6 mb-8">
          <div className="grid grid-cols-3 gap-3">
            {logicImages.map((img, i) => (
              <div key={i} className="aspect-square bg-[#e8e8ed] flex items-center justify-center rounded-lg overflow-hidden">
                <ImageWithFallback src={img} alt={`Logic ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <div className="bg-black/90 text-white px-4 py-2 rounded text-[12px] font-bold font-['JetBrains_Mono']">SITE</div>
            <div className="bg-black/90 text-white px-4 py-2 rounded text-[12px] font-bold font-['JetBrains_Mono']">GOAL DESIGN</div>
          </div>
          <div className="w-full aspect-[4/5] bg-[#e8e8ed] flex items-center justify-center rounded-lg overflow-hidden">
            <ImageWithFallback src={logic2Img} alt="Logic 2" className="w-full h-full object-cover" />
          </div>
          <div className="w-full aspect-[16/11] bg-[#e8e8ed] flex items-center justify-center rounded-lg overflow-hidden">
            <ImageWithFallback src={logic3Img} alt="Logic 3" className="w-full h-full object-cover" />
          </div>
        </div>

        <CrossLinks label="Research Origins" links={researchOrigins} />
      </div>
    );
  }

  // Desktop layout
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
        <Link to="/projects/shaper/configure" className="font-['JetBrains_Mono'] text-[20px] font-bold no-underline text-[#141414] opacity-25 transition-opacity duration-300 hover:opacity-60">
          configure
        </Link>
        <Link to="/projects/shaper/logic" className="font-['JetBrains_Mono'] text-[20px] font-bold no-underline text-[#141414] flex items-center gap-2 transition-opacity duration-300 hover:opacity-60">
          <span className="w-[6px] h-[6px] rounded-full bg-[#FF4D00] shrink-0" />
          logic
        </Link>
      </div>

      {/* Research Origins — bottom-left */}
      <div className="absolute" style={{ left: 58, bottom: 55 }}>
        <CrossLinks label="Research Origins" links={researchOrigins} />
      </div>

      {/* Scrollable area */}
      <div className="absolute overflow-hidden" style={{ width: 1560, height: 730, top: 290, left: 320 }}>
        <div
          className="relative transition-transform duration-300"
          style={{ width: 1560, height: 3920, transform: `translateY(${scrollY}px)` }}
        >
          {/* Logic images row */}
          <div className="absolute flex gap-[6px]" style={{ top: 40, left: 80 }}>
            {logicImages.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden bg-transparent"
                style={{ width: 300, height: 300 }}
              >
                <ImageWithFallback src={img} alt={`Logic ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* SITE tag */}
          <div className="absolute bg-black/90 rounded flex items-center justify-center" style={{ width: 100, height: 44, left: 380, top: 390 }}>
            <span className="text-white text-[13px] font-bold font-['JetBrains_Mono']">SITE</span>
          </div>

          {/* GOAL DESIGN tag */}
          <div className="absolute bg-black/90 rounded flex items-center justify-center" style={{ width: 140, height: 44, left: 700, top: 390 }}>
            <span className="text-white text-[13px] font-bold font-['JetBrains_Mono']">GOAL DESIGN</span>
          </div>

          {/* Scroll image 2 */}
          <div
            className={`absolute bg-[#F8F8FD] transition-opacity duration-500 ${showImage2 ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: 460, height: 530, top: 1100, left: 200 }}
          >
            <ImageWithFallback src={logic2Img} alt="Logic 2" className="w-full h-full object-cover" />
          </div>

          {/* Scroll image 3 */}
          <div
            className={`absolute bg-[#F8F8FD] transition-opacity duration-500 ${showImage3 ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: 1200, height: 850, top: 1900, left: 100 }}
          >
            <ImageWithFallback src={logic3Img} alt="Logic 3" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </>
  );
}

export function ShaperLogicPage() {
  return (
    <ScaledSlide>
      <ShaperLogicContent />
    </ScaledSlide>
  );
}