import { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router';
import { NavBar } from './NavBar';

interface ScaledSlideProps {
  children: ReactNode;
  mode?: 'lab' | 'studio';
}

export function ScaledSlide({ children, mode }: ScaledSlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Auto-detect mode if not provided
  const resolvedMode = mode || (
    location.pathname.startsWith('/projects') || location.pathname.startsWith('/shop')
      ? 'studio'
      : 'lab'
  );

  useEffect(() => {
    function scaleSlide() {
      const slide = slideRef.current;
      const container = containerRef.current;
      if (!slide || !container) return;

      const headerHeight = 61;
      const availableWidth = window.innerWidth;
      const availableHeight = window.innerHeight - headerHeight;
      const scaleX = availableWidth / 1920;
      const scaleY = availableHeight / 1080;
      const scale = Math.min(scaleX, scaleY);
      slide.style.transform = `scale(${scale})`;
      const scaledWidth = 1920 * scale;
      slide.style.marginLeft = ((availableWidth - scaledWidth) / 2) + 'px';
      slide.style.marginTop = '0px';
    }
    scaleSlide();
    window.addEventListener('resize', scaleSlide);
    return () => window.removeEventListener('resize', scaleSlide);
  }, []);

  return (
    <div className="bg-[#F8F8FD] overflow-hidden m-0 p-0 min-h-screen font-['JetBrains_Mono']">
      {/* Responsive header - outside the scaled container */}
      <div className="w-full relative">
        <NavBar mode={resolvedMode} />
        {/* Grey line 60px from top */}
        <div className="absolute left-0 right-0 top-[60px] h-px bg-[#D2D2D2]" />
      </div>

      {/* Scaled slide content */}
      <div ref={containerRef} className="relative" style={{ top: 0 }}>
        <div
          ref={slideRef}
          className="bg-[#F8F8FD] relative overflow-hidden"
          style={{ width: 1920, height: 1080, transformOrigin: 'top left' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
