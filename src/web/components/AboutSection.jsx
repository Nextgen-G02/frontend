import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="relative group animate-in fade-in slide-in-from-left duration-1000">
            <div className="relative overflow-hidden rounded-sm shadow-2xl">
              <img 
                src="/images/cake_main.png" 
                alt="Our Signature Cake" 
                className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Decorative Gold Frame */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-[#C29D59]/30 -z-10"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-[#C29D59]/30 -z-10"></div>
          </div>

          {/* Text Side */}
          <div className="flex flex-col animate-in fade-in slide-in-from-right duration-1000 delay-200">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] md:text-[12px] font-sans font-medium uppercase tracking-[0.4em] text-[#C29D59]">
                About Our House
              </span>
              <div className="h-[1px] w-12 bg-[#C29D59]/40"></div>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.1] mb-8">
              WE CREATE <br />
              <span className="italic font-light">INCREDIBLY TASTY</span> <br />
              CAKES & SWEETS
            </h2>

            <p className="font-sans text-sm md:text-base text-slate-500 leading-relaxed mb-10 max-w-lg">
              At Nirosha Sweet House, we believe every celebration deserves a centerpiece that tastes as exquisite as it looks. Our master artisans combine time-honored recipes with modern culinary techniques to bring you a collection of treats that are truly unforgettable.
            </p>

            {/* Signature Section */}
            <div className="flex flex-col gap-2">
              <div className="mb-2">
                {/* Simulated Signature with an elegant font */}
                <span className="font-serif text-3xl md:text-4xl text-[#C29D59] italic lowercase tracking-tight opacity-80">
                  Nirosha Perera
                </span>
              </div>
              <span className="text-[10px] md:text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-slate-900">
                Founder of Nirosha Sweet House
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
