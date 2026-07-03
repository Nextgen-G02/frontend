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
  X,
  History,
  Eye,
  XCircle,
  ArrowLeft
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Receipt from "./Receipt";

export default function POSTerminal() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [completedOrder, setCompletedOrder] = useState(null);
  const [view, setView] = useState("catalog"); // "catalog" or "history"
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // StrictMode & Double-Execution Guard
  const isMounted = React.useRef(true);
  const initialFetchRef = React.useRef(false);

  // Optimized Product Fetching
  const fetchProducts = React.useCallback(async (silent = false) => {
    console.log(`[POS Registry] Initiation: silent=${silent}, current_products=${products.length}`);
    
    // Only show loading if we don't have products yet, or if it's a forced manual sync
    if (!silent) {
      setLoading(true);
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Missing VITE_BACKEND_URL configuration");
      }

      console.log(`[POS Registry] Fetching from: ${backendUrl}/api/products`);
      const response = await axios.get(`${backendUrl}/api/products`, {
        timeout: 15000 // Optimized 15s window for retail responsiveness
      });
      
      console.log("[POS Registry] Data received:", response.status);
      
      const rawBody = response.data;
      const validProducts = Array.isArray(rawBody.data) ? rawBody.data : (Array.isArray(rawBody) ? rawBody : []);
      
      if (!isMounted.current) return;

      if (validProducts.length === 0) {
        console.warn("[POS Registry] remote directory is empty.");
        setProducts([]);
        setCategories(["All"]);
      } else {
        console.log(`[POS Registry] Syncing ${validProducts.length} assets`);
        setProducts(validProducts);
        
        // Dynamic Category Mapping
        const catSet = new Set(["All"]);
        validProducts.forEach(p => {
          if (p.pCategory) {
            if (Array.isArray(p.pCategory)) {
              p.pCategory.forEach(c => c && catSet.add(c.trim()));
            } else {
              catSet.add(String(p.pCategory).trim());
            }
          }
        });
        setCategories(Array.from(catSet));
      }

      if (!silent && !initialFetchRef.current) {
        toast.success("Registry Synced Successfully");
        initialFetchRef.current = true;
      }
    } catch (error) {
      console.error("[POS Registry] Connection Failure:", {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
      
      if (!isMounted.current) return;

      const isTimeout = error.code === 'ECONNABORTED' || error.message.includes('timeout');
      if (!silent) {
        toast.error(isTimeout 
          ? "Connection Latency Detected: Optimizing Registry Link..." 
          : `Registry Integrity Error: ${error.response?.data?.message || "Protocol Refused"}`
        );
      }
    } finally {
      if (isMounted.current) {
        console.log("[POS Registry] Cycle complete, releasing loading lock.");
        setLoading(false);
      }
    }
  }, [products.length]); // Dependency on length to know if we need to show skeletons

  useEffect(() => {
    isMounted.current = true;
    
    // Initial Bootstrap
    fetchProducts();

    // Live Pulse Sync: Refresh registry every 60 seconds (silent)
    const pulseInterval = setInterval(() => {
      fetchProducts(true);
    }, 60000);

    // Focus Protocol: Refresh when user returns to tab
    const handleFocus = () => {
      console.log("[POS Protocol] Window focus detected, silent sync triggered");
      fetchProducts(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted.current = false;
      clearInterval(pulseInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchProducts]);

  // Performance-Optimized Product Filtering
  const filteredProducts = React.useMemo(() => {
    console.log("[POS Engine] Re-calculating filtered assets...");
    return products.filter(p => {
      const normalize = (val) => String(val || "").trim().toLowerCase();
      const activeCat = normalize(selectedCategory);
      
      const matchesCat = activeCat === "all" || (p.pCategory && (
        Array.isArray(p.pCategory) 
          ? p.pCategory.some(c => normalize(c) === activeCat)
          : normalize(p.pCategory) === activeCat
      ));

      const matchesSearch = normalize(p.pName).includes(normalize(search)) || 
                            normalize(p.productId).includes(normalize(search));
                            
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, search]);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { type: 'DirectSale' }
      });
      const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistory(sortedData);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCancelSale = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this sale? This will restore inventory.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`, { orderStatus: 'Cancelled' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Sale cancelled");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel sale");
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
        const isWeight = item.unit?.toLowerCase() === 'kg' || item.unit?.toLowerCase() === 'g';
        const step = isWeight ? 0.1 : 1;
        const newQty = Math.max(0, Math.round((item.quantity + (delta * step)) * 100) / 100);
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
        customerName: customerName.trim() || "Walk-in Customer",
        type: "DirectSale",
        items: cart.map(item => ({
          pName: item.pName,
          category: Array.isArray(item.pCategory) ? item.pCategory.join(', ') : (item.pCategory || 'General'),
          quantity: item.quantity,
          unit: item.unit || 'pcs',
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
      setCustomerName("");
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



  const getCategoryCount = (catName) => {
    const normalize = (val) => String(val || "").trim().toLowerCase();
    const target = normalize(catName);
    if (target === "all") return products.length;
    return products.filter(p => 
      Array.isArray(p.pCategory) 
        ? p.pCategory.some(c => normalize(c) === target)
        : normalize(p.pCategory) === target
    ).length;
  };

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
              <div className="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]"></div>
              POS <span className="text-slate-400 font-bold italic lowercase">terminal</span>
              <div className="flex items-center gap-3 ml-6">
                <button 
                  onClick={() => {
                    if (view === 'catalog') {
                      setView('history');
                      fetchHistory();
                    } else {
                      setView('catalog');
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg active:scale-95 ${
                    view === 'history' ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-900 text-gold hover:bg-primary hover:text-white shadow-slate-900/10'
                  }`}
                >
                  {view === 'catalog' ? <><History size={16} /> Sale History</> : <><ArrowLeft size={16} /> Back to Catalog</>}
                </button>
                {view === 'catalog' && (
                  <button 
                    onClick={fetchProducts}
                    disabled={loading}
                    className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-primary rounded-xl transition-all shadow-sm active:rotate-180 duration-500 disabled:opacity-50"
                    title="Force Sync"
                  >
                    <Package size={18} />
                  </button>
                )}
              </div>
            </h1>
            
            {view === 'catalog' && (
              <div className="relative group w-full md:w-96">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="text-slate-400 group-focus-within:text-primary transition-all duration-300" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-6 py-3.5 bg-white border border-slate-200 outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400 font-black shadow-sm rounded-xl text-[11px] uppercase tracking-wider"
                />
              </div>
            )}
          </div>

          {view === 'catalog' && (
            <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar border-b border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 flex items-center gap-2 ${
                    selectedCategory === cat
                    ? "bg-slate-900 text-gold shadow-xl shadow-slate-900/20" 
                    : "bg-white text-slate-500 hover:text-slate-900 border border-slate-100 hover:border-slate-300"
                  }`}
                >
                  {cat}
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black ${
                    selectedCategory === cat ? "bg-white/10 text-gold" : "bg-slate-100 text-slate-400"
                  }`}>
                    {getCategoryCount(cat)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </header>

        {view === 'catalog' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Master Product Registry Grid */}
            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 no-scrollbar pb-20">
              {(() => {
                const totalAssets = products.length;
                const filteredCount = filteredProducts.length;
                
                console.log("[POS UI] Heartbeat:", { 
                  state: loading ? 'SYNCING' : 'IDLE', 
                  registry_total: totalAssets, 
                  filtered_view: filteredCount,
                  active_category: selectedCategory,
                  search_buffer: search || 'EMPTY'
                });
                
                // Case A: Initial Sync / Cold Start
                if (loading && totalAssets === 0) {
                  return Array(12).fill(0).map((_, i) => (
                    <div key={`skeleton-${i}`} className="p-5 rounded-[32px] bg-white border border-slate-100 animate-pulse h-[280px] flex flex-col gap-4">
                      <div className="w-28 h-28 mx-auto bg-slate-50 rounded-full shadow-inner"></div>
                      <div className="h-4 w-3/4 mx-auto bg-slate-50 rounded-full"></div>
                      <div className="h-3 w-1/2 mx-auto bg-slate-50 rounded-full"></div>
                      <div className="mt-auto h-10 w-full bg-slate-50 rounded-2xl"></div>
                    </div>
                  ));
                }

                // Case B: Registry Connection Succeeded but Filter resulted in null set
                if (filteredCount === 0) {
                  return (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200 shadow-inner">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                        <XCircle size={40} className="text-slate-300" />
                      </div>
                      <h3 className="font-black uppercase tracking-[0.2em] text-[12px] text-slate-900 mb-2">No Assets in current view</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-10">
                        The registry query for <span className="text-primary">"{selectedCategory}"</span> returned zero entries.
                      </p>
                      <div className="flex gap-4 mt-8">
                        <button 
                          onClick={() => { setSelectedCategory("All"); setSearch(""); }}
                          className="px-8 py-3 bg-slate-900 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                          Reset Filters
                        </button>
                        <button 
                          onClick={() => fetchProducts()}
                          className="px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                        >
                          Force Re-Sync
                        </button>
                      </div>
                    </div>
                  );
                }

                // Case C: Nominal Operation - Rendering Transmission Nodes
                return filteredProducts.map((product, idx) => {
                  // Resilient Data Mapping
                  const pId = product.productId || product._id?.slice(-8) || `UNK-${idx}`;
                  const pName = product.pName || "Unnamed Asset";
                  const pPrice = typeof product.price === 'number' ? product.price : 0;
                  const pUnit = product.unit || "pcs";
                  const pStock = typeof product.stock === 'number' ? product.stock : 0;
                  const pImage = product.images?.[0] || product.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729";

                  return (
                    <button
                      key={product._id || `product-${idx}`}
                      onClick={() => addToCart(product)}
                      className="bg-white p-5 rounded-[32px] text-center group border border-slate-100 hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col gap-4 relative overflow-hidden h-full min-h-[300px]"
                    >
                      {/* Interaction Layer */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-10">
                        <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40"><Plus size={20} /></div>
                      </div>
                      
                      {/* Visual Identity */}
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-50 p-1.5 border border-slate-100 group-hover:border-primary/30 transition-all duration-700 shadow-inner">
                        <img 
                          src={pImage} 
                          alt={pName}
                          className="w-full h-full object-cover rounded-full group-hover:scale-125 transition-transform duration-1000"
                          loading="lazy"
                        />
                      </div>

                      {/* Attribute Cluster */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="space-y-1">
                          <h3 className="font-black text-slate-900 text-xs uppercase tracking-tight line-clamp-2 h-9 group-hover:text-primary transition-colors leading-relaxed">
                            {pName}
                          </h3>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{pId}</p>
                        </div>

                        <div className="mt-auto space-y-3">
                          <div className="flex items-center justify-between px-2">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                             <p className="text-lg font-black text-slate-900 tracking-tighter">Rs.{pPrice.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center justify-between px-2 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pUnit}</span>
                             <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                                pStock > 10 ? 'text-emerald-600' : 
                                pStock > 0 ? 'text-amber-600' : 
                                'text-rose-600'
                             }`}>
                               {pStock > 0 ? `${pStock} Avail` : 'Out of Sync'}
                             </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="flex items-center justify-between mb-8 pr-4">
                <div>
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent Sale History</h2>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Manage your in-store sales</p>
                </div>
                <button 
                  onClick={() => setView('catalog')}
                  className="px-6 py-3.5 bg-slate-900 text-gold rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all active:scale-95"
                >
                  <Plus size={18} /> New Sale
                </button>
             </div>

             <div className="flex-1 overflow-y-auto pr-4 no-scrollbar">
                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {historyLoading ? (
                        <tr><td colSpan="5" className="py-24 text-center font-black text-[11px] text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading records...</td></tr>
                      ) : history.length === 0 ? (
                        <tr><td colSpan="5" className="py-24 text-center font-black text-[11px] text-slate-400 uppercase tracking-[0.4em]">No sales found</td></tr>
                      ) : (
                        history.map(order => (
                          <tr key={order._id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-5">
                              <p className="font-mono text-[11px] font-black text-slate-900 uppercase leading-none mb-1.5">SEQ: {order._id.slice(-6).toUpperCase()}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(order.createdAt).toLocaleString()}</p>
                            </td>
                            <td className="px-8 py-5">
                              <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{order.customerName}</p>
                            </td>
                            <td className="px-8 py-5 font-black text-slate-900 text-base tracking-tighter">Rs.{order.totalAmount.toLocaleString()}</td>
                            <td className="px-8 py-5">
                              <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${
                                order.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right flex items-center justify-end gap-3">
                               <button 
                                 onClick={() => setCompletedOrder(order)}
                                 className="p-2.5 bg-white text-slate-400 hover:text-primary hover:border-primary border border-slate-100 rounded-xl transition-all shadow-sm"
                                 title="Review Bill"
                               >
                                 <Eye size={18} />
                               </button>

                               {order.orderStatus !== 'Cancelled' && (
                                 <button 
                                   onClick={() => handleCancelSale(order._id)}
                                   className="p-2.5 bg-white text-slate-400 hover:text-rose-600 hover:border-rose-100 border border-slate-100 rounded-xl transition-all shadow-sm"
                                   title="Cancel Sale"
                                 >
                                   <XCircle size={18} />
                                 </button>
                               )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Right Side: Cart & Checkout */}
      <div className="h-full min-w-0 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
          
          {/* Cart Header */}
          <div className="p-8 border-b border-slate-50 flex flex-col gap-4 shrink-0 bg-slate-50/30">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-900 text-gold rounded-2xl shadow-xl flex items-center justify-center">
                  <ShoppingCart size={24} />
                </div>
                <div className="space-y-1">
                   <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Cart</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sale Items</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black border border-slate-900 shadow-lg uppercase tracking-widest">{cart.length} Items</span>
              </div>
            </div>
          </div>

          {/* Cart Items - Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-8 space-y-2 min-h-0 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center shadow-inner group transition-transform hover:scale-110">
                  <ShoppingCart size={48} className="text-slate-200" />
                </div>
                <div>
                  <p className="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Empty Cart</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold italic px-8">Select items to begin a sale.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                {cart.map((item, idx) => (
                  <div key={item._id} className="bg-white border-b border-slate-50 py-4 group transition-all hover:bg-slate-50/30">
                    <div className="flex items-center justify-between gap-4">
                      {/* Name - Left Aligned */}
                      <div className="flex-1 min-w-0 flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-300 w-5 shrink-0 italic">{String(idx + 1).padStart(2, '0')}</span>
                        <div className="w-full">
                          <input 
                            type="text" 
                            value={item.pName}
                            onChange={(e) => {
                              const newName = e.target.value;
                              setCart(prev => prev.map(c => c._id === item._id ? { ...c, pName: newName } : c));
                            }}
                            className="bg-transparent border-none outline-none font-black text-slate-900 text-[11px] uppercase tracking-wider w-full focus:ring-0 p-0 h-4 truncate hover:text-primary transition-colors cursor-text"
                          />
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Product</p>
                        </div>
                      </div>

                      {/* Quantity Controls - Center */}
                      <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shrink-0">
                        <button 
                          onClick={() => updateQuantity(item._id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="flex flex-col items-center px-1">
                          <input 
                            type="number"
                            step={item.unit?.toLowerCase() === 'kg' ? "0.1" : "1"}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setCart(prev => prev.map(c => c._id === item._id ? { ...c, quantity: val } : c));
                            }}
                            className="bg-transparent border-none outline-none font-black text-slate-900 text-[12px] w-14 text-center focus:ring-0 p-0"
                          />
                          <select 
                            value={item.unit || 'pcs'} 
                            onChange={(e) => {
                              const newUnit = e.target.value;
                              setCart(prev => prev.map(c => c._id === item._id ? { ...c, unit: newUnit } : c));
                            }}
                            className="text-[8px] font-black text-primary uppercase bg-transparent outline-none cursor-pointer appearance-none text-center hover:text-slate-900 transition-colors"
                          >
                            <option value="pcs">pcs</option>
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="ml">ml</option>
                            <option value="l">l</option>
                            <option value="box">box</option>
                            <option value="pkt">pkt</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => updateQuantity(item._id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      {/* Price - Right Aligned */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="font-black text-slate-900 text-[13px] tracking-tighter block leading-none">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Line Total</span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Cart Footer */}
          <div className="p-8 bg-slate-900 backdrop-blur-xl border-t border-white/5 space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] relative z-20 shrink-0 text-white">
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 px-5 py-3.5 rounded-2xl border border-white/10 group focus-within:border-primary transition-all">
                <User size={20} className="text-primary" />
                <div className="flex flex-col flex-1">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mb-1.5">Customer Details</span>
                   <input 
                     type="text" 
                     value={customerName} 
                     onChange={(e) => setCustomerName(e.target.value)}
                     className="bg-transparent border-none outline-none text-sm text-white font-black w-full uppercase tracking-tight placeholder:text-slate-600 focus:ring-0 p-0"
                     placeholder="Walk-in Customer"
                   />
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/10">
                     <Banknote size={20} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-white uppercase tracking-widest">Payment Method</p>
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">Cash Payment</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Due</p>
                   <span className="text-3xl font-black text-gold tracking-tighter drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Rs.{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="flex-1 py-5 bg-primary text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:bg-white hover:text-slate-900 transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 disabled:grayscale"
              >
                {loading ? "Processing..." : "Complete Sale"}
                {!loading && <CheckCircle2 size={20} />}
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