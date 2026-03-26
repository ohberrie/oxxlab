import { useEffect, useRef, useState, createContext, useContext, ReactNode } from 'react';
import { useLocation } from 'react-router';
import { NavBar } from './NavBar';

const MobileContext = createContext(false);
export const useIsMobile = () => useContext(MobileContext);

interface ScaledSlideProps {
  children: ReactNode;
  mode?: 'lab' | 'studio';
  dark?: boolean;
}

export function ScaledSlide({ children, mode, dark = false }: ScaledSlideProps) {
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

  const bg = dark ? '#0a0a0a' : '#F8F8FD';
  const dividerColor = dark ? 'rgba(255,255,255,0.06)' : '#D2D2D2';

  return (
    <MobileContext.Provider value={isMobile}>
      <div className="overflow-hidden m-0 p-0 min-h-screen font-['JetBrains_Mono']" style={{ background: bg }}>
        <div className="w-full relative">
          <NavBar mode={resolvedMode} dark={dark} />
          <div className="absolute left-0 right-0 top-[60px] h-px" style={{ background: dividerColor }} />
        </div>

        <div ref={containerRef} className="relative" style={{ top: 0 }}>
          <div
            ref={slideRef}
            className={`relative ${isMobile ? 'overflow-y-auto' : 'overflow-hidden'}`}
            style={{
              background: bg,
              ...(isMobile ? { width: '100%', minHeight: '100vh' } : { width: 1920, height: 1080, transformOrigin: 'top left' }),
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </MobileContext.Provider>
  );
}
