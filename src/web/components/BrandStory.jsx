import React from "react";
import { Award, Leaf, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: <Award className="text-primary" size={32} />,
    title: "Handcrafted Excellence",
    description: "Every cake is a unique masterpiece, baked from scratch using traditional heritage recipes."
  },
  {
    icon: <Leaf className="text-primary" size={32} />,
    title: "Premium Ingredients",
    description: "We source only the finest organic butter, rich chocolate, and the freshest seasonal fruits."
  },
  {
    icon: <Zap className="text-primary" size={32} />,
    title: "Freshness Guaranteed",
    description: "Baked daily and delivered with care, ensuring the perfect taste experience every time."
  },
  {
    icon: <Heart className="text-primary" size={32} />,
    title: "Baked with Love",
    description: "Our passion for confectionary excellence is at the heart of everything we create."
  }
];

export default function BrandStory() {
  return (
    <section className="py-16 md:py-24 bg-[#FDFCFB] relative overflow-hidden">
      {/* High-Impact Background Composition */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-slate-900/[0.02] rounded-full translate-y-1/3 -translate-x-1/4 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#B38B59 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Premium Typography */}
        <div className="text-center mb-12 md:mb-20 space-y-4 md:space-y-5 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-10 bg-amber-200"></span>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">The Nirosha Sweet House Standard</p>
            <span className="h-[1px] w-10 bg-amber-200"></span>
          </div>
          
          <h2 className="heading-premium text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-slate-900">
            Legacy of <span className="text-amber-500 italic font-serif font-normal">Pure Delight</span>
          </h2>
          
          <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full"></div>
          
          <p className="text-slate-500 text-[10px] md:text-base font-medium leading-relaxed max-w-xl mx-auto">
            Blending secret heritage recipes with uncompromising modern quality to create sweet moments.
          </p>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative p-6 md:p-8 bg-white/60 backdrop-blur-sm rounded-[32px] border border-white/80 shadow-[0_10px_40px_rgba(179,139,89,0.05)] hover:shadow-active transition-all duration-700 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Icon Composition */}
              <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 mb-6 md:mb-8">
                <div className="absolute inset-0 bg-amber-100 rounded-[20px] md:rounded-[24px] rotate-6 group-hover:rotate-45 transition-transform duration-700"></div>
                <div className="relative w-full h-full bg-white rounded-[20px] md:rounded-[24px] shadow-sm flex items-center justify-center border border-amber-50 group-hover:bg-slate-900 transition-all duration-500">
                  {React.cloneElement(feature.icon, { 
                    size: 24, 
                    className: "text-amber-500 group-hover:text-white group-hover:scale-110 transition-all duration-500" 
                  })}
                </div>
              </div>

              {/* Content with Refined Spacing */}
              <div className="relative z-10 space-y-3 flex flex-col items-center">
                <h3 className="text-[11px] md:text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                  {feature.title}
                </h3>
                
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-amber-200 rounded-full"></div>
                  <div className="h-1 w-6 bg-amber-400 rounded-full group-hover:w-10 transition-all duration-500"></div>
                  <div className="h-1 w-1 bg-amber-200 rounded-full"></div>
                </div>

                <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>

              {/* Designer Accent Element */}
              <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-amber-400/5 rounded-full blur-xl group-hover:bg-amber-400/15 transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
