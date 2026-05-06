import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Package, 
  RefreshCw, 
  AlertTriangle, 
  Settings, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Loader2,
  History,
  ArrowDownLeft,
  PlusCircle,
  MinusCircle,
  X,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("Stock"); // "Stock" or "Usage"
    
    // Filters
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [stockStatus, setStockStatus] = useState("All");
    
    // Update Modal State
    const [selectedItem, setSelectedItem] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [updateQty, setUpdateQty] = useState(0);
    const [updateReason, setUpdateReason] = useState("Restock");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchInventory();
        fetchCategories();
        fetchHistory();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Fixed: categories are nested in .data.data
            setCategories(response.data.data || []);
        } catch (error) {
            console.error("Failed to load categories");
        }
    };

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventory`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data.data);
        } catch (error) {
            toast.error("Could not load inventory");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(response.data.data);
        } catch (error) {
            console.error("Failed to load history");
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            const token = localStorage.getItem("token");
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/sync`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Stock refreshed from database");
            fetchInventory();
        } catch (error) {
            toast.error("Sync failed");
        } finally {
            setSyncing(false);
        }
    };

    const handleStockUpdate = async () => {
        if (!selectedItem || updateQty === 0) return;
        
        try {
            setUpdating(true);
            const token = localStorage.getItem("token");
            const newStock = selectedItem.quantity + Number(updateQty);
            
            if (newStock < 0) {
                toast.error("Stock cannot be negative");
                return;
            }

            // Reason Consistency Validation
            if (updateQty > 0 && (updateReason === 'Expired' || updateReason === 'Damaged')) {
                toast.error("Alert: You cannot select 'Expired' or 'Damaged' when ADDING stock!");
                return;
            }
            if (updateQty < 0 && updateReason === 'Restock') {
                toast.error("Alert: 'Restock from Supplier' is only for ADDING stock!");
                return;
            }

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/update/${selectedItem.productId._id}`, 
                { 
                    stock: newStock,
                    updateReason: updateReason 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Inventory updated successfully");
            setUpdateModalOpen(false);
            setUpdateQty(0);
            fetchInventory();
            fetchHistory();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const updateThreshold = async (id, newLevel) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}/threshold`, 
                { lowStockLevel: Number(newLevel) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Alert threshold updated");
            fetchInventory();
        } catch (error) {
            toast.error("Failed to update threshold");
        }
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.productId?.pName?.toLowerCase().includes(search.toLowerCase()) || 
                             item.productId?.productId?.toLowerCase().includes(search.toLowerCase());
        
        const matchesCategory = selectedCategory === "All" || item.productId?.pCategory === selectedCategory;
        
        const isLow = item.quantity <= item.lowStockLevel;
        const matchesStock = stockStatus === "All" || (stockStatus === "Low" ? isLow : !isLow);

        return matchesSearch && matchesCategory && matchesStock;
    });

    return (
        <div className="space-y-10 max-w-full mx-auto p-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-10 h-1 bg-primary rounded-full"></span>
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Stock Management</p>
                    </div>
                    <h1 className="heading-premium text-2xl md:text-5xl">Stock <span className="italic font-medium text-slate-400">Overview</span></h1>
                    <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Check your stock levels and set low stock alerts.</p>
                </div>
                
                <button 
                    onClick={handleSync}
                    disabled={syncing}
                    className="py-4 md:py-4.5 px-8 md:px-10 bg-slate-900 text-gold rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 flex items-center gap-3.5 border border-white/10"
                >
                    <RefreshCw size={18} md:size={20} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Updating..." : "Refresh All Stock"}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20">
                            <Activity size={24} md:size={32} />
                        </div>
                        <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8.5px] md:text-[9px] font-black uppercase tracking-widest leading-none">Products</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest relative z-10 leading-none">Total Products</p>
                    <p className="text-3xl md:text-5xl font-black text-white mt-1.5 md:mt-2 tracking-tighter relative z-10 leading-none">{inventory.length}</p>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                        <div className="p-4 bg-amber-500 text-slate-900 rounded-2xl shadow-xl shadow-amber-500/20">
                            <AlertTriangle size={24} md:size={32} />
                        </div>
                        <span className="px-3.5 py-1.5 bg-amber-500 text-slate-900 rounded-full text-[8.5px] md:text-[9px] font-black uppercase tracking-widest leading-none">Alerts</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest relative z-10 leading-none">Low Stock Items</p>
                    <p className="text-3xl md:text-5xl font-black text-white mt-1.5 md:mt-2 tracking-tighter relative z-10 leading-none">{inventory.filter(i => i.quantity <= i.lowStockLevel).length}</p>
                </div>
            </div>

            {/* Tab Bar - Redesigned as Pill Buttons */}
            <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl w-fit gap-2">
                <button 
                    onClick={() => setActiveTab("Stock")}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl ${
                        activeTab === "Stock" 
                        ? "bg-slate-900 text-white shadow-lg" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                    Current Stock
                </button>
                <button 
                    onClick={() => setActiveTab("Usage")}
                    className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl ${
                        activeTab === "Usage" 
                        ? "bg-slate-900 text-white shadow-lg" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                >
                    Usage History
                </button>
            </div>

            {activeTab === "Stock" ? (
                <>
                {/* Filter Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-white p-8 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-xl mb-10">
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Products</label>
                        <input 
                            type="text"
                            placeholder="Name or Item ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 text-xs font-bold text-slate-900"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">By Category</label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 text-xs font-bold text-slate-900 appearance-none"
                        >
                            <option value="All">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Status</label>
                        <select 
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 text-xs font-bold text-slate-900 appearance-none"
                        >
                            <option value="All">All Items</option>
                            <option value="Low">LOW STOCK</option>
                            <option value="Optimal">IN STOCK</option>
                        </select>
                    </div>
                </div>

            {/* Inventory Table */}
            <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
                <div className="p-7 md:p-8 border-b border-slate-50 bg-white/50 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Stock List</h2>
                    <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        Live Updates
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-full">Product Info</th>
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-32 whitespace-nowrap text-right">Category</th>
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-32 whitespace-nowrap text-center">Stock Level</th>
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-32 whitespace-nowrap text-right">Alert At</th>
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-40 whitespace-nowrap text-center">Status</th>
                                <th className="px-4 md:px-5 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] w-40 whitespace-nowrap text-right">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <Loader2 className="animate-spin text-primary mx-auto mb-6" size={56} />
                                        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading Stock...</p>
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <Package size={48} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No stock found. Please refresh.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const isLow = item.quantity <= item.lowStockLevel;
                                    const productImage = item.productId?.images?.[0];
                                    
                                    return (
                                        <tr key={item._id} className="hover:bg-white transition-all duration-300 group border-b border-slate-50/50">
                                            <td className="px-4 md:px-5 py-4 md:py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:shadow-md transition-all`}>
                                                            {productImage ? (
                                                                <img src={productImage} alt={item.productId?.pName} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package size={24} className="text-slate-200" />
                                                            )}
                                                        </div>
                                                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isLow ? "bg-primary" : "bg-emerald-500 shadow-lg shadow-emerald-200"}`}></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 uppercase tracking-tight text-sm md:text-base leading-tight">{item.productId?.pName || "Undefined Product"}</p>
                                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5">{item.productId?.productId || "NO-ID"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-4 md:py-5 text-right">
                                                <span className="px-3.5 py-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {item.productId?.pCategory || "No Category"}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-5 py-4 md:py-5 text-center">
                                                <div className="flex flex-col items-center">
                                                   <span className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${isLow ? "text-primary" : "text-slate-900"}`}>
                                                       {item.quantity}
                                                   </span>
                                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 leading-none">Units in Stock</span>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-4 md:py-5 text-right">
                                                <div className="relative w-28 md:w-32 group/input ml-auto">
                                                    <input 
                                                        type="number"
                                                        defaultValue={item.lowStockLevel}
                                                        onBlur={(e) => updateThreshold(item._id, e.target.value)}
                                                        className="w-full pl-4 md:pl-5 pr-8 md:pr-10 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-xs md:text-sm font-black text-slate-900 transition-all shadow-sm text-right"
                                                    />
                                                    <Settings className="absolute right-3.5 top-3 md:top-3.5 text-slate-300 group-hover/input:text-primary transition-colors" size={14} md:size={16} />
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-4 md:py-5 text-center">
                                                <div className="flex flex-col gap-2 items-center">
                                                    {isLow ? (
                                                        <span className="inline-flex items-center gap-2.5 px-3.5 md:px-5 py-1.5 md:py-2 bg-rose-50 text-primary border border-rose-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] leading-none w-fit">
                                                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div> LOW STOCK
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2.5 px-3.5 md:px-5 py-1.5 md:py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-[0.2em] leading-none w-fit">
                                                            <ShieldCheck size={14} /> IN STOCK
                                                        </span>
                                                    )}
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-5 py-4 md:py-5 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedItem(item);
                                                        setUpdateModalOpen(true);
                                                    }}
                                                    className="px-4 py-2.5 bg-slate-900 text-gold rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg shadow-slate-100 flex items-center gap-2 ml-auto"
                                                >
                                                    <PlusCircle size={14} /> Update Stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                </table>
            </div>
        </div>
        </>
        ) : (
                <div className="glass-card rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
                    <div className="p-8 border-b border-slate-50 bg-white/50">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Stock Usage Report</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Timestamp</th>
                                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Item Name</th>
                                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Type</th>
                                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Movement</th>
                                    <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Context / Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-12 py-32 text-center">
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No usage logs found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((log) => (
                                        <tr key={log._id} className="hover:bg-white transition-all duration-300 group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 text-slate-400 rounded-lg"><ArrowUpRight size={14} /></div>
                                                    <p className="text-[11px] font-black text-slate-900">{new Date(log.date).toLocaleString()}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{log.productId?.pName}</p>
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">{log.productId?.productId}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                                    log.type === 'IN' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    Stock {log.type === 'IN' ? 'Increase' : 'Decrease'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black ${log.type === 'IN' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {log.type === 'IN' ? '+' : '-'}{log.quantity}
                                                    </span>
                                                    <ArrowDownLeft size={14} className={log.type === 'IN' ? 'text-emerald-300 rotate-180' : 'text-rose-300'} />
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">"{log.reason}"</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stock Update Modal */}
            {updateModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 text-gold rounded-2xl"><Package size={24} /></div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Update Stock</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inventory Inbound/Outbound</p>
                                </div>
                            </div>
                            <button onClick={() => setUpdateModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 md:p-10 space-y-8">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden">
                                    {selectedItem.productId?.images?.[0] ? (
                                        <img src={selectedItem.productId.images[0]} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <Package size={24} className="text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 uppercase tracking-tight">{selectedItem.productId?.pName}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Current: {selectedItem.quantity} Units</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity Adjustment</label>
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={updateQty}
                                            onChange={(e) => setUpdateQty(e.target.value)}
                                            placeholder="Use + for stock in, - for stock out"
                                            className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                            {updateQty > 0 ? <PlusCircle size={20} className="text-emerald-500" /> : updateQty < 0 ? <MinusCircle size={20} className="text-rose-500" /> : <RefreshCw size={20} />}
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-300 italic ml-1">Example: +50 (Add stock), -10 (Damaged/Return)</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason / Context</label>
                                    <select 
                                        value={updateReason}
                                        onChange={(e) => setUpdateReason(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary appearance-none transition-all"
                                    >
                                        <option value="Restock">Restock from Supplier</option>
                                        <option value="Expired">Expired</option>
                                        <option value="Damaged">Damaged / Waste</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button 
                                onClick={() => setUpdateModalOpen(false)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Discard
                            </button>
                            <button 
                                onClick={handleStockUpdate}
                                disabled={updating || updateQty === 0}
                                className="flex-[2] py-4 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:grayscale"
                            >
                                {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryDashboard;
