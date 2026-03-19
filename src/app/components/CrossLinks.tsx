import { Link } from 'react-router';
import { useIsMobile } from './ScaledSlide';

interface CrossLinkItem {
  label: string;
  path: string;
}

interface CrossLinksProps {
  label: string;
  links: CrossLinkItem[];
}

export function CrossLinks({ label, links }: CrossLinksProps) {
  const isMobile = useIsMobile();
  if (links.length === 0) return null;

  if (isMobile) {
    return (
      <div className="mt-6">
        <div className="font-['JetBrains_Mono'] text-[13px] font-bold tracking-[1.5px] uppercase text-[#141414] opacity-30 mb-3">
          {label} →
        </div>
        <div className="flex flex-col gap-2.5">
          {links.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              className="font-['JetBrains_Mono'] text-[15px] text-[#141414] no-underline opacity-50 hover:opacity-100 hover:text-[#FF4D00] transition-all duration-200 flex items-center gap-2.5"
            >
              <span className="w-[6px] h-[6px] rounded-full bg-[#FF4D00] inline-block shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="font-['JetBrains_Mono'] text-[16px] font-bold tracking-[2.5px] uppercase text-[#141414] opacity-30 mb-4">
        {label} →
      </div>
      <div className="flex flex-col gap-3">
        {links.map((item) => (
          <Link
            key={item.path + item.label}
            to={item.path}
            className="font-['JetBrains_Mono'] text-[20px] text-[#141414] no-underline opacity-50 hover:opacity-100 hover:text-[#FF4D00] transition-all duration-200 flex items-center gap-3"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-[#FF4D00] inline-block shrink-0" />
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
