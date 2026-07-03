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
    <section className="py-12 md:py-24 lg:py-28 bg-[#FDFBF8] overflow-hidden relative">
      {/* Background Stylized Text - Refined for mobile */}
      <div className="absolute top-0 left-0 w-full overflow-hidden select-none pointer-events-none opacity-[0.02] translate-y-6 md:translate-y-20">
        <h1 className="text-[5rem] md:text-[14rem] lg:text-[18rem] font-black uppercase leading-none whitespace-nowrap animate-marquee">
          CUSTOMIZE CAKE CUSTOMIZE CAKE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center">
          
          {/* Right Side (Text) - Order 2 on mobile */}
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-12 order-2 lg:order-2">
            <div className="space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="h-[1px] w-8 md:w-12 bg-slate-900"></span>
                <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-900">Personalized Cake Experiences</p>
                <span className="lg:hidden h-[1px] w-8 bg-slate-900"></span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl leading-[1.1] tracking-tight text-slate-900">
                Dream it. <br />
                <span className="text-[#C29D59] italic font-light">We'll bake it.</span>
              </h2>
              
              <p className="text-slate-500 text-xs md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Create your perfect custom cake with designs tailored to your style, theme, and celebration. From simple elegance to creative masterpieces, we bring your ideas to life with handcrafted sweetness.
              </p>
            </div>

            {/* Steps - Horizontal/Grid on all screens for 'miniature' look */}
            <div className="grid grid-cols-3 gap-2 md:gap-8">
              {steps.map((step, idx) => (
                <div key={idx} className="space-y-2 md:space-y-4 group cursor-default text-center lg:text-left">
                  <div className="relative flex justify-center lg:justify-start">
                    <span className="absolute -top-2 md:-top-4 left-1/2 lg:left-0 -translate-x-1/2 lg:translate-x-0 text-xl md:text-5xl font-black text-slate-100 group-hover:text-[#C29D59]/10 transition-colors duration-500">0{idx + 1}</span>
                    <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-500 border border-slate-50">
                      {React.cloneElement(step.icon, { size: 16, className: "text-[#C29D59]" })}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[7px] md:text-xs font-black text-slate-900 uppercase tracking-widest">{step.title}</h3>
                    <p className="text-[6px] md:text-xs text-slate-400 leading-tight md:leading-relaxed font-medium line-clamp-2 md:line-clamp-none">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 md:pt-6 flex justify-center lg:justify-start">
              <Link 
                to="/customize" 
                className="group relative inline-flex items-center gap-3 md:gap-4 bg-slate-900 text-white px-6 py-3 md:px-10 md:py-5 rounded-lg md:rounded-[20px] overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto justify-center"
              >
                <div className="absolute inset-0 bg-[#C29D59] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-20 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[11px] group-hover:text-slate-900 transition-colors duration-500">
                  Start Custom Design
                </span>
                <ArrowRight 
                  size={14} 
                  className="relative z-20 transition-all duration-500 group-hover:translate-x-2 group-hover:text-slate-900" 
                />
              </Link>
            </div>
          </div>

          {/* Left Side: Creative Image Composition - Order 1 on mobile */}
          <div className="w-full lg:w-1/2 relative order-1 lg:order-1">

            <div className="relative group max-w-[320px] mx-auto lg:max-w-none">
              <div className="relative z-10 aspect-square rounded-[40px] md:rounded-[80px] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-active">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200" 
                  alt="Artisanal Cake Design" 
                  className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 via-transparent to-transparent"></div>
                
                {/* Floating Content Card - Optimized for mobile tap/hover */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:left-10 md:right-10 translate-y-0 opacity-100 transition-all duration-700">
                  <div className="bg-white/10 backdrop-blur-xl p-4 md:p-8 rounded-[20px] md:rounded-[40px] border border-white/20 shadow-xl">
                    <div className="flex items-center gap-1 mb-2 md:mb-4">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={8} className="fill-[#C29D59] text-[#C29D59] md:w-[14px]" />
                       ))}
                    </div>
                    <p className="text-white text-[10px] md:text-lg font-medium leading-relaxed font-serif">
                      "Stunning attention to detail beyond my imagination."
                    </p>
                    <p className="text-white/60 text-[6px] md:text-xs mt-2 md:mt-4 uppercase tracking-[0.2em] font-black">— Sarah J.</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements - subtle for mobile */}
              <div className="absolute -top-4 -left-4 md:-top-10 md:-left-10 bg-[#C29D59] text-white w-16 h-16 md:w-32 md:h-32 rounded-full flex items-center justify-center text-center p-3 shadow-xl rotate-12 z-20">
                <span className="text-[6px] md:text-xs font-black uppercase tracking-widest leading-tight">Bespoke Excellence</span>
              </div>
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
