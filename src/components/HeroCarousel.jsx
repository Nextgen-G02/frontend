import React, { useEffect, useState } from "react";

const slides = [
  {
    image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
    title: "Delicious Cakes",
    subtitle: "Freshly baked with love",
  },
  {
    image: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg",
    title: "Sweet Pastries",
    subtitle: "Perfect for every moment",
  },
  {
    image: "https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg",
    title: "Chocolate Heaven",
    subtitle: "Rich taste you’ll love",
  },
  {
    image: "https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg",
    title: "Celebrate With Us",
    subtitle: "Make your day special",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prev = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[520px] overflow-hidden bg-slate-900 group/hero">

      {/* SLIDES */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">

            {/* Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-32 text-white">
              <div className="flex items-center gap-3 mb-4 animate-in slide-in-from-left duration-700">
                <div className="w-8 h-[2px] bg-gold"></div>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-gold">{slide.subtitle}</p>
              </div>
              <h1 className="text-3xl md:text-6xl font-black mb-8 md:mb-10 leading-tight tracking-tight uppercase max-w-2xl animate-in slide-in-from-left duration-1000">
                {slide.title.split(' ')[0]} <span className="italic font-medium text-slate-300">{slide.title.split(' ').slice(1).join(' ')}</span>
              </h1>

              <button className="bg-white text-slate-900 px-8 py-3.5 md:px-10 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl shadow-black/20 animate-in fade-in duration-1000 delay-500">
                Purchase Collection
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prev}
        className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/10 w-12 h-12 md:w-16 md:h-16 rounded-full text-white shadow-2xl hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center text-2xl font-light opacity-0 group-hover/hero:opacity-100 -translate-x-10 group-hover/hero:translate-x-0"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/10 w-12 h-12 md:w-16 md:h-16 rounded-full text-white shadow-2xl hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center text-2xl font-light opacity-0 group-hover/hero:opacity-100 translate-x-10 group-hover/hero:translate-x-0"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-8 w-full flex justify-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-500 rounded-full ${
              current === i ? "bg-white w-12" : "bg-white/30 w-6 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}