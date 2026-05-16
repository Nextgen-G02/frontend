import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, ShoppingCart, Sparkles, Star } from "lucide-react";

export default function ProductScroller({
  title = "Design Cakes",
  category = "cakes",
  bgColor = "transparent",
}) {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 4;

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/category/${category}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [category]);

  const next = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: bgColor === 'transparent' ? 'transparent' : bgColor }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 md:mb-16 border-b border-slate-200 pb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C29D59]"></span>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C29D59]">{category}</p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-slate-900 leading-tight">
              {title}
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={prev}
              disabled={startIndex === 0}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-500 disabled:opacity-20 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <button 
              onClick={next}
              disabled={startIndex + itemsPerPage >= products.length}
              className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 hover:bg-[#C29D59] hover:text-white hover:border-[#C29D59] transition-all duration-500 disabled:opacity-20 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID / SCROLLER */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {visibleProducts.map((p) => (
            <div key={p._id} className="group flex flex-col h-full bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100/50 shadow-sm hover:shadow-xl transition-all duration-700">
              
              {/* Product Image Wrapper - Square aspect for better balance */}
              <div className="relative aspect-square overflow-hidden bg-[#F9F6F2]">
                <img
                  src={(p.images && p.images[0]) || (p.pImg && p.pImg[0]) || '/placeholder.png'}
                  alt={p.pName}
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                />
                
                {/* Overlay Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-slate-900 shadow-sm border border-white/10">
                    {category}
                  </span>
                </div>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:bg-[#C29D59] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                    <Eye size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Product Content Section - Tighter padding */}
              <div className="p-4 md:p-6 flex flex-col flex-grow bg-white">
                <div className="mb-3">
                  <div className="flex items-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={8} className="fill-[#C29D59] text-[#C29D59] md:w-[10px]" />
                    ))}
                  </div>
                  <h3 className="font-serif text-base md:text-xl text-slate-900 leading-tight group-hover:text-[#C29D59] transition-colors line-clamp-1">
                    {p.pName}
                  </h3>
                  <p className="text-slate-400 text-[10px] md:text-xs mt-1.5 line-clamp-2 leading-relaxed font-medium">
                    {p.description || "An artisanal delicacy crafted with premium ingredients."}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-300">Investment</p>
                    <p className="text-base md:text-xl font-bold text-slate-900 tracking-tighter">
                      <span className="text-[10px] md:text-sm font-medium mr-0.5 text-slate-500">Rs.</span>
                      {p.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <button className="bg-slate-900 text-white p-2.5 md:p-3.5 rounded-xl md:rounded-2xl hover:bg-[#C29D59] transition-all duration-500 shadow-lg shadow-slate-100 hover:-translate-y-1 active:scale-90">
                    <ShoppingCart size={14} md:size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}