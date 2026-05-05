import React, { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";

const slides = [
  {
    image: "/images/img1.png",
    titlePart1: "Delight in Every",
    titlePart2: "Bite of Happiness",
    description: "Indulge in our handcrafted cakes, made with the finest ingredients and a sprinkle of love.",
    lightText: false, // Use dark text for this slide as it has a light background area
  },
  {
    image: "/images/hero_2.png",
    titlePart1: "Heavenly",
    titlePart2: "Gourmet Cakes",
    description: "Exquisite flavors crafted with precision and passion for your special moments.",
    lightText: true,
  },
  {
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    titlePart1: "Signature",
    titlePart2: "Sweet Treats",
    description: "Freshly baked daily using only the finest premium ingredients.",
    lightText: true,
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 10000); // Slower interval for better readability

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prev = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] lg:h-[750px] overflow-hidden bg-white group/hero">
      
      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative overflow-hidden">
            
            {/* Image Container with Responsive Handling */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={slide.image}
                alt={`${slide.titlePart1} ${slide.titlePart2}`}
                className={`w-full h-full object-cover ${index === 0 ? 'object-right md:object-center' : 'object-center'}`}
              />
              
              {/* Gradient Overlay for Readability - Modern Look */}
              <div className={`absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent ${!slide.lightText ? 'from-white/60 via-white/30' : ''}`}></div>
            </div>

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-20 lg:px-32">
              <div className="max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
                <h1 className={`text-4xl md:text-6xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6 drop-shadow-sm ${slide.lightText ? 'text-white' : 'text-slate-900'}`}>
                  {slide.titlePart1} <br />
                  <span className="text-[#B38B59] drop-shadow-none">{slide.titlePart2}</span>
                </h1>
                
                <p className={`text-base md:text-lg lg:text-xl mb-10 max-w-lg leading-relaxed font-medium ${slide.lightText ? 'text-white/90' : 'text-slate-700'}`}>
                  {slide.description}
                </p>

                <div className="flex flex-wrap items-center gap-6">
                  {/* ORDER NOW Button */}
                  <button className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-[#B38B59] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                    Order Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* WATCH OUR STORY Button */}
                  <button className={`group flex items-center gap-3 px-2 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${slide.lightText ? 'text-white' : 'text-slate-900'}`}>
                    <div className="w-12 h-12 rounded-full border-2 border-[#B38B59]/30 flex items-center justify-center group-hover:border-[#B38B59] transition-all duration-500 bg-white/10 backdrop-blur-sm">
                      <Play className="w-4 h-4 fill-[#B38B59] text-[#B38B59] group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="group-hover:text-[#B38B59] transition-colors">Watch Our Story</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <button
          onClick={prev}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
        >
          <span className="text-2xl">‹</span>
        </button>
      </div>
      
      <div className="absolute inset-y-0 right-4 flex items-center">
        <button
          onClick={next}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-white hover:text-slate-900"
        >
          <span className="text-2xl">›</span>
        </button>
      </div>

      {/* INDICATORS */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              current === i ? "bg-[#B38B59] w-10" : "bg-white/40 w-5 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
