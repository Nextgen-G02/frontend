import React, { useState, useEffect } from "react";

const ItemProduct = ({ searchParams }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-6 px-6">
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 px-6">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 px-0 mt-2">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full rounded-xl md:rounded-2xl shadow-sm overflow-hidden bg-white border border-slate-100 font-sans hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
        >
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              src={
                product.pImg?.[0] ||
                "https://images.unsplash.com/photo-1621303837174-89787a7d4729"
              }
              alt={product.pName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute top-2 right-2">
              <span className="text-[8px] font-black px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-100 shadow-sm uppercase tracking-widest">
                {product.pCategory}
              </span>
            </div>
          </div>

          <div className="p-3.5 md:p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1">{product.pName}</h3>
            </div>

            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-3 h-8">{product.description}</p>

            <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Unit Val</span>
                <span className="text-sm md:text-base font-black text-slate-900 tracking-tighter">
                  Rs.{product.price?.toLocaleString()}
                </span>
              </div>
              {/* ✅ stock + stockStatus from schema */}
              <div className="text-right">
                <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${
                    product.stockStatus === "In Stock"
                      ? "text-emerald-500"
                      : product.stockStatus === "Low Stock"
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}>
                  {product.stockStatus}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Qty: {product.stock}</span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-50 pt-3.5">
              <button className="flex-1 border border-slate-100 rounded-lg py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                Details
              </button>
              <button className="flex-1 bg-slate-900 text-gold rounded-lg py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-slate-100">
                Options
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemProduct;
