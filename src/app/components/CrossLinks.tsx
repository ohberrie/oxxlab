import { Link } from 'react-router';
import { useIsMobile } from './ScaledSlide';
import { oxx } from '../tokens';

interface CrossLinkItem {
  label: string;
  path: string;
}

interface CrossLinksProps {
  label: string;
  links: CrossLinkItem[];
  dark?: boolean;
}

export function CrossLinks({ label, links, dark = false }: CrossLinksProps) {
  const isMobile = useIsMobile();
  if (links.length === 0) return null;

  const textColor = dark ? 'rgba(255,255,255,0.5)' : oxx.ink;
  const labelColor = dark ? 'rgba(255,255,255,0.3)' : oxx.ink;
  const accent = oxx.accent;

  if (isMobile) {
    return (
      <div className="mt-6">
        <div className="font-mono text-[13px] font-bold tracking-[1.5px] uppercase mb-3" style={{ color: labelColor, opacity: dark ? 1 : 0.3 }}>
          {label} →
        </div>
        <div className="flex flex-col gap-2.5">
          {links.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              className="font-mono text-[15px] no-underline transition-all duration-200 flex items-center gap-2.5"
              style={{ color: textColor, opacity: dark ? 1 : 0.5 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = textColor; e.currentTarget.style.opacity = dark ? '1' : '0.5'; }}
            >
              <span className="w-[6px] h-[6px] rounded-full inline-block shrink-0" style={{ background: accent }} />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="font-mono text-[16px] font-bold tracking-[2.5px] uppercase mb-4" style={{ color: labelColor, opacity: dark ? 1 : 0.3 }}>
        {label} →
      </div>
      <div className="flex flex-col gap-3">
        {links.map((item) => (
          <Link
            key={item.path + item.label}
            to={item.path}
            className="font-mono text-[20px] no-underline transition-all duration-200 flex items-center gap-3"
            style={{ color: textColor, opacity: dark ? 1 : 0.5 }}
            onMouseEnter={(e) => { e.currentTarget.style.color = accent; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = textColor; e.currentTarget.style.opacity = dark ? '1' : '0.5'; }}
          >
            <span className="w-[7px] h-[7px] rounded-full inline-block shrink-0" style={{ background: accent }} />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
