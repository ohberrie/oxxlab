import { useState } from 'react';
import { Link } from 'react-router';
import clsx from 'clsx';

/* ── Pixel sub-components (from Figma Group11) ── */

function PixelDot({ additionalClassNames = '' }: { additionalClassNames?: string }) {
  return (
    <div className={clsx('bg-black h-[2.892px] w-[3px]', additionalClassNames)}>
      <div
        aria-hidden="true"
        className="absolute border-[0.1px] border-solid border-white inset-[-0.05px] pointer-events-none"
      />
    </div>
  );
}

function PixelDotFlipped({ additionalClassNames = '' }: { additionalClassNames?: string }) {
  return (
    <div
      className={clsx('absolute flex h-[2.892px] items-center justify-center w-[3px]', additionalClassNames)}
    >
      <div className="flex-none rotate-180">
        <PixelDot additionalClassNames="relative" />
      </div>
    </div>
  );
}

function OxxPixelGraphic() {
  return (
    <div className="relative" style={{ width: 51, height: 21 }}>
      <PixelDot additionalClassNames="absolute left-[3px] top-0" />
      <PixelDot additionalClassNames="absolute left-[21px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[38.99px] top-[5.78px]" />
      <PixelDotFlipped additionalClassNames="left-[27px] top-[11.57px]" />
      <PixelDotFlipped additionalClassNames="left-[44.99px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[21px] top-0" />
      <PixelDot additionalClassNames="absolute left-[38.99px] top-0" />
      <PixelDotFlipped additionalClassNames="left-[27px] top-[17.35px]" />
      <PixelDotFlipped additionalClassNames="left-[44.99px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[21px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[38.99px] top-[2.89px]" />
      <PixelDotFlipped additionalClassNames="left-[27px] top-[14.46px]" />
      <PixelDotFlipped additionalClassNames="left-[44.99px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[3px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-0 top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[18px] top-0" />
      <PixelDot additionalClassNames="absolute left-[36px] top-0" />
      <PixelDotFlipped additionalClassNames="left-[30px] top-[17.35px]" />
      <PixelDotFlipped additionalClassNames="left-[47.99px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-0 top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[18px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[36px] top-[2.89px]" />
      <PixelDotFlipped additionalClassNames="left-[30px] top-[14.46px]" />
      <PixelDotFlipped additionalClassNames="left-[47.99px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-0 top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-0 top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-0 top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[6px] top-0" />
      <PixelDot additionalClassNames="absolute left-[24px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[41.99px] top-[5.78px]" />
      <PixelDotFlipped additionalClassNames="left-[24px] top-[11.57px]" />
      <PixelDotFlipped additionalClassNames="left-[41.99px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[24px] top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-[41.99px] top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-[6px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[27px] top-0" />
      <PixelDot additionalClassNames="absolute left-[44.99px] top-0" />
      <PixelDotFlipped additionalClassNames="left-[21px] top-[17.35px]" />
      <PixelDotFlipped additionalClassNames="left-[38.99px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[27px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[44.99px] top-[2.89px]" />
      <PixelDotFlipped additionalClassNames="left-[21px] top-[14.46px]" />
      <PixelDotFlipped additionalClassNames="left-[38.99px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[12px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[30px] top-0" />
      <PixelDot additionalClassNames="absolute left-[47.99px] top-0" />
      <PixelDotFlipped additionalClassNames="left-[18px] top-[17.35px]" />
      <PixelDotFlipped additionalClassNames="left-[35.99px] top-[17.35px]" />
      <PixelDot additionalClassNames="absolute left-[12px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[30px] top-[2.89px]" />
      <PixelDot additionalClassNames="absolute left-[47.99px] top-[2.89px]" />
      <PixelDotFlipped additionalClassNames="left-[18px] top-[14.46px]" />
      <PixelDotFlipped additionalClassNames="left-[35.99px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[12px] top-[8.68px]" />
      <PixelDot additionalClassNames="absolute left-[12px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[12px] top-[14.46px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-0" />
      <PixelDot additionalClassNames="absolute left-[27px] top-[5.78px]" />
      <PixelDot additionalClassNames="absolute left-[44.99px] top-[5.78px]" />
      <PixelDotFlipped additionalClassNames="left-[21px] top-[11.57px]" />
      <PixelDotFlipped additionalClassNames="left-[38.99px] top-[11.57px]" />
      <PixelDot additionalClassNames="absolute left-[9px] top-[17.35px]" />
    </div>
  );
}

/* ── Unified Logo ── */

interface OxxUnifiedLogoProps {
  isStudio: boolean;
}

export function OxxUnifiedLogo({ isStudio }: OxxUnifiedLogoProps) {
  const [hovered, setHovered] = useState<'lab' | 'studio' | null>(null);

  // Bold logic: current section is bold by default; on hover, hovered one becomes bold
  const isLabBold = hovered === null ? !isStudio : hovered === 'lab';
  const isStudioBold = hovered === null ? isStudio : hovered === 'studio';

  // Opacity logic: when hovering the opposite section, current section fades to 50%
  const labOpacity =
    hovered === 'studio' ? 0.5 : 1;
  const studioOpacity =
    hovered === 'lab' ? 0.5 : 1;

  return (
    <div className="flex items-center" style={{ height: 21 }}>
      {/* OXX pixel graphic — links to landing */}
      <Link
        to="/"
        className="relative block transition-opacity duration-200 hover:opacity-70"
        style={{ width: 51, height: 21 }}
      >
        <OxxPixelGraphic />
      </Link>

      {/* Text container — positioned like Figma's Container */}
      <div
        className="flex items-center"
        style={{ marginLeft: 14 }}
      >
        <Link
          to="/lab"
          className="no-underline transition-all duration-200 cursor-pointer lowercase whitespace-nowrap"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12.153px',
            letterSpacing: '1.823px',
            lineHeight: '8.414px',
            color: '#141414',
            fontWeight: isLabBold ? 700 : 400,
            opacity: labOpacity,
          }}
          onMouseEnter={() => setHovered('lab')}
          onMouseLeave={() => setHovered(null)}
        >
          lab
        </Link>

        {/* Vertical divider line */}
        <div
          className="flex items-center justify-center"
          style={{ width: 10, height: 11, marginLeft: 5, marginRight: 7 }}
        >
          <svg width="1" height="11" viewBox="0 0 1 11" fill="none">
            <line x1="0.5" y1="0" x2="0.5" y2="11" stroke="black" />
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
            color: '#141414',
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