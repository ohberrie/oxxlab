import { Link, useLocation, useSearchParams } from 'react-router';
import { OxxUnifiedLogo } from './OxxUnifiedLogo';

interface NavBarProps {
  mode?: 'lab' | 'studio';
  dark?: boolean;
  transparent?: boolean;
}

export function NavBar({ mode, dark = false, transparent = false }: NavBarProps) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine studio vs lab mode
  const autoStudio = location.pathname.startsWith('/projects') || location.pathname.startsWith('/shop');
  const aboutCtx = searchParams.get('ctx');
  const isStudio = mode === 'studio' || (mode !== 'lab' && (autoStudio || (location.pathname.startsWith('/about') && aboutCtx === 'studio')));

  const isLabActive = location.pathname === '/lab' || (location.pathname.startsWith('/lab') && !location.pathname.startsWith('/lab/cases'));
  const isCasesActive = location.pathname.startsWith('/lab/cases');
  const isNotesActive = location.pathname.startsWith('/notes');
  const isFrameworkActive = location.pathname.startsWith('/framework');
  const isProjectsActive = location.pathname.startsWith('/projects');
  const isShopActive = location.pathname.startsWith('/shop');
  const isAboutActive = location.pathname.startsWith('/about');

  const aboutLink = isStudio ? '/about?ctx=studio' : '/about?ctx=lab';

  const textColor = dark ? '#fff' : '#141414';
  const activeUnderline = dark ? '#FF1E00' : '#141414';
  const hoverEditionsColor = '#FF1E00';

  // Accent color for editions
  const editionsUnderline = '#FF1E00';

  type NavItem = { label: string; path: string; active: boolean; accent?: boolean };

  const navItems: NavItem[] = isStudio
    ? [
        { label: 'Projects', path: '/projects', active: isProjectsActive },
        { label: 'Editions', path: '/shop', active: isShopActive, accent: true },
        { label: 'About', path: aboutLink, active: isAboutActive },
      ]
    : [
        { label: 'Systems', path: '/lab/systems', active: isLabActive },
        { label: 'Cases', path: '/lab/cases', active: isCasesActive },
        { label: 'Notes', path: '/notes', active: isNotesActive },
        { label: 'Framework', path: '/framework', active: isFrameworkActive },
        { label: 'About', path: aboutLink, active: isAboutActive },
      ];

  const bgStyle: React.CSSProperties = transparent
    ? { background: dark ? 'linear-gradient(180deg, rgba(10,10,10,0.8) 0%, transparent 100%)' : 'transparent' }
    : dark
    ? { background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }
    : {};

  return (
    <div className="w-full" style={{ position: transparent ? 'fixed' : 'sticky', top: 0, left: 0, right: 0, zIndex: 100, ...bgStyle }}>
      <nav className="flex justify-between items-center px-6 max-md:px-4" style={{ height: 56 }}>
        <div className="block relative">
          <OxxUnifiedLogo isStudio={isStudio} dark={dark} />
        </div>
        <div className="flex gap-7 max-md:gap-4">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={item.path}
              className="no-underline relative inline-block group"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: item.accent && !dark ? hoverEditionsColor : (dark ? (item.active ? '#FF1E00' : 'rgba(255,255,255,0.4)') : textColor),
                transition: 'color 0.2s',
              }}
            >
              {item.label}
              <span
                className={`absolute bottom-[-2px] left-1/2 -translate-x-1/2 h-px transition-transform duration-300 origin-center ${
                  item.active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
                style={{
                  width: '85%',
                  background: item.accent ? editionsUnderline : activeUnderline,
                }}
              />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}