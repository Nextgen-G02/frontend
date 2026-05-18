import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, ShoppingCart, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductScroller({
  title = "Design Cakes",
  category = "cakes",
  bgColor = "transparent",
}) {
  const [products, setProducts] = useState([]);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = React.useRef(null);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  const generateSlug = (name, id) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/category/${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  // Handle scroll tracking for dots
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveDot(index);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: 'smooth'
      });
      setActiveDot(index);
    }
  };

  const next = () => {
    if (activeDot < Math.ceil(products.length / itemsPerPage) - 1) {
      scrollToIndex(activeDot + 1);
    }
  };

  const prev = () => {
    if (activeDot > 0) {
      scrollToIndex(activeDot - 1);
    }
  };

  const totalPages = Math.ceil(products.length / 4); // Show 4 per page on desktop, but dynamic on mobile

  return (
    <section className="py-12 md:py-16" style={{ backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 md:mb-10 border-b border-slate-200 pb-5 md:pb-6">
          <div className="space-y-2 md:space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {/* <span className="h-[1px] w-8 bg-[#C29D59]"></span> */}
              {/* <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C29D59]">{category}</p> */}
              <span className="md:hidden h-[1px] w-8 bg-[#C29D59]"></span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl text-slate-900 leading-tight">
              {title}
            </h2>
          </div>

          {/* Navigation Controls (Visible on Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={prev}
              disabled={activeDot === 0}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-500 disabled:opacity-20 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <button 
              onClick={next}
              disabled={activeDot >= totalPages - 1}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-500 disabled:opacity-20 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

        {/* PRODUCTS SCROLLER - Native Snap Scroll */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-stretch overflow-x-auto snap-x snap-mandatory gap-4 md:gap-8 no-scrollbar pb-6 md:pb-8 scroll-smooth px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((p) => (
            <div 
              key={p._id} 
              className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[calc(33.333%-22px)] lg:w-[calc(25%-24px)] snap-center first:ml-4 last:mr-4 cursor-pointer"
              onClick={() => navigate(`/product/${generateSlug(p.pName, p._id)}`)}
            >
              <div className="group flex flex-col h-full bg-white rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-100/50 shadow-sm hover:shadow-xl transition-all duration-700">
                
                {/* Product Image Wrapper - Compact Square */}
                <div className="relative aspect-square overflow-hidden bg-[#F9F6F2] flex-shrink-0">
                  <img
                    src={(p.images && p.images[0]) || (p.pImg && p.pImg[0]) || '/placeholder.png'}
                    alt={p.pName}
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                  />
                  
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-slate-900 shadow-sm border border-white/10">
                      {category}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:bg-[#C29D59] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                      <Eye size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Content - Compact top spacing */}
                <div className="pt-3 px-4 pb-4 md:pt-4 md:px-5 md:pb-5 lg:pt-5 lg:px-6 lg:pb-6 flex flex-col flex-grow bg-white">
                  <div className="mb-2">
                    <div className="flex items-center gap-0.5 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} className="fill-[#C29D59] text-[#C29D59] md:w-[10px]" />
                      ))}
                    </div>
                    {/* Compact fixed height for title */}
                    <div className="min-h-[2.2rem] md:min-h-[2.8rem] flex items-start">
                      <h3 className="font-serif text-base md:text-lg lg:text-xl text-slate-900 leading-tight group-hover:text-[#C29D59] transition-colors line-clamp-2">
                        {p.pName}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-base md:text-xl font-bold text-slate-900 tracking-tighter">
                        <span className="text-[10px] md:text-sm font-medium mr-0.5 text-slate-500">Rs.</span>
                        {p.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                      className="bg-slate-900 text-white p-2.5 md:p-3 rounded-xl md:rounded-2xl hover:bg-[#C29D59] transition-all duration-500 shadow-lg shadow-slate-100 hover:-translate-y-1 active:scale-95 flex-shrink-0"
                    >
                      <ShoppingCart size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION DOTS - Grouped Logic for Mobile */}
        <div className="flex justify-center items-center gap-3 mt-4 md:hidden">
          {[...Array(Math.min(products.length, 6))].map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                activeDot === i 
                  ? "w-8 bg-[#C29D59]" 
                  : "w-1.5 bg-slate-200"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}