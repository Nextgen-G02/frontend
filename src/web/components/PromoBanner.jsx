import React from 'react';
import { ArrowRight, Sparkles, Percent, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section className="relative my-8 md:my-16 max-w-[1440px] mx-auto px-6 md:px-12 overflow-hidden">
      <div className="relative rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 text-white p-8 md:p-16 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 group">
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#C29D59]/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/[0.02] rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px] pointer-events-none"></div>

        {/* Content Side */}
        <div className="relative z-10 flex-1 space-y-4 md:space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#C29D59] uppercase tracking-wider">
            <Sparkles size={14} className="animate-pulse" /> Celebration Special
          </div>
          
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light leading-[1.2]">
            Celebrate Sweet Moments <br />
            <span className="font-bold italic text-[#C29D59]">With 10% Savings</span>
          </h2>
          
          <p className="text-slate-400 text-xs md:text-base max-w-xl font-medium leading-relaxed">
            Get free delivery on orders above Rs. 2,500 and enjoy our signature handcrafted recipes delivered directly to your doorstep.
          </p>

          {/* Value Propositions */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-2 text-xs md:text-sm font-semibold tracking-wide text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C29D59]/10 flex items-center justify-center text-[#C29D59]">
                <Truck size={16} />
              </div>
              Free Delivery
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C29D59]/10 flex items-center justify-center text-[#C29D59]">
                <Percent size={16} />
              </div>
              10% Welcome Discount
            </div>
          </div>
        </div>

        {/* Button Side */}
        <div className="relative z-10 text-center md:text-right flex-shrink-0">
          <Link 
            to="/products"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[#C29D59] hover:bg-[#b08e50] text-slate-950 font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] rounded-xl md:rounded-2xl transition-all duration-300 shadow-xl hover:shadow-active hover:-translate-y-0.5 active:scale-95"
          >
            Shop Sweets Now
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
