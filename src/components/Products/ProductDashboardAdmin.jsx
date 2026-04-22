import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/products`;

export default function ProductDashboardAdmin() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/`, {
        headers: { 
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setProducts(data.data || data);
    } catch {
      setError("Failed to fetch products");
      toast.error("Catalog loading failed");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteId(null);
      toast.success("Product removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditForm({ ...product });
  };

  const handleEditSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/update/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setEditProduct(null);
      toast.success("Product updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.pName?.toLowerCase().includes(search.toLowerCase()) ||
      p.productId?.toLowerCase().includes(search.toLowerCase()) ||
      p.pCategory?.toLowerCase().includes(search.toLowerCase())
  );

  const stockStatus = (stock) => {
    if (stock <= 3) return { label: "Low Stock", class: "bg-rose-50 text-rose-600" };
    if (stock <= 6) return { label: "Limited", class: "bg-amber-50 text-amber-600" };
    return { label: "In Stock", class: "bg-emerald-50 text-emerald-600" };
  };

  return (
    <div className="space-y-10 max-w-[1500px] mx-auto">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-10 h-1 bg-primary rounded-full"></span>
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Catalog Infrastructure</p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Product <span className="italic font-medium text-slate-400">Inventory</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">
            Manage your premium collection and real-time stock levels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-5 py-3 rounded-lg md:rounded-xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary w-full sm:w-60 md:w-64 transition-all font-bold text-slate-900 placeholder:text-slate-200 shadow-sm text-xs md:text-sm"
            />
          </div>
          <button
            onClick={() => navigate("/addproduct")}
            className="py-3 px-6 md:px-8 bg-slate-900 text-gold rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-2.5"
          >
            <Plus size={18} md:size={20} /> Add New Asset
          </button>
        </div>
      </header>

      {/* Table Container */}
      <div className="glass-card rounded-[24px] md:rounded-[40px] overflow-hidden bg-white/70 backdrop-blur-xl border-none shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-40 gap-6">
            <Loader2 className="w-10 h-10 md:w-14 md:h-14 text-primary animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] italic">Synchronizing Master Catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-40 space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Package size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Registry search yielded zero results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Asset Designation</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Taxonomy</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Unit Valuation</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventory State</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Ops Control</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => {
                  const status = stockStatus(p.stock);
                  return (
                    <tr key={p._id} className="hover:bg-white transition-all duration-300 group">
                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-[24px] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-700 bg-slate-100 border border-slate-50 shrink-0">
                            <img
                              src={p.pImg?.[0] || "https://images.unsplash.com/photo-1621303837174-89787a7d4729"}
                              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000"
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight text-sm md:text-base">{p.pName}</p>
                            <div className="flex items-center gap-2 mt-1 px-1.5 py-0.5 bg-slate-50 rounded-md w-fit">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.productId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                        <span className="px-3.5 md:px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-100 whitespace-nowrap">
                          {p.pCategory}
                        </span>
                      </td>

                      <td className="px-6 md:px-10 py-4 md:py-6 font-black text-slate-900 text-base md:text-lg tracking-tighter">
                        <span className="text-primary text-[9px] mr-1 opacity-50 font-black">Rs.</span>
                        {p.price.toLocaleString()}
                      </td>

                      <td className="px-6 md:px-10 py-4 md:py-6">
                        <div className="space-y-2 md:space-y-2.5 min-w-[120px] md:min-w-[140px]">
                          <div className="flex items-center justify-between">
                             <div className={`px-2.5 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border ${status.class}`}>
                               {status.label}
                             </div>
                             <span className="text-[11px] md:text-xs font-black text-slate-900">{p.stock}</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${p.stock <= 3 ? 'bg-primary' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 md:px-12 py-6 md:py-8 text-right">
                        <div className="flex justify-end gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEditOpen(p)}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:shadow-xl transition-all"
                          >
                            <Edit3 size={18} md:size={20} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(p._id)}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-rose-100 text-rose-300 hover:text-rose-500 hover:shadow-xl transition-all"
                          >
                            <Trash2 size={18} md:size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="glass-card bg-white p-12 rounded-[56px] max-w-md w-full shadow-2xl relative overflow-hidden border-none">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
            <div className="w-20 h-20 bg-rose-50 text-primary rounded-[28px] flex items-center justify-center mb-8 mx-auto">
               <Trash2 size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 text-center tracking-tight">Erase Asset?</h3>
            <p className="text-slate-400 font-medium mb-10 text-center leading-relaxed italic">"Permanently purging this item from the master catalog is an irreversible protocol."</p>
            <div className="flex flex-col gap-4">
              <button onClick={() => handleDelete(deleteId)} className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all duration-500">Confirm Deletion</button>
              <button onClick={() => setDeleteId(null)} className="w-full py-5 font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest text-[10px] transition-colors">Abort Operation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
