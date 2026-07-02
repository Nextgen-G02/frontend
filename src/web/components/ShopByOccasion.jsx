import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, GraduationCap, Building2 } from 'lucide-react';

const occasions = [
  {
    id: 1,
    title: 'Birthdays',
    icon: <Gift className="w-8 h-8 text-[#C29D59]" />,
    image: "/images/bday-occ.jpg",
    link: '/products?category=cakes&theme=birthday',
    color: 'bg-rose-50'
  },
  {
    id: 2,
    title: 'Weddings & Anniversaries',
    icon: <Heart className="w-8 h-8 text-[#C29D59]" />,
    image: "/images/hero-2r.jpg",
    link: '/products?category=cakes&theme=wedding',
    color: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'Graduations',
    icon: <GraduationCap className="w-8 h-8 text-[#C29D59]" />,
    image: "/images/graduation-occ.jpg",
    link: '/products?category=cakes&theme=graduation',
    color: 'bg-amber-50'
  },
  {
    id: 4,
    title: 'Corporate Events',
    icon: <Building2 className="w-8 h-8 text-[#C29D59]" />,
    image: "/images/coop-cake-occ.png",
    link: '/products?category=cakes&theme=corporate',
    color: 'bg-slate-50'
  }
];

export default function ShopByOccasion() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[1px] w-8 md:w-12 bg-[#C29D59]"></span>
            <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#C29D59]">Celebrate Life</p>
            <span className="h-[1px] w-8 md:w-12 bg-[#C29D59]"></span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Shop by <span className="italic font-light">Occasion</span></h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">Find the perfect centerpiece for your special moments.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {occasions.map((occ, index) => (
            <Link 
              key={occ.id} 
              to={occ.link}
              className={`group relative h-[250px] md:h-[320px] rounded-[24px] md:rounded-[32px] overflow-hidden flex flex-col justify-end p-5 md:p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 col-span-1`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <img src={occ.image} alt={occ.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-white flex flex-col">
                <h3 className="font-sans font-black text-lg md:text-2xl mb-1 tracking-tight leading-tight">{occ.title}</h3>
                <span className="inline-flex items-center gap-1 md:gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#C29D59]">
                  Discover More <span className="text-sm md:text-lg leading-none">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
