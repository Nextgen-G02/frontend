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
    <section className="py-16 md:py-24" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 md:mb-12 relative border-b border-black/5 pb-6 md:pb-8">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-[1px] bg-primary"></div>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary">{category}</p>
            </div>
            <h2 className="heading-premium text-2xl md:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={prev}
              disabled={startIndex === 0}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg md:text-xl">←</span>
            </button>
            <button 
              onClick={next}
              disabled={startIndex + itemsPerPage >= products.length}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
            >
              <span className="text-lg md:text-xl">→</span>
            </button>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {visibleProducts.map((p) => (
            <div key={p._id} className="group bg-white rounded-[20px] md:rounded-[32px] overflow-hidden border border-slate-100 shadow-premium hover:shadow-active transition-all duration-500 flex flex-col">
              
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                {/* Category Badge */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10">
                  <div className="bg-white/95 backdrop-blur-sm text-slate-900 px-2 md:px-4 py-1 md:py-1.5 rounded-full text-[7px] md:text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">
                    {category}
                  </div>
                </div>

                <img
                  src={(p.images && p.images[0]) || (p.pImg && p.pImg[0]) || '/placeholder.png'}
                  alt={p.pName}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
              </div>

              {/* Product Info */}
              <div className="p-3 md:p-6 flex flex-col flex-grow">
                <h3 className="text-xs md:text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1 mb-0.5 md:mb-1">
                  {p.pName}
                </h3>
                <p className="text-[8px] md:text-xs text-slate-400 font-medium line-clamp-1 mb-3 md:mb-6">
                  {p.description || "Freshly baked handcrafted delicacy."}
                </p>

                <div className="mt-auto space-y-3 md:space-y-6">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[6px] md:text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Unit Val</span>
                      <p className="text-sm md:text-2xl font-black text-slate-900 tracking-tighter">
                        <span className="text-[9px] md:text-sm text-slate-900 mr-0.5">Rs.</span>
                        {p.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <span className={`text-[7px] md:text-[10px] font-black uppercase tracking-widest ${p.stock < 10 ? 'text-gold' : 'text-slate-300'}`}>
                      {p.stock < 10 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  
                  {/* Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 md:gap-3">
                    <button className="flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-3 border border-slate-100 rounded-lg md:rounded-2xl text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">
                      <Eye size={10} className="md:w-[14px]" /> Details
                    </button>
                    <button className="flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-3 bg-[#0f172a] text-gold rounded-lg md:rounded-2xl text-[7px] md:text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-200">
                      <ShoppingCart size={10} className="md:w-[14px]" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}