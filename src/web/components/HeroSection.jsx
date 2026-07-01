import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const imageSets = [
  {
    leftFront: "/images/hero-left-1.png",
    leftBack: "/images/hero-left-2.png",
    right: "/images/hero-right.png",
  },
  {
    leftFront: "/images/hero-left-3.png",
    leftBack: "/images/hero-left-4.png",
    right: "/images/hero_1.png",
  },
  {
    leftFront: "/images/hero-left-5.png",
    leftBack: "/images/hero-left-1.png",
    right: "/images/hero_2.png",
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % imageSets.length);
        setIsTransitioning(false);
      }, 800); // Sync with CSS transition duration
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = imageSets[index];

  return (
    <div className="relative w-full min-h-[300px] md:min-h-[90vh] bg-[#fbf9f4] overflow-hidden flex items-center justify-center pt-10 md:pt-20">
      
      {/* Hero Content Container - Forced 3-column layout */}
      <div className="max-w-[1440px] mx-auto w-full px-2 md:px-12 grid grid-cols-12 gap-1 md:gap-8 items-center relative z-10 py-4 md:py-8 lg:py-0">
        
        {/* Left Side Images - Visible on all screens */}
        <div className="col-span-3 flex flex-col gap-1 md:gap-8 relative h-[200px] md:h-[600px] justify-center">
          {/* Top (Front) Image */}
          <div className={`w-[60px] md:w-[180px] h-[80px] md:h-[240px] rounded-sm overflow-hidden shadow-lg self-end transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 -translate-x-3 md:-translate-x-10' : 'opacity-100 translate-x-0'}`}>
            <img 
              src={current.leftFront} 
              alt="Gourmet" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom (Back) Image */}
          <div className={`w-[75px] md:w-[220px] h-[110px] md:h-[320px] rounded-sm overflow-hidden shadow-lg -mt-3 md:-mt-12 ml-1 md:ml-4 transition-all duration-1000 delay-150 transform ${isTransitioning ? 'opacity-0 translate-y-3 md:translate-y-10' : 'opacity-100 translate-y-0'}`}>
            <img 
              src={current.leftBack} 
              alt="Elegant" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Center Text Content - col-span-6 */}
        <div className="col-span-6 flex flex-col items-center text-center px-1 md:px-4">
          {/* Decorative Branch Icon */}
          <div className="mb-2 md:mb-6">
            <svg width="18" height="28" md:width="40" md:height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C29D59]">
              <path d="M20 60C20 60 20 40 20 30M20 30C20 30 10 25 5 15M20 30C20 30 30 25 35 15M20 15V0M20 15C20 15 15 10 10 5M20 15C20 15 25 10 30 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="font-serif text-sm md:text-5xl lg:text-8xl text-slate-900 leading-[1.3] md:leading-[1.1] mb-3 md:mb-8 tracking-tighter md:tracking-normal">
            EXCLUSIVE <br className="hidden sm:block" /> 
            <span className="italic font-light">CHOCOLATE &</span> <br className="hidden sm:block" /> 
            SWEETS
          </h1>

          <div>
            <Link 
              to="/products"
              className="group relative inline-flex items-center justify-center px-4 md:px-12 py-2 md:py-5 bg-slate-900 hover:bg-slate-800 transition-all duration-500 shadow-lg"
            >
              <span className="text-[7px] md:text-[11px] font-sans font-medium uppercase tracking-[0.2em] md:tracking-[0.4em] text-white">
                Explore Collection
              </span>
              <div className="absolute -bottom-1 md:-bottom-2 -right-1 md:-right-2 w-full h-full border border-[#C29D59]/40 pointer-events-none transition-transform duration-500"></div>
            </Link>
          </div>
        </div>

        {/* Right Side Image - col-span-3 */}
        <div className="col-span-3 h-[200px] md:h-[600px] flex items-center">
          <div className={`w-full h-[150px] md:h-full rounded-sm overflow-hidden shadow-lg transition-all duration-1000 transform ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <img 
              src={current.right} 
              alt="Premium" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Decorative background elements - subtle for mobile */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f9f5f0] -z-10 skew-x-[-10deg] translate-x-5 md:translate-x-20"></div>

    </div>
  );
};

export default HeroSection;
