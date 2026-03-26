import { NavBar } from './NavBar';

interface ShopItem {
  id: string;
  name: string;
  category: string;
  price: string;
  status: 'available' | 'sold out' | 'coming soon';
  description: string;
}

const shopItems: ShopItem[] = [
  {
    id: '001',
    name: 'OXX Density Object — A1',
    category: 'Objet',
    price: '€120',
    status: 'available',
    description: 'Algorithmic density pattern printed on archival matte paper. Edition of 50.',
  },
  {
    id: '002',
    name: 'Pixel Grid Structure — 03',
    category: 'Objet',
    price: '€85',
    status: 'available',
    description: 'Laser-cut acrylic grid structure based on modular pixel fill logic.',
  },
  {
    id: '003',
    name: 'Depth Hierarchy Print',
    category: 'Print',
    price: '€65',
    status: 'available',
    description: 'Giclée print on Hahnemühle Photo Rag. 420×594mm.',
  },
  {
    id: '004',
    name: 'Form Strategy Notebook',
    category: 'Stationery',
    price: '€28',
    status: 'coming soon',
    description: 'Grid-ruled notebook with algorithmic cover pattern. 148×210mm.',
  },
];

export function ShopPage() {
  return (
    <div className="bg-[#f8f8fd] w-full min-h-screen">
      <header className="relative z-20">
        <NavBar />
      </header>

      <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-20 max-md:px-5 max-md:pt-10">
        <div className="mb-16 max-md:mb-10">
          <h1 className="font-['DM_Sans'] text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#141414] mb-2 max-md:text-[28px]">
            Editions
          </h1>
          <p className="font-['DM_Sans'] text-[14px] text-[#141414] opacity-45 max-w-[500px] leading-[1.5]">
            Objects, prints, and editions derived from algorithmic design research.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-14 max-lg:grid-cols-2 max-md:grid-cols-1 max-md:gap-y-10">
          {shopItems.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="w-full aspect-square bg-[#e8e8ed] mb-4 flex items-center justify-center transition-colors duration-300 group-hover:bg-[#d8d8dd]">
                <div className="w-[60%] h-[60%] border border-[#141414] opacity-10 flex items-center justify-center">
                  <span className="font-['JetBrains_Mono'] text-[12px] text-[#141414] opacity-40">
                    {item.id}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-start gap-3 mb-1.5">
                <h3 className="font-['DM_Sans'] text-[14px] font-bold text-[#141414] leading-[1.3] transition-colors duration-300 group-hover:text-[#FF4D00]">
                  {item.name}
                </h3>
                <span className="font-['JetBrains_Mono'] text-[14px] font-bold text-[#141414] shrink-0">
                  {item.price}
                </span>
              </div>

              <p className="font-['DM_Sans'] text-[12px] text-[#141414] opacity-50 leading-[1.5] mb-2">
                {item.description}
              </p>

              <div className="flex items-center gap-3">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#141414] opacity-40 uppercase tracking-[0.05em]">
                  {item.category}
                </span>
                <span className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.05em]"
                  style={{
                    color: item.status === 'available' ? '#FF4D00' :
                           item.status === 'sold out' ? '#999' : '#141414',
                    opacity: item.status === 'sold out' ? 0.4 : 0.7,
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}