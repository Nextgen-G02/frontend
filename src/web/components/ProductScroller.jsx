import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductScroller({
  title = "Design Cakes",
  category = "cakes",
  bgColor = "#d6cfc7",
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

  const visibleProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <section className="py-8 md:py-12 bg-white" style={{ backgroundColor: bgColor }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex justify-between items-end mb-8 md:mb-10 relative border-b border-black/5 pb-5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-1 bg-primary rounded-full"></div>
             <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
               {title}
             </h2>
          </div>

          <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em] cursor-pointer hover:translate-x-1 transition-transform flex items-center gap-2">
            Explore Collection <span className="text-lg">→</span>
          </span>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative group/carousel">

          {/* LEFT BUTTON */}
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl w-10 h-10 md:w-12 md:h-12 rounded-full z-20 hover:bg-slate-900 hover:text-white disabled:opacity-0 transition-all duration-500 border border-slate-100 flex items-center justify-center text-xl font-light"
          >
            ‹
          </button>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {visibleProducts.map((p) => (
              <div key={p._id} className="group flex flex-col">

                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] md:rounded-[32px] bg-slate-50 border border-slate-100">
                  <img
                    src={(p.images && p.images[0]) || (p.pImg && p.pImg[0]) || '/placeholder.png'}
                    alt={p.pName}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                </div>

                {/* Content */}
                <div className="mt-4 md:mt-5 px-1">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-3 h-[1px] bg-primary"></span>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{category}</p>
                  </div>
                  <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                    {p.pName}
                  </h3>

                  <div className="flex items-center justify-between mt-3 md:mt-4">
                    <p className="text-base md:text-lg font-black text-slate-900 tracking-tighter">
                      <span className="text-[10px] text-primary mr-1">Rs.</span>{p.price.toLocaleString()}
                    </p>
                    
                    <button className="h-8 md:h-10 px-4 md:px-5 bg-slate-900 text-gold text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-slate-100">
                      Configure
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT BUTTON */}
          <button
            onClick={next}
            disabled={startIndex + itemsPerPage >= products.length}
            className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-white shadow-2xl w-10 h-10 md:w-12 md:h-12 rounded-full z-20 hover:bg-slate-900 hover:text-white disabled:opacity-0 transition-all duration-500 border border-slate-100 flex items-center justify-center text-xl font-light"
          >
            ›
          </button>

        </div>

      </div>
    </section>
  );
}