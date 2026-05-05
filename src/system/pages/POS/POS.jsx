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
  Package,
  X
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Receipt from "./Receipt";

export default function POSTerminal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [completedOrder, setCompletedOrder] = useState(null);

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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Sale completed successfully!");
      setCompletedOrder(response.data); // Use the real data from backend (with ID)
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
      className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 w-full max-w-full mx-auto px-6 pt-6 bg-slate-50/20"
      style={{ height: 'calc(100vh - 24px)', overflow: 'hidden' }}
    >
      {/* Left Side: Product Selection */}
      <div className="min-w-0 flex flex-col gap-6 overflow-hidden pr-2">
        <header className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              POS <span className="text-slate-400 italic">Terminal</span>
            </h1>
            
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
                }}
                className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-100 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 placeholder:text-slate-300 font-bold shadow-sm rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar border-b border-slate-50">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-6 py-2 rounded-lg whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  selectedCategory === cat
                  ? "bg-slate-900 text-gold shadow-lg" 
                  : "bg-white text-slate-400 hover:text-slate-600"
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
                className="bg-white p-4 rounded-[24px] text-center group border border-slate-50 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 flex flex-col gap-4"
              >
                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-slate-50 p-1 border border-slate-100">
                  <img 
                    src={product.images?.[0] || product.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"} 
                    alt={product.pName}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-tight line-clamp-2 h-8">{product.pName}</h3>
                  <p className="text-[12px] font-black text-primary">Rs.{product.price}</p>
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
              <div className="space-y-1">
                {cart.map((item, idx) => (
                  <div key={item._id} className="bg-white border-b border-slate-50 py-3 group">
                    <div className="flex items-center justify-between gap-4">
                      {/* Name - Left Aligned */}
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-300 w-4 shrink-0">{idx + 1}</span>
                        <input 
                          type="text" 
                          value={item.pName}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setCart(prev => prev.map(c => c._id === item._id ? { ...c, pName: newName } : c));
                          }}
                          className="bg-transparent border-none outline-none font-black text-slate-900 text-[11px] uppercase tracking-wider w-full focus:ring-0 p-0 h-4"
                        />
                      </div>

                      {/* Quantity Controls - Center */}
                      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100 shrink-0">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded transition-all"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-[11px] font-black text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded transition-all"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      
                      {/* Price - Right Aligned */}
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-black text-slate-900 text-xs w-20 text-right">Rs.{item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="p-1.5 text-slate-200 hover:text-primary transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

            <div className="flex justify-between items-center py-2">
                <p className="text-slate-900 font-black uppercase tracking-widest text-[11px]">Payable Amount</p>
                <span className="text-2xl font-black text-primary tracking-tighter">Rs.{calculateTotal().toLocaleString()}</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="flex-1 py-4 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-3"
              >
                {loading ? "Synchronizing..." : "Proceed to Checkout"}
                {!loading && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {completedOrder && (
        <Receipt 
          order={completedOrder} 
          onClose={() => setCompletedOrder(null)} 
        />
      )}
    </div>
  );
}