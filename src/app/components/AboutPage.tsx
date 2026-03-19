import { Link, useSearchParams } from 'react-router';
import { NavBar } from './NavBar';

export function AboutPage() {
  const [searchParams] = useSearchParams();
  const ctx = searchParams.get('ctx');
  const isStudio = ctx === 'studio';
  const navMode = isStudio ? 'studio' : 'lab';

  return (
    <div className="bg-[#f8f8fd] min-h-screen flex flex-col">
      <header>
        <NavBar mode={navMode} />
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-12 max-w-[560px] text-center">
          <div className="flex items-center gap-6 max-md:gap-4">
            <Link
              to="/lab"
              className="font-['JetBrains_Mono'] text-[14px] font-bold text-[#141414] no-underline relative inline-block group transition-opacity duration-300 hover:opacity-70"
            >
              Lab
              <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[85%] h-px bg-[#141414] scale-x-100 transition-transform duration-300 origin-center group-hover:scale-x-0" />
            </Link>
            <span className="font-['JetBrains_Mono'] text-[14px] text-[#141414] opacity-25">&</span>
            <Link
              to="/projects"
              className="font-['JetBrains_Mono'] text-[14px] font-bold text-[#141414] no-underline relative inline-block group transition-opacity duration-300 hover:opacity-70"
            >
              Studio
              <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-[90%] h-px bg-[#141414] scale-x-100 transition-transform duration-300 origin-center group-hover:scale-x-0" />
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-['JetBrains_Mono'] text-[clamp(13px,1vw,16px)] text-[#141414] opacity-60 leading-[1.7] tracking-[-0.01em]">
              OXX is an algorithmic design and research studio exploring the intersection of computational logic and visual form.
            </p>
            <p className="font-['JetBrains_Mono'] text-[clamp(13px,1vw,16px)] text-[#141414] opacity-60 leading-[1.7] tracking-[-0.01em]">
              Through systematic experimentation with density systems, modular structures, and parametric processes, we develop design frameworks that bridge generative methodology and intentional aesthetics.
            </p>
            <p className="font-['JetBrains_Mono'] text-[clamp(13px,1vw,16px)] text-[#141414] opacity-40 leading-[1.7] tracking-[-0.01em]">
              Seoul, KR — oxxlab.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
