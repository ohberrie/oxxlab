import { useState } from 'react';
import { NavBar } from './NavBar';

export function FrameworkPage() {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(true);
    setTimeout(() => setError(false), 2000);
  };

  return (
    <div className="bg-[#f8f8fd] min-h-screen">
      <header className="relative z-20">
        <NavBar />
      </header>
      <main className="flex items-center justify-center" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="flex flex-col items-center gap-8 max-w-[400px] px-6">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-['JetBrains_Mono'] text-[clamp(24px,2.5vw,36px)] font-bold text-[#141414] tracking-[-0.02em] text-center">
              Framework
            </h1>
            <p className="font-['JetBrains_Mono'] text-[13px] text-[#141414] opacity-40 text-center leading-[1.6]">
              This section is currently restricted.<br />
              Enter a passkey to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
            <input
              type="password"
              value={passkey}
              onChange={(e) => { setPasskey(e.target.value); setError(false); }}
              placeholder="passkey"
              className="w-full max-w-[260px] bg-transparent border-b border-[#141414] border-opacity-20 py-2 font-['JetBrains_Mono'] text-[14px] text-[#141414] text-center tracking-[0.1em] outline-none focus:border-opacity-60 transition-all duration-300 placeholder:text-[#141414] placeholder:opacity-25"
            />
            <button
              type="submit"
              className="font-['JetBrains_Mono'] text-[12px] font-bold text-[#141414] opacity-40 hover:opacity-100 transition-opacity duration-300 tracking-[0.05em] uppercase cursor-pointer bg-transparent border-none"
            >
              Enter
            </button>
            <span
              className={`font-['JetBrains_Mono'] text-[11px] text-[#FF4D00] transition-opacity duration-300 ${
                error ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Invalid passkey
            </span>
          </form>
        </div>
      </main>
    </div>
  );
}
