import { useState } from 'react';
import { Link } from 'react-router';

/* ─── Pixel Logo (parameterized for light/dark) ──────────────── */

function PixelDot({ left, top, color, borderColor }: { left: string; top: string; color: string; borderColor: string }) {
  return (
    <div className="absolute" style={{ left, top, width: 3, height: 2.892, background: color }}>
      <div className="absolute inset-[-0.05px] border-[0.1px] border-solid pointer-events-none" style={{ borderColor }} />
    </div>
  );
}

function PixelDotFlipped({ left, top, color, borderColor }: { left: string; top: string; color: string; borderColor: string }) {
  return (
    <div className="absolute flex items-center justify-center" style={{ left, top, width: 3, height: 2.892 }}>
      <div className="flex-none rotate-180">
        <div className="relative" style={{ width: 3, height: 2.892, background: color }}>
          <div className="absolute inset-[-0.05px] border-[0.1px] border-solid pointer-events-none" style={{ borderColor }} />
        </div>
      </div>
    </div>
  );
}

function OxxPixelGraphic({ dark }: { dark: boolean }) {
  const c = dark ? '#fff' : '#000';
  const bc = dark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)';

  // Dots
  const dots: [string, string][] = [
    ['3px','0'],['21px','5.78px'],['38.99px','5.78px'],['3px','17.35px'],['3px','2.89px'],
    ['21px','0'],['38.99px','0'],['3px','5.78px'],['21px','2.89px'],['38.99px','2.89px'],
    ['3px','8.68px'],['3px','11.57px'],['3px','14.46px'],['0','2.89px'],['18px','0'],
    ['36px','0'],['0','5.78px'],['18px','2.89px'],['36px','2.89px'],['0','8.68px'],
    ['0','11.57px'],['0','14.46px'],['6px','0'],['24px','5.78px'],['41.99px','5.78px'],
    ['24px','8.68px'],['41.99px','8.68px'],['6px','17.35px'],['9px','2.89px'],['27px','0'],
    ['44.99px','0'],['9px','5.78px'],['27px','2.89px'],['44.99px','2.89px'],['9px','8.68px'],
    ['9px','11.57px'],['9px','14.46px'],['12px','2.89px'],['30px','0'],['47.99px','0'],
    ['12px','5.78px'],['30px','2.89px'],['47.99px','2.89px'],['12px','8.68px'],['12px','11.57px'],
    ['12px','14.46px'],['9px','0'],['27px','5.78px'],['44.99px','5.78px'],['9px','17.35px'],
  ];
  const flipped: [string, string][] = [
    ['27px','11.57px'],['44.99px','11.57px'],['27px','17.35px'],['44.99px','17.35px'],
    ['27px','14.46px'],['44.99px','14.46px'],['30px','17.35px'],['47.99px','17.35px'],
    ['30px','14.46px'],['47.99px','14.46px'],['24px','11.57px'],['41.99px','11.57px'],
    ['21px','17.35px'],['38.99px','17.35px'],['21px','14.46px'],['38.99px','14.46px'],
    ['18px','17.35px'],['35.99px','17.35px'],['18px','14.46px'],['35.99px','14.46px'],
    ['21px','11.57px'],['38.99px','11.57px'],['275.27px','165.17px'],['440.43px','165.17px'],
    ['165.16px','165.17px'],['330.32px','165.17px'],['192.69px','110.12px'],['357.85px','110.12px'],
  ];
  // Use only the small-scale flipped dots (filter out the large Figma coordinates)
  const smallFlipped = flipped.filter(([l]) => parseFloat(l) < 50);

  return (
    <div className="relative" style={{ width: 51, height: 21 }}>
      {dots.map(([l, t], i) => <PixelDot key={`d${i}`} left={l} top={t} color={c} borderColor={bc} />)}
      {smallFlipped.map(([l, t], i) => <PixelDotFlipped key={`f${i}`} left={l} top={t} color={c} borderColor={bc} />)}
    </div>
  );
}

/* ─── Unified Logo with lab | studio toggle ─────────────────── */

interface OxxUnifiedLogoProps {
  isStudio: boolean;
  dark?: boolean;
}

export function OxxUnifiedLogo({ isStudio, dark = false }: OxxUnifiedLogoProps) {
  const [hovered, setHovered] = useState<'lab' | 'studio' | null>(null);

  const isLabBold = hovered === null ? !isStudio : hovered === 'lab';
  const isStudioBold = hovered === null ? isStudio : hovered === 'studio';

  const labOpacity = hovered === 'studio' ? 0.5 : 1;
  const studioOpacity = hovered === 'lab' ? 0.5 : 1;

  const textColor = dark ? '#fff' : '#141414';
  const dividerColor = dark ? 'rgba(255,255,255,0.3)' : 'black';

  return (
    <div className="flex items-center" style={{ height: 21 }}>
      <Link
        to="/"
        className="relative block transition-opacity duration-200 hover:opacity-70"
        style={{ width: 51, height: 21 }}
      >
        <OxxPixelGraphic dark={dark} />
      </Link>

      <div className="flex items-center" style={{ marginLeft: 14 }}>
        <Link
          to="/lab"
          className="no-underline transition-all duration-200 cursor-pointer lowercase whitespace-nowrap"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12.153px',
            letterSpacing: '1.823px',
            lineHeight: '8.414px',
            color: textColor,
            fontWeight: isLabBold ? 700 : 400,
            opacity: labOpacity,
          }}
          onMouseEnter={() => setHovered('lab')}
          onMouseLeave={() => setHovered(null)}
        >
          lab
        </Link>

        <div className="flex items-center justify-center" style={{ width: 10, height: 11, marginLeft: 5, marginRight: 7 }}>
          <svg width="1" height="11" viewBox="0 0 1 11" fill="none">
            <line x1="0.5" y1="0" x2="0.5" y2="11" stroke={dividerColor} />
          </svg>
        </div>

        <Link
          to="/projects"
          className="no-underline transition-all duration-200 cursor-pointer lowercase whitespace-nowrap"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12.153px',
            letterSpacing: '1.823px',
            lineHeight: '8.414px',
            color: textColor,
            fontWeight: isStudioBold ? 700 : 400,
            opacity: studioOpacity,
          }}
          onMouseEnter={() => setHovered('studio')}
          onMouseLeave={() => setHovered(null)}
        >
          studio
        </Link>
      </div>
    </div>
  );
}
