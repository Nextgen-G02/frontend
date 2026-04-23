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
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryDashboard = () => {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    
    // Filters
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [stockStatus, setStockStatus] = useState("All");

    useEffect(() => {
        fetchInventory();
        fetchCategories();
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

    const updateThreshold = async (id, newLevel) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/${id}/threshold`, 
                { lowStockLevel: parseInt(newLevel) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Alert level updated");
            fetchInventory();
        } catch (error) {
            toast.error("Update failed");
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
        <div className="space-y-10 max-w-[1500px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <span className="w-10 h-1 bg-primary rounded-full"></span>
                        <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Inventory Control</p>
                    </div>
                    <h1 className="heading-premium text-2xl md:text-5xl">Stock <span className="italic font-medium text-slate-400">Management</span></h1>
                    <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">Monitor product levels, update safety alerts, and sync with your shop database.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                        <div className="p-3.5 bg-slate-900 text-gold rounded-xl shadow-lg"><Activity size={20} md:size={24} /></div>
                        <span className="px-3.5 py-1 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[8.5px] md:text-[9px] font-black uppercase tracking-widest leading-none">Catalog</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10 leading-none">Total Products</p>
                    <p className="text-3xl md:text-5xl font-black text-slate-900 mt-1.5 md:mt-2 tracking-tighter relative z-10 leading-none">{inventory.length}</p>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                        <div className="p-3.5 bg-primary text-white rounded-xl shadow-xl shadow-primary/20"><AlertTriangle size={20} md:size={24} /></div>
                        <span className="px-3.5 py-1 bg-rose-50 text-primary border border-rose-100 rounded-full text-[8.5px] md:text-[9px] font-black uppercase tracking-widest leading-none">Alerts</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10 leading-none">Low Stock Items</p>
                    <p className="text-3xl md:text-5xl font-black text-slate-900 mt-1.5 md:mt-2 tracking-tighter relative z-10 leading-none">{inventory.filter(i => i.quantity <= i.lowStockLevel).length}</p>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-[32px] md:rounded-[48px] bg-slate-900 border-none shadow-2xl relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-10"></div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                        <div className="p-3.5 bg-white/10 text-gold rounded-xl border border-white/5 backdrop-blur-xl"><ShieldCheck size={20} md:size={24} /></div>
                        <span className="px-3.5 py-1 bg-white/5 text-gold border border-white/10 rounded-full text-[8.5px] md:text-[9px] font-black uppercase tracking-widest leading-none">Health</span>
                    </div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest relative z-10 leading-none">Inventory Health</p>
                    <p className="text-3xl md:text-5xl font-black text-white mt-1.5 md:mt-2 tracking-tighter relative z-10 leading-none">
                        {inventory.length > 0 ? Math.round(((inventory.length - inventory.filter(i => i.quantity <= i.lowStockLevel).length) / inventory.length) * 100) : 100}
                        <span className="text-xl md:text-2xl text-slate-600">%</span>
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
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
                        <option value="Low">Low Stock Only</option>
                        <option value="Optimal">Optimal Only</option>
                    </select>
                </div>
                <div className="flex items-end pb-1 px-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-tight">Showing {filteredInventory.length} of {inventory.length} assets</p>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="glass-card rounded-[32px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-100 shadow-xl">
                <div className="p-7 md:p-8 border-b border-slate-50 bg-white/50 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Product Registry</h2>
                    <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        Live Updates
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Product Info</th>
                                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Category</th>
                                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Stock Level</th>
                                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Alert At</th>
                                <th className="px-8 md:px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <Loader2 className="animate-spin text-primary mx-auto mb-6" size={56} />
                                        <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-400">Loading Registry Protocol State...</p>
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-12 py-40 text-center">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <Package size={48} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Registry is void. Await synchronization.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const isLow = item.quantity <= item.lowStockLevel;
                                    const productImage = item.productId?.images?.[0];
                                    
                                    return (
                                        <tr key={item._id} className="hover:bg-white transition-all duration-300 group border-b border-slate-50/50">
                                            <td className="px-8 md:px-10 py-5 md:py-6">
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
                                            <td className="px-8 md:px-10 py-5 md:py-6">
                                                <span className="px-3.5 py-1.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                    {item.productId?.pCategory || "No Category"}
                                                </span>
                                            </td>
                                            <td className="px-8 md:px-10 py-5 md:py-6">
                                                <div className="flex flex-col">
                                                   <span className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${isLow ? "text-primary" : "text-slate-900"}`}>
                                                       {item.quantity}
                                                   </span>
                                                   <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 leading-none">Units in Stock</span>
                                                </div>
                                            </td>
                                            <td className="px-8 md:px-10 py-5 md:py-6">
                                                <div className="relative w-28 md:w-32 group/input">
                                                    <input 
                                                        type="number"
                                                        defaultValue={item.lowStockLevel}
                                                        onBlur={(e) => updateThreshold(item._id, e.target.value)}
                                                        className="w-full pl-4 md:pl-5 pr-8 md:pr-10 py-3 md:py-3.5 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary text-xs md:text-sm font-black text-slate-900 transition-all shadow-sm"
                                                    />
                                                    <Settings className="absolute right-3.5 top-3 md:top-3.5 text-slate-300 group-hover/input:text-primary transition-colors" size={14} md:size={16} />
                                                </div>
                                            </td>
                                            <td className="px-8 md:px-10 py-5 md:py-6">
                                                <div className="flex flex-col gap-2">
                                                    {isLow ? (
                                                        <span className="inline-flex items-center gap-2.5 px-3.5 md:px-5 py-1.5 md:py-2 bg-rose-50 text-primary border border-rose-100 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none w-fit">
                                                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-primary rounded-full animate-ping"></div> LOW STOCK
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2.5 px-3.5 md:px-5 py-1.5 md:py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] leading-none w-fit">
                                                            <ShieldCheck size={12} md:size={14} /> HEALTHY
                                                        </span>
                                                    )}
                                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest ml-1">
                                                        Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                </table>
            </div>
        </div>
    </div>
);
};

export default InventoryDashboard;
