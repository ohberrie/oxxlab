import { Link, useLocation, useSearchParams } from 'react-router';
import { OxxUnifiedLogo } from './OxxUnifiedLogo';

interface NavBarProps {
  mode?: 'lab' | 'studio';
}

export function NavBar({ mode }: NavBarProps = {}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine studio vs lab mode
  const autoStudio = location.pathname.startsWith('/projects') || location.pathname.startsWith('/shop');
  const aboutCtx = searchParams.get('ctx');
  const isStudio = mode === 'studio' || (mode !== 'lab' && (autoStudio || (location.pathname.startsWith('/about') && aboutCtx === 'studio')));

  const isLabActive = location.pathname.startsWith('/lab');
  const isNotesActive = location.pathname.startsWith('/notes');
  const isFrameworkActive = location.pathname.startsWith('/framework');
  const isProjectsActive = location.pathname.startsWith('/projects');
  const isShopActive = location.pathname.startsWith('/shop');
  const isAboutActive = location.pathname.startsWith('/about');

  const aboutLink = isStudio ? '/about?ctx=studio' : '/about?ctx=lab';

  return (
    <div className="w-full">
      <nav className="flex justify-between items-center px-4 pt-4 z-20">
        <div className="block relative">
          <OxxUnifiedLogo isStudio={isStudio} />
        </div>
        <div className="flex gap-8 max-md:gap-5">
          {isStudio ? (
            <>
              <Link
                to="/projects"
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                Projects
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isProjectsActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
              <Link
                to="/shop"
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                Shop
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isShopActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
              <Link
                to={aboutLink}
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                About
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isAboutActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/lab"
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                Archive
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isLabActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
              <Link
                to="/notes"
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                Notes
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isNotesActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '90%' }}
                />
              </Link>
              <Link
                to="/framework"
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                Framework
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isFrameworkActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
              <Link
                to={aboutLink}
                className="nav-header-link font-['JetBrains_Mono'] font-bold text-[14px] text-[#141414] no-underline leading-[27px] max-md:text-[12px] relative inline-block group"
              >
                About
                <span
                  className={`absolute bottom-[3px] left-1/2 -translate-x-1/2 h-px bg-[#141414] transition-transform duration-300 origin-center ${
                    isAboutActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ width: '85%' }}
                />
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}