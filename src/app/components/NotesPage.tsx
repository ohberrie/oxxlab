import { useState } from 'react';
import { Link, useLocation } from 'react-router';
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
      'Density also operates across scales. A page may have low macro-density while individual modules contain high micro-density. This nesting creates perceptual depth without relying on literal z-axis manipulation.',
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
      'The danger lies in conflating the two. When decorative elements are mistaken for structural ones, the design becomes fragile. Remove the decoration, and the structure collapses. This dependency reveals a design that was never truly structured to begin with.',
      'A rigorous approach separates these layers explicitly. The structural layer must be self-sufficient — legible and functional without any decorative treatment. Decoration then becomes an enhancement layer, adding richness without compromising integrity.',
    ],
  },
  {
    slug: 'designing-attention-flow',
    title: 'Designing Attention Flow',
    date: '2026.01.09',
    excerpt: 'Attention is not random. It follows predictable patterns shaped by contrast, proximity, and sequential logic. Designing for attention means choreographing the order in which information is perceived.',
    tags: ['attention', 'hierarchy', 'perception'],
    content: [
      'Attention is not random. It follows predictable patterns shaped by contrast, proximity, and sequential logic. Designing for attention means choreographing the order in which information is perceived.',
      'The eye enters a composition at the point of highest contrast. From there, it travels along paths defined by alignment, grouping, and visual weight. Each pause is a moment of comprehension. Each transition is a moment of navigation.',
      'Traditional hierarchy uses size and weight to control attention. Larger elements are seen first. Bolder elements are read first. But this is only one dimension of attention design.',
      'Temporal hierarchy adds sequence: not just what is seen first, but what is seen second, third, fourth. This sequential logic transforms a static layout into a reading experience — a directed flow of attention across information.',
      'The challenge is designing flows that feel natural while being entirely constructed. The best attention design is invisible — the viewer feels they are discovering information in a logical order, unaware that the order was engineered.',
    ],
  },
  {
    slug: 'pattern-as-structural-logic',
    title: 'Pattern as Structural Logic',
    date: '2025.12.19',
    excerpt: 'Patterns are typically understood as repetitive visual motifs. But when patterns are elevated to structural logic, they become generative systems — rules that produce form rather than merely decorating it.',
    tags: ['pattern', 'generative', 'systems'],
    content: [
      'Patterns are typically understood as repetitive visual motifs. But when patterns are elevated to structural logic, they become generative systems — rules that produce form rather than merely decorating it.',
      'A structural pattern is a set of rules applied recursively. Each application produces variation within consistency. The pattern does not dictate the final form — it constrains the space of possible forms.',
      'Consider a simple rule: "divide any rectangle into two unequal parts." Applied once, it produces a basic split. Applied recursively, it generates a complex, hierarchical composition. The rule is simple. The output is rich.',
      'This is the power of pattern-as-logic. The designer defines the rule, not the result. The result emerges from the rule\'s interaction with context — screen size, content volume, user behavior.',
      'Algorithmic design extends this principle computationally. Rules become functions. Variations become parameters. The designer\'s role shifts from composing layouts to composing systems that compose layouts.',
    ],
  },
];

export function NotesPage() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const location = useLocation();

  const selectedNote = notes.find(n => n.slug === activeNote);

  return (
    <div className="bg-[#f8f8fd] w-full min-h-screen relative font-['JetBrains_Mono']">
      {/* Header */}
      <div className="w-full relative">
        <NavBar />
        <div className="absolute left-0 right-0 top-[60px] h-px bg-[#D2D2D2]" />
      </div>

      {/* Content */}
      <div className="pt-[80px] px-[58px] max-md:px-6 max-md:pt-[72px]">
        {!selectedNote ? (
          /* Notes index */
          <div>
            <h1 className="text-[#141414] text-[72px] font-bold leading-[1.07] tracking-[-0.02em] mb-3 max-md:text-[36px]">
              Notes
            </h1>
            <p className="text-[#141414] text-[16px] font-bold leading-[1.47] tracking-[-0.02em] opacity-60 mb-16 max-w-[420px] max-md:text-[14px] max-md:mb-10">
              Thoughts, sketches, and process documentation on algorithmic design
            </p>

            <div className="max-w-[960px]">
              {notes.map((note, index) => (
                <div key={note.slug}>
                  {index > 0 && <div className="h-px bg-[#D2D2D2] my-0" />}
                  <div
                    className="group py-10 cursor-pointer max-md:py-6"
                    onClick={() => setActiveNote(note.slug)}
                  >
                    <div className="flex items-baseline justify-between mb-4 max-md:flex-col max-md:gap-1 max-md:mb-3">
                      <h2 className="text-[#141414] text-[28px] font-bold leading-[1.2] tracking-[-0.02em] group-hover:text-[#FF4D00] transition-colors duration-300 max-md:text-[20px]">
                        {note.title}
                      </h2>
                      <span className="text-[#141414] text-[13px] font-normal opacity-40 shrink-0 ml-8 max-md:ml-0">
                        {note.date}
                      </span>
                    </div>
                    <p className="text-[#141414] text-[15px] font-normal leading-[1.85] opacity-50 group-hover:opacity-70 transition-opacity duration-300 max-w-[720px] max-md:text-[13px] font-['Inter']">
                      {note.excerpt}
                    </p>
                    <div className="flex gap-2 mt-4 max-md:mt-3">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[11px] font-normal text-[#141414] opacity-30 border border-[#141414]/20 px-2.5 py-0.5"
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
          /* Note detail */
          <div>
            <button
              onClick={() => setActiveNote(null)}
              className="text-[#141414] text-[13px] font-bold opacity-40 hover:opacity-100 transition-opacity duration-300 mb-10 cursor-pointer bg-transparent border-none font-['JetBrains_Mono'] max-md:mb-6"
            >
              &larr; back to notes
            </button>

            <div className="max-w-[720px]">
              <div className="flex items-baseline justify-between mb-2 max-md:flex-col max-md:gap-1">
                <h1 className="text-[#141414] text-[48px] font-bold leading-[1.1] tracking-[-0.02em] max-md:text-[28px]">
                  {selectedNote.title}
                </h1>
                <span className="text-[#141414] text-[13px] font-normal opacity-40 shrink-0 ml-8 max-md:ml-0">
                  {selectedNote.date}
                </span>
              </div>

              <div className="flex gap-2 mb-14 max-md:mb-8">
                {selectedNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[11px] font-normal text-[#141414] opacity-30 border border-[#141414]/20 px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="space-y-8 pb-20 max-md:space-y-6">
                {selectedNote.content.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[#141414] text-[16px] font-normal leading-[1.85] opacity-70 max-md:text-[14px] font-['Inter']"
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