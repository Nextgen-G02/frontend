import React, { useState, useEffect } from "react";
import { ShoppingCart, Info, X, CreditCard } from "lucide-react";
import { useCart } from "../../../shared/context/CartContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ItemProduct = ({ searchParams }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const generateSlug = (name, id) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + id;
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`, {
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
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.pName.toLowerCase().includes(searchParams.search.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchParams.search.toLowerCase());
    const matchesCategory = searchParams.category === "all" || product.pCategory === searchParams.category;

    // Price range validation
    const price = product.price || 0;
    const matchesMinPrice = !searchParams.minPrice || price >= Number(searchParams.minPrice);
    const matchesMaxPrice = !searchParams.maxPrice || price <= Number(searchParams.maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

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

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-6 px-6 py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <p className="font-black uppercase tracking-widest text-[10px] text-slate-300 italic">No products found matching your criteria</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-0 mt-2">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="w-full rounded-xl md:rounded-2xl shadow-sm overflow-hidden bg-white border border-slate-100 font-sans hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group"
          >
            {/* Clickable Product Details Area */}
            <div
              onClick={() => navigate(`/product/${generateSlug(product.pName, product._id)}`)}
              className="cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={
                    product.images?.[0] ||
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

              <div className="p-3.5 md:p-4 pb-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-gold transition-colors">{product.pName}</h3>
                </div>

                <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-3 h-8">{product.description}</p>

                <div className="flex justify-between items-end mb-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Unit Val</span>
                    <span className="text-sm md:text-base font-black text-slate-900 tracking-tighter">
                      Rs.{product.price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] font-black uppercase tracking-widest block mb-1 ${product.stockStatus === "In Stock"
                      ? "text-emerald-500"
                      : product.stockStatus === "Low Stock"
                        ? "text-amber-500"
                        : "text-rose-500"
                      }`}>
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Actions Area */}
            <div className="p-3.5 md:p-4 pt-0">
              <div className="flex gap-2 border-t border-slate-50 pt-3.5">
                <button
                  disabled={product.stockStatus === "Out of Stock"}
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.pName} added to cart!`);
                  }}
                  className={`flex-1 rounded-lg py-2 text-[9px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 px-1 transition-all ${product.stockStatus === "Out of Stock"
                      ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gold/10 border border-gold/40 text-[#84632A] hover:bg-gold hover:text-white"
                    }`}
                >
                  <ShoppingCart size={12} />
                  {product.stockStatus === "Out of Stock" ? "Add to cart" : "Add to Cart"}
                </button>
                <button
                  disabled={product.stockStatus === "Out of Stock"}
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.pName} added to cart!`);
                    navigate('/cart');
                  }}
                  className={`flex-1 rounded-lg py-2 text-[9px] font-bold uppercase tracking-wide flex items-center justify-center gap-1 px-1 transition-all active:bg-slate-950 ${product.stockStatus === "Out of Stock"
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-gold text-slate-900 hover:bg-slate-900 hover:text-white shadow-lg shadow-gold/10"
                    }`}
                >
                  <CreditCard size={12} />
                  {product.stockStatus === "Out of Stock" ? "Sold Out" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row h-full">
              {/* Modal Image */}
              <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                <img
                  src={selectedProduct.images?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"}
                  alt={selectedProduct.pName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Modal Content */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div>
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-100">
                      {selectedProduct.pCategory}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter mt-4 leading-none">
                      {selectedProduct.pName}
                    </h2>
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                    {selectedProduct.description || "No detailed description available for this masterpiece."}
                  </p>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Premium Value</span>
                      <span className="text-2xl font-black text-slate-900">Rs.{selectedProduct.price?.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${selectedProduct.stockStatus === "In Stock" ? "text-emerald-500" : "text-amber-500"
                        }`}>
                        {selectedProduct.stockStatus}
                      </span>

                    </div>
                  </div>

                  <button
                    disabled={selectedProduct.stockStatus === "Out of Stock"}
                    onClick={() => {
                      addToCart(selectedProduct);
                      toast.success(`${selectedProduct.pName} added to cart!`);
                      setSelectedProduct(null);
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-500 mt-4 flex items-center justify-center gap-3 ${selectedProduct.stockStatus === "Out of Stock"
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-slate-900 text-gold shadow-xl shadow-slate-200 hover:bg-gold hover:text-white"
                      }`}
                  >
                    <ShoppingCart size={16} />
                    {selectedProduct.stockStatus === "Out of Stock" ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemProduct;