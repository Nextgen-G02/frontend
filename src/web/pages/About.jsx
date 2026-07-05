import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../../shared/components/SEO';
import { Award, Leaf, HeartHandshake } from 'lucide-react';

export default function About() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FDFBF8] min-h-screen selection:bg-[#C29D59] selection:text-white">
      <SEO 
        title="Our Heritage"
        description="Discover the story behind Nirosha Sweet House, a legacy of artisanal baking and luxury confectionery."
      />
      <Navbar />

      <main className="pt-24 md:pt-32 pb-16">
        
        {/* HEADER / INTRO */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto text-center mb-16 md:mb-32">
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <span className="h-[1px] w-12 md:w-24 bg-slate-900"></span>
            <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-900">Since 1998</p>
            <span className="h-[1px] w-12 md:w-24 bg-slate-900"></span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-8xl text-slate-900 leading-[1.1] tracking-tighter max-w-5xl mx-auto mb-8">
            A Legacy of <br className="hidden md:block" />
            <span className="italic font-light text-[#C29D59]">Artisanal Excellence</span>
          </h1>
          
          <p className="text-slate-500 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium">
            For over two decades, Nirosha Sweet House has been synonymous with luxury confectionery, blending time-honored recipes with contemporary artistry to create moments of pure indulgence.
          </p>
        </section>

        {/* THE STORY - SPLIT LAYOUT */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto mb-20 md:mb-40">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 relative group">
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/images/founder.jpg" 
                  alt="Nirosha Sweet House Founder Certificate Awarding Ceremony" 
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#f4ebd9] rounded-full mix-blend-multiply filter blur-3xl opacity-70 -z-10"></div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6 md:space-y-10">
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#C29D59]">The Beginning</p>
              <h2 className="font-serif text-3xl md:text-5xl text-slate-900 leading-tight">
                Born from passion. <br />
                Crafted with <span className="italic font-light">precision.</span>
              </h2>
              <div className="space-y-6 text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                <p>
                  What started as a modest family kitchen has blossomed into a premier destination for those who appreciate the finer things in life. Our founder believed that a cake isn't just dessert—it's the centerpiece of memory-making.
                </p>
                <p>
                  Today, every confection that leaves our doors carries that original spirit. We meticulously source the world's finest ingredients: single-origin chocolates, pure Madagascar vanilla, and farm-fresh dairy, ensuring that our products taste as spectacular as they look.
                </p>
              </div>
              <div className="pt-4">
                <img src="/images/signature.png" alt="Founder Signature" className="h-12 opacity-80" onError={(e) => e.target.style.display='none'} />
              </div>
            </div>
          </div>
        </section>

        {/* OUR VALUES - MINIMALIST GRID */}
        <section className="bg-white py-20 md:py-32 mb-20 md:mb-40 border-y border-slate-100">
          <div className="px-6 md:px-12 max-w-[1440px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-5xl text-slate-900 mb-4">Our Philosophy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
              {/* Value 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#fbf9f4] flex items-center justify-center mb-6 group-hover:bg-[#C29D59] group-hover:text-white transition-colors duration-500 text-[#C29D59]">
                  <Leaf strokeWidth={1.5} size={28} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-3">Pure Ingredients</h3>
                <p className="text-slate-500 text-sm leading-relaxed">No compromises, no shortcuts. Only the purest, highest-grade ingredients sourced sustainably.</p>
              </div>

              {/* Value 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#fbf9f4] flex items-center justify-center mb-6 group-hover:bg-[#C29D59] group-hover:text-white transition-colors duration-500 text-[#C29D59]">
                  <Award strokeWidth={1.5} size={28} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-3">Master Craftsmanship</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Our pastry chefs are artists, treating every layer, pipe, and glaze as a masterful canvas.</p>
              </div>

              {/* Value 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-[#fbf9f4] flex items-center justify-center mb-6 group-hover:bg-[#C29D59] group-hover:text-white transition-colors duration-500 text-[#C29D59]">
                  <HeartHandshake strokeWidth={1.5} size={28} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-3">Bespoke Service</h3>
                <p className="text-slate-500 text-sm leading-relaxed">From the first consultation to the final bite, your vision is handled with absolute devotion.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRIDE GALLERY - STAGGERED */}
        <section className="px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-3xl md:text-5xl text-slate-900">The Heart of <br/> <span className="italic font-light text-[#C29D59]">Our Kitchen</span></h2>
            </div>
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-4 md:mt-0">Behind the scenes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            
            {/* Main large image */}
            <div className="col-span-1 md:col-span-8 rounded-3xl overflow-hidden h-[300px] md:h-[600px] group">
              <img 
                src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=1400&auto=format&fit=crop" 
                alt="Bakery showcase" 
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
              />
            </div>

            <div className="col-span-1 md:col-span-4 flex flex-col gap-4 md:gap-6">
              {/* Top small image */}
              <div className="rounded-3xl overflow-hidden h-[200px] md:h-[290px] group">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop" 
                  alt="Detailed piping" 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
              </div>
              
              {/* Bottom small image */}
              <div className="rounded-3xl overflow-hidden h-[200px] md:h-[285px] group">
                <img 
                  src="https://images.unsplash.com/photo-1605807646983-377bc5a76493?q=80&w=800&auto=format&fit=crop" 
                  alt="Fresh ingredients" 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
