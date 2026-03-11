import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { ScaledSlide } from './ScaledSlide';
import { PlayIcon } from './ProjectSVGs';
import { ImageWithFallback } from './figma/ImageWithFallback';

const imageUrls = [
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr1.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr2.png',
  'https://raw.githubusercontent.com/ohberrie/oxxlab/main/assets/img/tr3.png',
];

export function ShaperConfigurePage() {
  const [sliderA, setSliderA] = useState(50);
  const [sliderB, setSliderB] = useState(50);
  const [sliderC, setSliderC] = useState(50);
  const [code, setCode] = useState('#0018475');
  const [imageIndex, setImageIndex] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);

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
    { key: 'a', label: 'parameter A', value: sliderA, lineTop: 421.5, labelTop: 356, handleTop: 402, trackTop: 421.5 },
    { key: 'b', label: 'parameter B', value: sliderB, lineTop: 580.5, labelTop: 515, handleTop: 561, trackTop: 580.5 },
    { key: 'c', label: 'parameter C', value: sliderC, lineTop: 740.5, labelTop: 675, handleTop: 721, trackTop: 740.5 },
  ];

  return (
    <ScaledSlide>
      <h1
        className="absolute font-['JetBrains_Mono'] text-[#141414] font-bold leading-[27px]"
        style={{ left: 48, top: 144, fontSize: 76 }}
      >
        DESIGN SELECTION
      </h1>

      {/* Arrow */}
      <div className="absolute w-5 h-[18px]" style={{ left: 48, top: 277 }}>
        <PlayIcon />
      </div>

      {/* Menu */}
      <Link to="/projects/shaper/configure" className="absolute text-[#141414] text-[28px] font-bold leading-[27px] no-underline transition-opacity duration-300 hover:opacity-60 font-['JetBrains_Mono']" style={{ left: 85, top: 272 }}>configure</Link>
      <Link to="/projects/shaper/logic" className="absolute text-[#141414] text-[28px] font-bold leading-[27px] no-underline transition-opacity duration-300 hover:opacity-60 font-['JetBrains_Mono']" style={{ left: 53, top: 329 }}>logic</Link>

      {/* Center image */}
      <div className="absolute flex items-center justify-center overflow-hidden bg-[#F8F8FD]" style={{ width: 500, height: 500, left: 477, top: 347 }}>
        <ImageWithFallback
          src={imageUrls[imageIndex]}
          alt="Transform visualization"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Parameter sliders */}
      {sliders.map(s => {
        const handleLeft = 1204 + (s.value / 100) * 499;
        return (
          <div key={s.key}>
            {/* Label */}
            <div className="absolute text-[#141414] text-[24px] font-bold leading-[27px] tracking-[4.8px] font-['JetBrains_Mono']" style={{ left: 1204, top: s.labelTop }}>
              {s.label}
            </div>
            {/* Line */}
            <div className="absolute bg-[#141414]" style={{ left: 1204, top: s.lineTop, width: 514, height: 7 }} />
            {/* Click track */}
            <div
              className="absolute cursor-pointer"
              style={{ left: 1204, top: s.trackTop - 10, width: 514, height: 27 }}
              onClick={(e) => handleSliderClick(s.key, e)}
            />
            {/* Handle */}
            <div
              className="absolute bg-[#141414] cursor-ew-resize transition-colors duration-200 hover:bg-[#FF4D00]"
              style={{ left: handleLeft, top: s.handleTop, width: 15, height: 42 }}
            />
          </div>
        );
      })}

      {/* Code display */}
      <div className="absolute flex items-center justify-center border-[1.5px] border-[#141414]" style={{ width: 287, height: 36, left: 1305, top: 857 }}>
        <span className="text-center text-[#141414] text-[24px] font-extrabold leading-[27px] tracking-[4.8px] font-['JetBrains_Mono']">{code}</span>
      </div>

      {/* Description */}
      
    </ScaledSlide>
  );
}