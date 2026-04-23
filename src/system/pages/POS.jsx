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
  ChevronRight
} from "lucide-react";
import productApi from "../../shared/api/productApi";
import orderApi from "../../shared/api/orderApi";
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
      const data = await productApi.getProducts();
      setProducts(data);
      const uniqueCats = ["All", ...new Set(data.map(p => p.pCategory))];
      setCategories(uniqueCats);
    } catch {
      toast.error("Failed to load products");
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
          category: item.pCategory,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization
        })),
        paymentMethod,
        status: "Completed",
        totalAmount: calculateTotal(),
        scheduleDate: new Date().toISOString().split('T')[0],
        scheduleTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
      };

      await orderApi.createOrder(orderData);
      toast.success("Sale completed successfully!");
      setCart([]);
      setCustomerName("Walk-in Customer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to complete sale");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === "All" || p.pCategory === selectedCategory;
    const matchesSearch = p.pName.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-140px)] gap-8 overflow-hidden max-w-[1500px] mx-auto">
      {/* Left Side: Product Selection */}
      <div className="flex-1 flex flex-col gap-8 overflow-hidden">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
             <span className="w-10 h-1 bg-primary rounded-full"></span>
             <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Terminal Interface / Direct Transmission</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <h1 className="heading-premium text-2xl md:text-5xl leading-tight">Point of <span className="italic font-medium text-slate-400">Sale</span></h1>
            
            {/* Search Bar */}
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
              </div>
              <input
                type="text"
                placeholder="Query catalog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 md:pl-12 pr-5 md:pr-6 py-3 md:py-3 border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 placeholder:text-slate-200 font-bold shadow-sm text-xs md:text-sm rounded-xl"
              />
            </div>
          </div>

          {/* Categories Scroller */}
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar border-b border-slate-100">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-lg whitespace-nowrap font-black text-[9px] uppercase tracking-widest transition-all duration-500 border ${
                  selectedCategory === cat 
                  ? "bg-slate-900 text-gold border-slate-900 shadow-lg -translate-y-0.5" 
                  : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pr-1 md:pr-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 no-scrollbar pb-8 min-h-[400px]">
          {filteredProducts.map(product => (
            <button
              key={product._id}
              onClick={() => addToCart(product)}
              className="glass-card p-3.5 rounded-[24px] text-left hover:scale-[1.02] active:scale-95 flex flex-col gap-3 group border-none shadow-md hover:shadow-xl transition-all duration-700 bg-white/70 backdrop-blur-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 group-hover:bg-primary transition-colors"></div>
              <div className="relative aspect-square rounded-[18px] overflow-hidden bg-slate-50 border border-slate-100">
                <img 
                  src={product.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"} 
                  alt={product.pName}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                />
                <div className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-slate-900/90 backdrop-blur-md rounded-lg shadow-2xl border border-white/10">
                  <span className="text-[9px] font-black text-gold uppercase tracking-widest leading-none">Rs.{product.price}</span>
                </div>
              </div>
              <div className="px-0.5">
                <h3 className="font-black text-slate-900 text-[13px] uppercase tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{product.pName}</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{product.pCategory}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="w-full lg:w-[400px] flex flex-col gap-4 h-[700px] lg:h-full">
        <div className="flex-1 bg-white rounded-[24px] md:rounded-[40px] border-none shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden relative border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
          
          {/* Cart Header */}
          <div className="p-5 md:p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 md:p-3.5 bg-slate-900 text-gold rounded-lg md:rounded-xl shadow-xl">
                <ShoppingCart size={18} md:size={20} />
              </div>
              <div>
                 <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">Boutique Cart</h2>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5 tracking-[0.2em]">Transmission Mode</p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 bg-slate-50 text-slate-900 rounded-full text-[8px] md:text-[9px] font-black border border-slate-100">{cart.length} ASSETS</span>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-60">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center mb-5 shadow-inner">
                  <CakeSlice size={40} className="text-slate-200" />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Registry is Void</p>
                <p className="text-[10px] text-slate-400 mt-1 font-medium italic">"Await input sequence from catalog grid."</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item._id} className="flex gap-4 p-4 rounded-[24px] bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:shadow-lg hover:-translate-y-0.5">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-100 shadow-sm">
                    <img src={item.pImg?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-wider leading-tight line-clamp-1">{item.pName}</h4>
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

          {/* Cart Footer */}
          <div className="p-5 md:p-8 bg-slate-50/80 backdrop-blur-xl border-t border-slate-100 space-y-5 md:space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-lg md:rounded-xl border border-slate-100 shadow-sm focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <User size={16} md:size={18} className="text-primary" />
                <div className="flex flex-col flex-1">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Personnel Identity</span>
                   <input 
                     type="text" 
                     value={customerName} 
                     onChange={(e) => setCustomerName(e.target.value)}
                     className="bg-transparent border-none outline-none text-[11px] md:text-xs text-slate-900 font-bold w-full uppercase tracking-tight"
                     placeholder="Customer Identity"
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setPaymentMethod("Cash")}
                  className={`flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                    paymentMethod === "Cash" 
                    ? "bg-slate-900 text-gold border-slate-900 shadow-xl translate-y-[-1px]" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Banknote size={16} md:size={18} /> Currency
                </button>
                <button 
                  onClick={() => setPaymentMethod("Card")}
                  className={`flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 border-2 ${
                    paymentMethod === "Card" 
                    ? "bg-slate-900 text-gold border-slate-900 shadow-xl translate-y-[-1px]" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <CreditCard size={16} md:size={18} /> Transmit
                </button>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 pt-5 md:pt-6">
               <div className="space-y-0.5">
                  <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[8px] md:text-[9px]">Net Settlement</p>
                  <span className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">Rs.{calculateTotal().toLocaleString()}</span>
               </div>
               <div className="p-2.5 md:p-3 bg-slate-100 rounded-lg md:rounded-xl text-slate-300">
                  <CreditCard size={18} md:size={20} />
               </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full py-4 md:py-4.5 bg-slate-900 text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] shadow-2xl shadow-slate-200 hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10">{loading ? "Synchronizing..." : "Authorize Settlement"}</span>
              {!loading && <CheckCircle2 className="relative z-10" size={16} md:size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

