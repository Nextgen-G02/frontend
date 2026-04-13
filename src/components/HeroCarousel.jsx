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
    <div className="relative w-full h-[500px] overflow-hidden">

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
            <div className="absolute inset-0 flex flex-col justify-center items-start px-10 md:px-20 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-5">
                {slide.subtitle}
              </p>

              <button className="bg-[#c89b6d] px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition">
                Order Now
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* LEFT BUTTON */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur w-10 h-10 rounded-full shadow-md hover:bg-white transition"
      >
        ‹
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur w-10 h-10 rounded-full shadow-md hover:bg-white transition"
      >
        ›
      </button>

      {/* DOTS */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              current === i ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}