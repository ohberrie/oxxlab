import { useEffect, useRef, useState, createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router';
import { NavBar } from './NavBar';

const MobileContext = createContext(false);
export const useIsMobile = () => useContext(MobileContext);

interface ScaledSlideProps {
  children: ReactNode;
  mode?: 'lab' | 'studio';
}

export function ScaledSlide({ children, mode }: ScaledSlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const resolvedMode = mode || (
    location.pathname.startsWith('/projects') || location.pathname.startsWith('/shop')
      ? 'studio'
      : 'lab'
  );

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const slide = slideRef.current;
        if (slide) {
          slide.style.transform = 'none';
          slide.style.marginLeft = '0';
        }
        return;
      }

      const slide = slideRef.current;
      if (!slide) return;
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
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <MobileContext.Provider value={isMobile}>
      <div className="bg-[#F8F8FD] overflow-hidden m-0 p-0 min-h-screen font-['JetBrains_Mono']">
        <div className="w-full relative">
          <NavBar mode={resolvedMode} />
          <div className="absolute left-0 right-0 top-[60px] h-px bg-[#D2D2D2]" />
        </div>

        <div ref={containerRef} className="relative" style={{ top: 0 }}>
          <div
            ref={slideRef}
            className={`bg-[#F8F8FD] relative ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}
            style={isMobile ? { width: '100%', minHeight: '100vh' } : { width: 1920, height: 1080, transformOrigin: 'top left' }}
          >
            {children}
          </div>
        </div>
      </div>
    </MobileContext.Provider>
  );
}
