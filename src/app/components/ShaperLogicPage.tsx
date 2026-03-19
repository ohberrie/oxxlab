import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ScaledSlide, useIsMobile } from './ScaledSlide';
import { PlayIcon } from './ProjectSVGs';
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
          DESIGN SELECTION
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
        className="absolute font-['JetBrains_Mono'] text-[#141414] font-bold leading-[27px]"
        style={{ left: 48, top: 144, fontSize: 76 }}
      >
        DESIGN SELECTION
      </h1>

      {/* Arrow */}
      <div className="absolute w-5 h-[18px]" style={{ left: 48, top: 334 }}>
        <PlayIcon />
      </div>

      {/* Menu */}
      <Link to="/projects/shaper/configure" className="absolute text-[#141414] text-[28px] font-bold leading-[27px] no-underline transition-opacity duration-300 hover:opacity-60 font-['JetBrains_Mono']" style={{ left: 53, top: 272 }}>configure</Link>
      <Link to="/projects/shaper/logic" className="absolute text-[#141414] text-[28px] font-bold leading-[27px] no-underline transition-opacity duration-300 hover:opacity-60 font-['JetBrains_Mono']" style={{ left: 85, top: 329 }}>logic</Link>

      {/* Research Origins — bottom-left */}
      <div className="absolute" style={{ left: 48, bottom: 55 }}>
        <CrossLinks label="Research Origins" links={researchOrigins} />
      </div>

      {/* Scrollable area */}
      <div className="absolute overflow-hidden" style={{ width: 1610, height: 980, top: 213, left: 310 }}>
        <div
          className="relative transition-transform duration-300"
          style={{ width: 1610, height: 3920, transform: `translateY(${scrollY}px)` }}
        >
          {/* Logic images row */}
          <div className="absolute" style={{ top: 174, left: -310, width: '100%', height: 309 }}>
            {logicImages.map((img, i) => (
              <div
                key={i}
                className="absolute rounded-2xl overflow-visible bg-transparent"
                style={{ width: 309, height: 309, left: [547, 1000, 1445][i] }}
              >
                <ImageWithFallback src={img} alt={`Logic ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* SITE box */}
          <div className="absolute bg-black/90 rounded" style={{ width: 100, height: 165, left: 939, top: 432 }} />
          <div className="absolute text-white text-[15px] font-bold text-center font-['JetBrains_Mono']" style={{ left: 971, top: 449 }}>SITE</div>
          <div className="absolute text-white text-[15px] font-light leading-5 font-['JetBrains_Mono']" style={{ left: 962, top: 481 }}>
            F: 1.5<br />M: 3.2<br />D: 2.5<br />V: 3.6<br />Ma: 2.1
          </div>

          {/* GOAL DESIGN box */}
          <div className="absolute bg-black/90 rounded" style={{ width: 140, height: 165, left: 1352, top: 432 }} />
          <div className="absolute text-white text-[15px] font-bold text-center font-['JetBrains_Mono']" style={{ left: 1373, top: 451 }}>GOAL DESIGN</div>
          <div className="absolute text-white text-[15px] font-light leading-5 font-['JetBrains_Mono']" style={{ left: 1395, top: 482 }}>
            F: 3.5<br />M: 2.8<br />D: 2.5<br />V: 1.4<br />Ma: 2.9
          </div>

          {/* Scroll image 2 */}
          <div
            className={`absolute bg-[#F8F8FD] transition-opacity duration-500 ${showImage2 ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: 468, height: 540, top: 1282, left: 606 }}
          >
            <ImageWithFallback src={logic2Img} alt="Logic 2" className="w-full h-full object-cover" />
          </div>

          {/* Scroll image 3 */}
          <div
            className={`absolute bg-[#F8F8FD] transition-opacity duration-500 ${showImage3 ? 'opacity-100' : 'opacity-0'}`}
            style={{ width: 1480, height: 1050, top: 2047, left: 194 }}
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
