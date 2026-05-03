import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  CreditCard, 
  Banknote, 
  CakeSlice,
  ChevronRight,
  Package
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function POSTerminal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
      const data = response.data.data;
      setProducts(data);
      const uniqueCats = ["All", ...new Set(data.flatMap(p => Array.isArray(p.pCategory) ? p.pCategory.map(c => c.trim()) : [p.pCategory?.trim()]).filter(Boolean))];
      setCategories(uniqueCats);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => 
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, customization: { message: "", flavor: "", specialInstructions: "" } }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName,
        type: "DirectSale",
        items: cart.map(item => ({
          pName: item.pName,
          category: Array.isArray(item.pCategory) ? item.pCategory.join(', ') : (item.pCategory || 'General'),
          quantity: item.quantity,
          price: item.price,
          customization: item.customization
        })),
        paymentMethod: paymentMethod || "Cash",
        status: "Completed",
        totalAmount: calculateTotal(),
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
      };

      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomerName("Walk-in Customer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== "All") setSearch("");
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === "All" || 
                      (p.pCategory && (
                        Array.isArray(p.pCategory)
                          ? p.pCategory.some(pCat => pCat.trim().toLowerCase() === selectedCategory.toLowerCase())
                          : p.pCategory.trim().toLowerCase() === selectedCategory.toLowerCase()
                      ));
    const matchesSearch = (p.pName || "").toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 w-full max-w-full mx-auto px-6 bg-slate-50/20"
      style={{ height: 'calc(100vh - 150px)', overflow: 'hidden' }}
    >
      {/* Left Side: Product Selection */}
      <div className="min-w-0 flex flex-col gap-6 overflow-hidden pr-2">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
             <span className="w-10 h-1 bg-primary rounded-full"></span>
             <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Terminal Interface / Direct Transmission</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="heading-premium text-3xl md:text-5xl leading-tight">POS <span className="italic font-medium text-slate-400">Terminal</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-8 h-px bg-slate-200"></span> Live Catalog Interface
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-slate-300 group-focus-within:text-primary transition-all duration-500" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value) setSelectedCategory("All");
                }}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 placeholder:text-slate-300 font-bold shadow-sm rounded-2xl text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-7 py-3 rounded-xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-500 border-2 ${
                  selectedCategory === cat
                  ? "bg-slate-900 text-gold border-slate-900 shadow-xl -translate-y-1 scale-105" 
                  : "bg-white text-slate-400 hover:bg-slate-50 border-slate-50 hover:border-slate-100 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 no-scrollbar pb-10">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-3.5 rounded-[24px] bg-white/50 animate-pulse h-[220px]">
                <div className="w-full aspect-square bg-slate-100 rounded-[18px] mb-3"></div>
                <div className="h-3 w-3/4 bg-slate-100 rounded-full mb-2"></div>
                <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
              </div>
            ))
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
              <Package size={48} className="text-slate-300 mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">No matches in catalog</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <button
                key={product._id}
                onClick={() => addToCart(product)}
                className="glass-card p-4 rounded-[32px] text-left group border-none shadow-md hover:shadow-2xl transition-all duration-700 bg-white relative overflow-hidden flex flex-col gap-4 min-h-[260px]"
              >
                <div className="relative w-full rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 shrink-0" style={{ aspectNumbers: "1/1", aspectRatio: "1/1", minHeight: "150px" }}>
                  <img 
                    src={product.images?.[0] || product.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"} 
                    alt={product.pName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                      <Plus className="text-primary" size={24} />
                    </div>
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">Rs.{product.price}</span>
                  </div>
                </div>
                <div className="px-1 space-y-1.5">
                  <h3 className="font-black text-slate-900 text-[13px] uppercase tracking-tight line-clamp-2 group-hover:text-primary transition-colors h-9">{product.pName}</h3>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {Array.isArray(product.pCategory) ? (
                      product.pCategory.map((cat, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[8px] font-black uppercase tracking-widest">{cat}</span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[8px] font-black uppercase tracking-widest">{product.pCategory || "Asset"}</span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="h-full min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white rounded-[24px] md:rounded-[40px] border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden relative border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
          
          {/* Cart Header */}
          <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-900 text-gold rounded-xl shadow-lg">
                  <ShoppingCart size={20} />
                </div>
                <div className="space-y-0.5">
                   <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Boutique Cart</h2>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission Mode</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black border border-slate-900 shadow-sm">{cart.length} ASSETS</span>
              </div>
            </div>
          </div>

          {/* Cart Items - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 min-h-0">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center shadow-inner group transition-transform hover:scale-110">
                  <ShoppingCart size={48} className="text-slate-200" />
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Empty Cart</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium italic px-8">Select items from the catalog to begin a transaction.</p>
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex gap-4 p-4 rounded-[24px] bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-100 shadow-sm">
                    <img src={item.images?.[0] || item.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider leading-tight line-clamp-2 pr-4">{item.pName}</h4>
                      <button 
                        onClick={() => removeFromCart(item._id)}
                        className="p-1 text-slate-300 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Yield Valuation</p>
                         <p className="font-black text-primary text-base tracking-tighter leading-none">Rs.{item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm scale-90 origin-right transition-transform group-hover:scale-100">
                        <button onClick={() => updateQuantity(item._id, -1)} className="p-0.5 text-slate-300 hover:text-primary transition-colors"><Minus size={12} /></button>
                        <span className="text-[11px] font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="p-0.5 text-slate-300 hover:text-primary transition-colors"><Plus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Cart Footer */}
          <div className="p-6 bg-slate-50/95 backdrop-blur-xl border-t border-slate-100 space-y-4 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] relative z-20 shrink-0">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                <User size={16} className="text-primary" />
                <div className="flex flex-col flex-1">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Personnel Identity</span>
                   <input 
                     type="text" 
                     value={customerName} 
                     onChange={(e) => setCustomerName(e.target.value)}
                     className="bg-transparent border-none outline-none text-[11px] text-slate-900 font-bold w-full uppercase tracking-tight h-4"
                     placeholder="Customer Name"
                   />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 py-3 bg-slate-900 text-gold rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                <Banknote size={16} /> Cash Mode
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100/50 pt-3">
               <div className="space-y-0.5">
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[8px]">Grand Total</p>
                  <span className="text-2xl font-black text-slate-900 tracking-tighter">Rs.{calculateTotal().toLocaleString()}</span>
               </div>
               <div className="p-3 bg-slate-100 rounded-xl text-slate-300">
                  <Banknote size={20} />
               </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10">{loading ? "Synchronizing..." : "Complete Checkout"}</span>
              {!loading && <CheckCircle2 className="relative z-10 group-hover:scale-110 transition-transform" size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}