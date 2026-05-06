import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  ExternalLink,
  Loader2,
  X,
  Save,
  Settings
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
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editForm, setEditForm] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      const data = await res.json();
      setCategories(data.data || []);
    } catch {
      toast.error("Failed to load categories");
    }
  };

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
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(editForm),
      });
      const updated = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setEditProduct(null);
      toast.success("Product updated");
      fetchProducts(); // Refresh to ensure all data is synced
    } catch {
      toast.error("Update failed");
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== "All") setSearch("");
  };

  const filtered = products.filter(
    (p) => {
      const matchesCat = selectedCategory === "All" || 
                        (p.pCategory && (
                          Array.isArray(p.pCategory) 
                            ? p.pCategory.some(pCat => pCat.trim().toLowerCase() === selectedCategory.toLowerCase())
                            : p.pCategory.trim().toLowerCase() === selectedCategory.toLowerCase()
                        ));
      
      const matchesSearch = p.pName?.toLowerCase().includes(search.toLowerCase()) ||
                           p.productId?.toLowerCase().includes(search.toLowerCase()) ||
                           p.pCategory?.toLowerCase().includes(search.toLowerCase());
      
      return matchesCat && matchesSearch;
    }
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
            <p className="text-primary font-black uppercase tracking-[0.4em] text-[9px]"></p>
          </div>
          <h1 className="heading-premium text-2xl md:text-5xl leading-tight">
            Product Details
            {/* <span className="italic font-medium text-slate-400">Inventory</span> */}
          </h1>
          {/* <p className="text-slate-400 font-medium mt-2 md:mt-3 text-sm md:text-base">
            Manage your premium collection and real-time stock levels.
          </p> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={16} md:size={18} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value) setSelectedCategory("All");
              }}
              className="pl-11 pr-5 py-3 rounded-lg md:rounded-xl bg-white border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary w-full sm:w-60 md:w-64 transition-all font-bold text-slate-900 placeholder:text-slate-200 shadow-sm text-xs md:text-sm"
            />
          </div>
          <button
            onClick={() => navigate("/addproduct")}
            className="py-3 px-6 md:px-8 bg-slate-900 text-gold rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-primary hover:text-white transition-all duration-500 flex items-center justify-center gap-2.5"
          >
            <Plus size={18} md:size={20} /> Add New Product
          </button>
        </div>
      </header>

      {/* Categories Scroller */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-slate-100">
        <button
          onClick={() => toggleCategory("All")}
          className={`px-6 py-2.5 rounded-lg whitespace-nowrap font-black text-[9px] uppercase tracking-widest transition-all duration-500 border ${
            selectedCategory === "All"
            ? "bg-slate-900 text-gold border-slate-900 shadow-lg -translate-y-0.5" 
            : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100"
          }`}
        >
          All Assets
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => toggleCategory(cat.name)}
            className={`px-6 py-2.5 rounded-lg whitespace-nowrap font-black text-[9px] uppercase tracking-widest transition-all duration-500 border ${
              selectedCategory === cat.name
              ? "bg-slate-900 text-gold border-slate-900 shadow-lg -translate-y-0.5" 
              : "bg-white text-slate-400 hover:bg-slate-50 border-slate-100"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

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
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Products search yielded zero results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Product Name</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Category</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Unit Value</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Inventory State</th>
                  <th className="px-6 md:px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Actions</th>
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
                            <p className="font-black text-slate-900 group-hover:text-primary transition-colors  text-sm md:text-base">{p.pName}</p>
                            <div className="flex items-center gap-2 mt-1 px-1.5 py-0.5 bg-slate-50 rounded-md w-fit">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.productId}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          {Array.isArray(p.pCategory) ? (
                            p.pCategory.map((cat, idx) => (
                              <span key={idx} className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-[8px] font-black uppercase tracking-widest border border-slate-100 whitespace-nowrap">
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="px-3.5 md:px-4 py-1.5 rounded-full bg-slate-50 text-slate-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-100 whitespace-nowrap">
                              {p.pCategory}
                            </span>
                          )}
                        </div>
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

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
            <div className="p-8 md:p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 text-gold rounded-2xl"><Edit3 size={24} /></div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Edit Product</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Master Registry</p>
                  </div>
               </div>
               <button onClick={() => setEditProduct(null)} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                 <X size={24} />
               </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                    value={editForm.pName}
                    onChange={(e) => setEditForm({...editForm, pName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (Rs.)</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Quantity</label>
                  <input 
                    type="number"
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({...editForm, stock: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Measurement Unit</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 appearance-none cursor-pointer"
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
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
                <div className="space-y-2 flex flex-col justify-end">
                   <label className="flex items-center gap-3 cursor-pointer group mb-2">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Raw Ingredient Status</span>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={editForm.isIngredient}
                          onChange={(e) => setEditForm({...editForm, isIngredient: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-slate-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                   </label>
                </div>
              </div>

              {!editForm.isIngredient && (
                <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 text-gold rounded-lg border border-white/10"><Settings size={18} /></div>
                        <h3 className="text-base font-black text-white tracking-tight uppercase">Recipe Configuration</h3>
                     </div>
                     <button 
                        type="button"
                        onClick={() => setEditForm(prev => ({
                          ...prev,
                          recipe: [...(prev.recipe || []), { ingredientId: "", quantity: 1 }]
                        }))}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        + Add Ingredient
                      </button>
                  </div>

                  <div className="space-y-4">
                    {(editForm.recipe || []).map((item, index) => (
                      <div key={index} className="flex items-end gap-4">
                        <div className="flex-1 space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Ingredient</label>
                          <select 
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold transition-all font-bold text-white text-sm"
                            value={item.ingredientId?._id || item.ingredientId}
                            onChange={(e) => {
                              const newRecipe = [...editForm.recipe];
                              newRecipe[index].ingredientId = e.target.value;
                              setEditForm({...editForm, recipe: newRecipe});
                            }}
                          >
                            <option value="" className="bg-slate-900">Choose...</option>
                            {products.filter(p => p.isIngredient).map(p => (
                              <option key={p._id} value={p._id} className="bg-slate-900">{p.pName} ({p.unit})</option>
                            ))}
                          </select>
                        </div>
                        <div className="w-24 space-y-2">
                          <label className="text-[9px] font-black text-white/30 uppercase tracking-widest ml-1">Qty</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-white text-sm"
                            value={item.quantity}
                            onChange={(e) => {
                              const newRecipe = [...editForm.recipe];
                              newRecipe[index].quantity = Number(e.target.value);
                              setEditForm({...editForm, recipe: newRecipe});
                            }}
                          />
                        </div>
                        <button 
                          onClick={() => {
                            const newRecipe = editForm.recipe.filter((_, i) => i !== index);
                            setEditForm({...editForm, recipe: newRecipe});
                          }}
                          className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {(!editForm.recipe || editForm.recipe.length === 0) && (
                      <div className="py-8 text-center border-2 border-dashed border-white/5 rounded-[24px]">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">No recipe ingredients assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 md:p-10 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 shrink-0">
               <button 
                onClick={() => setEditProduct(null)}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
               >
                 Discard
               </button>
               <button 
                onClick={handleEditSave}
                className="px-10 py-4 bg-slate-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl shadow-slate-200"
               >
                 Save Changes
                 <Save size={16} />
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
