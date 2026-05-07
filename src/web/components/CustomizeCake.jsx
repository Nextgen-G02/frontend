import React from "react";
import { Paintbrush, Cake, Send, ArrowRight, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function CustomizeCake() {
  const steps = [
    {
      icon: <Cake className="text-gold" size={24} />,
      title: "Selection",
      desc: "Premium bases & rich fillings."
    },
    {
      icon: <Paintbrush className="text-gold" size={24} />,
      title: "Design",
      desc: "Upload inspiration or describe vision."
    },
    {
      icon: <Send className="text-gold" size={24} />,
      title: "Delivery",
      desc: "Review, quote, and fresh baking."
    }
  ];

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-white overflow-hidden relative">
      {/* Background Stylized Text - Responsive & Properly Constrained */}
      <div className="absolute top-0 left-0 w-full overflow-hidden select-none pointer-events-none opacity-[0.03] translate-y-10 md:translate-y-20">
        <h1 className="text-[8rem] md:text-[14rem] lg:text-[18rem] font-black uppercase leading-none whitespace-nowrap animate-marquee">
          CUSTOMIZE CAKE CUSTOMIZE CAKE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          
          {/* Left Side: Creative Image Composition */}
          <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
            <div className="relative group">
              {/* Organic Shape Container */}
              <div className="relative z-10 aspect-[4/5] sm:aspect-square rounded-[30px] md:rounded-[80px] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-active">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200" 
                  alt="Artisanal Cake Design" 
                  className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent"></div>
                
                {/* Floating Content Card */}
                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 translate-y-4 md:translate-y-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-[24px] md:rounded-[40px] border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={12} className="fill-gold text-gold md:w-[14px]" />
                       ))}
                    </div>
                    <p className="text-white text-sm md:text-lg font-medium leading-relaxed font-serif">
                      "The most stunning wedding cake I've ever seen. The attention to detail was beyond my imagination."
                    </p>
                    <p className="text-white/60 text-[8px] md:text-xs mt-3 md:mt-4 uppercase tracking-[0.2em] font-black">— Sarah J., Client</p>
                  </div>
                </div>
              </div>

              {/* Decorative Floating Elements */}
              <div className="hidden md:block absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full -z-10 animate-pulse"></div>
              <div className="hidden md:block absolute -bottom-12 -left-12 w-64 h-64 bg-amber-400/5 rounded-full -z-10"></div>
              
              {/* Floating Badge */}
              <div className="absolute -top-6 -left-6 md:-top-10 md:-left-10 bg-amber-400 text-white w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-center p-4 shadow-xl rotate-12 animate-pulse z-20">
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight">Handcrafted Excellence</span>
              </div>

              <div className="absolute -right-4 top-1/4 md:-right-8 z-20 bg-white p-4 md:p-6 rounded-[20px] md:rounded-[30px] shadow-2xl border border-slate-50 transform rotate-6 group-hover:rotate-0 transition-transform duration-700">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full flex items-center justify-center text-amber-500">
                    <Sparkles size={20} className="md:w-[24px]" />
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Handcrafted</p>
                    <p className="text-xs md:text-sm font-black text-slate-900">100% Unique</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: High-Impact Typography & Flow */}
          <div className="w-full lg:w-1/2 space-y-8 md:space-y-12 order-1 lg:order-2">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 md:w-12 bg-slate-900"></span>
                <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-900">The Bespoke Experience</p>
              </div>
              
              <h2 className="heading-premium text-3xl md:text-5xl lg:text-7xl leading-[1] tracking-tighter">
                Dream it. <br />
                <span className="text-gold italic font-normal">We'll bake it.</span>
              </h2>
              
              <p className="text-slate-500 text-xs md:text-lg max-w-xl leading-relaxed font-medium">
                Our artisanal customization service turns your wildest inspirations into delicious reality. Each creation is a unique story told in sugar and flour.
              </p>
            </div>

            {/* Steps with unique numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-3 md:space-y-4 group cursor-default">
                  <div className="relative">
                    <span className="absolute -top-3 md:-top-4 -left-1 text-3xl md:text-5xl font-black text-slate-50 group-hover:text-gold/10 transition-colors duration-500">0{idx + 1}</span>
                    <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center shadow-premium group-hover:shadow-active group-hover:-translate-y-1 transition-all duration-500 border border-slate-50">
                      {React.cloneElement(step.icon, { size: 20 })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[9px] md:text-xs font-black text-slate-900 uppercase tracking-widest">{step.title}</h3>
                    <p className="text-[9px] md:text-xs text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 md:pt-6">
              <Link 
                to="/customize" 
                className="group relative inline-flex items-center gap-3 md:gap-4 bg-slate-900 text-white px-8 py-4 md:px-10 md:py-5 rounded-[15px] md:rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-active hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                {/* Hover Background Layer - Using standard Amber/Gold color */}
                <div className="absolute inset-0 bg-amber-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                
                {/* Text Content */}
                <span className="relative z-20 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[11px] group-hover:text-slate-900 transition-colors duration-500">
                  Start Custom Design
                </span>
                
                {/* Icon */}
                <ArrowRight 
                  size={16} 
                  className="relative z-20 transition-all duration-500 group-hover:translate-x-2 group-hover:text-slate-900" 
                />
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}} />
    </section>
  );
}
