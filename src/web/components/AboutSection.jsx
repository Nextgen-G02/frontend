import React from 'react';
import { ChefHat, Leaf, Sparkles } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-16 md:py-24 bg-[#FDFBF8] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C29D59" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center space-y-8 md:space-y-12">
          
          {/* Main Heading Section */}
          <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 group">
              <div className="h-[1px] w-8 md:w-12 bg-[#C29D59]/40 group-hover:w-20 transition-all duration-700"></div>
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-[#C29D59]">
                Since Inception
              </span>
              <div className="h-[1px] w-8 md:w-12 bg-[#C29D59]/40 group-hover:w-20 transition-all duration-700"></div>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.1]">
              The Art of <br />
              <span className="text-[#C29D59] italic font-light">Pure Perfection</span>
            </h2>
            
            <p className="font-sans text-slate-500 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto italic font-medium opacity-80">
              "At Nirosha Sweet House, we don't just bake cakes; we compose edible symphonies. Every creation is a testament to our obsession with quality and the pursuit of sweetness."
            </p>
          </div>

          {/* Luxury Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4">
            {/* Feature 1 */}
            <div className="space-y-4 group text-center p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-700 border border-transparent hover:border-slate-100">
              <div className="mx-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-[#C29D59] group-hover:bg-[#C29D59] group-hover:text-white transition-all duration-700 transform group-hover:scale-110">
                <Leaf size={28} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl text-slate-900">Natural Ingredients</h4>
                <div className="w-8 h-[1px] bg-[#C29D59]/30 mx-auto group-hover:w-16 transition-all duration-700"></div>
                <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-medium">
                  Sourced from the finest local orchards and organic farms to ensure unparalleled purity.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 group text-center p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-700 border border-transparent hover:border-slate-100">
              <div className="mx-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-[#C29D59] group-hover:bg-[#C29D59] group-hover:text-white transition-all duration-700 transform group-hover:scale-110">
                <Sparkles size={28} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl text-slate-900">Exquisite Tastes</h4>
                <div className="w-8 h-[1px] bg-[#C29D59]/30 mx-auto group-hover:w-16 transition-all duration-700"></div>
                <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-medium">
                  A masterfully balanced palette of flavors that captivate the soul from the first bite.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 group text-center p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-700 border border-transparent hover:border-slate-100">
              <div className="mx-auto w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-[#C29D59] group-hover:bg-[#C29D59] group-hover:text-white transition-all duration-700 transform group-hover:scale-110">
                <ChefHat size={28} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif text-xl text-slate-900">Master Artistry</h4>
                <div className="w-8 h-[1px] bg-[#C29D59]/30 mx-auto group-hover:w-16 transition-all duration-700"></div>
                <p className="text-slate-400 text-[11px] md:text-xs leading-relaxed font-medium">
                  Custom-sculpted masterpieces that transform your celebrations into legendary events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
