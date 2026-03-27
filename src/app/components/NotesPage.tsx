import { useState } from 'react';
import { NavBar } from './NavBar';

interface NoteEntry {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string[];
}

const notes: NoteEntry[] = [
  {
    slug: 'why-density-matters',
    title: 'Why Density Matters',
    date: '2026.02.14',
    excerpt: 'Density is not about filling space — it is about controlling the rate of information per unit area. When density is treated as a variable rather than a byproduct, design gains a new axis of intentionality.',
    tags: ['density', 'theory', 'spatial-logic'],
    content: [
      'Density is not about filling space — it is about controlling the rate of information per unit area. When density is treated as a variable rather than a byproduct, design gains a new axis of intentionality.',
      'In traditional design workflows, density emerges as a consequence of layout decisions. Elements are placed, and the resulting visual weight is evaluated retroactively. This approach treats density as an output rather than an input.',
      'What if we inverted this? What if density became a primary parameter — something we define before placing a single element? The implications are significant: density as input means every compositional decision is filtered through a measurable constraint.',
      'Consider a grid system where cell occupancy rate is the driving variable. At 30% density, the grid breathes. At 70%, it compresses. The transition between these states is not merely visual — it encodes hierarchy, rhythm, and emphasis.',
    ],
  },
  {
    slug: 'structure-vs-decoration',
    title: 'Structure vs Decoration',
    date: '2026.01.28',
    excerpt: 'The distinction between structural and decorative elements is often blurred in practice. A border can be structural (defining a boundary) or decorative (adding visual interest). The same element serves different roles depending on context.',
    tags: ['structure', 'form', 'methodology'],
    content: [
      'The distinction between structural and decorative elements is often blurred in practice. A border can be structural (defining a boundary) or decorative (adding visual interest). The same element serves different roles depending on context.',
      'Structure refers to elements that define spatial relationships. They organize, divide, and create hierarchy. Without them, content exists as an undifferentiated field. Decoration, by contrast, operates on the surface — it modulates perception without altering organization.',
    ],
  },
];

export function NotesPage() {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const selectedNote = notes.find(n => n.slug === activeNote);

  return (
    <div className="w-full min-h-screen relative font-['DM_Sans']" style={{ background: '#0a0a0a', color: '#fff' }}>
      <div className="w-full relative">
        <NavBar mode="lab" dark />
      </div>

      <div className="pt-[88px] px-[58px] pb-20 max-md:px-6 max-md:pt-[72px]">
        {!selectedNote ? (
          <div>
            <h1 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] mb-3 max-md:text-[28px] font-['DM_Sans']" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Notes
            </h1>
            <p className="text-[14px] leading-[1.5] tracking-[-0.01em] mb-12 max-w-[420px] max-md:text-[13px] max-md:mb-8 font-['DM_Sans']" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Thoughts, sketches, and process documentation on algorithmic design
            </p>

            <div className="max-w-[960px]">
              {notes.map((note, index) => (
                <div key={note.slug}>
                  {index > 0 && <div className="h-px my-0" style={{ background: 'rgba(255,255,255,0.04)' }} />}
                  <div
                    className="group py-12 cursor-pointer max-md:py-8 transition-all duration-300"
                    onClick={() => setActiveNote(note.slug)}
                  >
                    <div className="flex items-baseline justify-between mb-4 max-md:flex-col max-md:gap-1 max-md:mb-3">
                      <h2 className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] transition-all duration-300 group-hover:translate-x-1 max-md:text-[20px] font-['DM_Sans']"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF1E00'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                      >
                        {note.title}
                      </h2>
                      <span className="text-[13px] font-normal shrink-0 ml-8 max-md:ml-0 font-['JetBrains_Mono']" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {note.date}
                      </span>
                    </div>
                    <p className="text-[15px] font-normal leading-[1.85] group-hover:opacity-60 transition-opacity duration-300 max-w-[720px] max-md:text-[13px] font-['DM_Sans']" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {note.excerpt}
                    </p>
                    <div className="flex gap-2.5 mt-5 max-md:mt-3">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[11px] font-normal px-3 py-1 rounded-full font-['JetBrains_Mono']"
                          style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveNote(null)}
              className="text-[13px] font-bold hover:opacity-100 transition-all duration-300 mb-12 cursor-pointer bg-transparent border-none font-['JetBrains_Mono'] max-md:mb-6"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              &larr; back to notes
            </button>

            <div className="max-w-[680px]">
              <div className="flex items-baseline justify-between mb-3 max-md:flex-col max-md:gap-1">
                <h1 className="text-[48px] font-bold leading-[1.1] tracking-[-0.02em] max-md:text-[28px] font-['DM_Sans']" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {selectedNote.title}
                </h1>
                <span className="text-[13px] font-normal shrink-0 ml-8 max-md:ml-0 font-['JetBrains_Mono']" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {selectedNote.date}
                </span>
              </div>

              <div className="flex gap-2.5 mb-16 max-md:mb-8">
                {selectedNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-normal px-3 py-1 rounded-full"
                    style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-8 pb-20 max-md:space-y-6">
                {selectedNote.content.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[16px] font-normal leading-[1.85] max-md:text-[14px] font-['DM_Sans']"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
